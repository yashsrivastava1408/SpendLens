// lib/audit-engine.ts
// Pure functions for auditing AI tool spend. Zero side effects.
// Input: array of tool configs + context. Output: AuditResult object.
// No API calls, no database, just logic.

import {
  TOOLS,
  ALTERNATIVES,
  CREDEX_DISCOUNT_AVG,
  SAVINGS_TIER_HIGH,
  SAVINGS_TIER_MEDIUM,
  getBenchmarkForTeamSize,
  type PlanInfo,
} from './pricing-data';

// ─── Input Types ─────────────────────────────────────────────────

export interface ToolInput {
  tool: string;          // slug, e.g. 'cursor', 'github-copilot'
  plan: string;          // plan slug, e.g. 'business', 'pro'
  seats: number;
  monthlyCost: number;   // total monthly cost (price × seats)
}

export interface AuditContext {
  teamSize: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

// ─── Output Types ────────────────────────────────────────────────

export interface ToolAuditResult {
  tool: string;
  toolName: string;
  currentPlan: string;
  currentMonthlyCost: number;
  recommendedPlan: string;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  recommendedAction: 'downgrade' | 'switch' | 'optimal' | 'credits';
  reasoning: string;
  credexSavingsEstimate: number;
}

export interface AuditResult {
  tools: ToolAuditResult[];
  totalCurrentMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsTier: 'high' | 'medium' | 'low' | 'optimal';
  credexTotalEstimate: number;
  teamSize: number;
  benchmarkData: {
    userSpendPerSeat: number;
    industryBenchmark: number;
    percentDifference: number;
    status: 'above' | 'below' | 'average';
  };
}

// ─── Core Logic ──────────────────────────────────────────────────

/**
 * Determine the savings tier based on monthly savings amount
 */
export function getSavingsTier(monthlySavings: number): AuditResult['savingsTier'] {
  if (monthlySavings > SAVINGS_TIER_HIGH) return 'high';
  if (monthlySavings >= SAVINGS_TIER_MEDIUM) return 'medium';
  if (monthlySavings > 0) return 'low';
  return 'optimal';
}

/**
 * Check 1: Plan fit — is the plan right-sized for the team?
 * Returns the recommended plan if a better fit exists, or null if current is fine.
 */
function checkPlanFit(
  toolSlug: string,
  currentPlan: PlanInfo,
  seats: number,
  teamSize: number
): { plan: PlanInfo; reasoning: string } | null {
  const tool = TOOLS[toolSlug];
  if (!tool) return null;

  const plans = tool.plans;
  const currentIndex = plans.findIndex(p => p.slug === currentPlan.slug);

  // Check if there's a cheaper plan that still fits the team size
  for (let i = 0; i < currentIndex; i++) {
    const cheaperPlan = plans[i];
    if (cheaperPlan.pricePerUser === 0 && currentPlan.pricePerUser > 0) continue; // don't suggest free plan if they're paying
    if (cheaperPlan.isCustomPricing) continue;

    // Check if the cheaper plan supports the team size
    const maxTeam = cheaperPlan.maxRecommendedTeamSize;
    if (maxTeam && teamSize > maxTeam) continue;

    // Check if they'd benefit from downgrading
    const minForCurrent = currentPlan.minRecommendedTeamSize;
    if (minForCurrent && teamSize < minForCurrent) {
      return {
        plan: cheaperPlan,
        reasoning: `${tool.name} ${currentPlan.name} ($${currentPlan.pricePerUser}/user) is designed for teams of ${minForCurrent}+, but your team has ${teamSize} ${teamSize === 1 ? 'user' : 'users'}. ${cheaperPlan.name} ($${cheaperPlan.pricePerUser}/user) covers your needs at a lower cost.`,
      };
    }
  }

  return null;
}

/**
 * Check 2: Cheaper tier — could a lower plan from the same vendor work?
 * Similar to plan fit but focuses on feature requirements vs price.
 */
function checkCheaperTier(
  toolSlug: string,
  currentPlan: PlanInfo,
  seats: number,
  teamSize: number
): { plan: PlanInfo; reasoning: string } | null {
  const tool = TOOLS[toolSlug];
  if (!tool) return null;

  const plans = tool.plans;
  const currentIndex = plans.findIndex(p => p.slug === currentPlan.slug);

  // Only check if they're on a plan higher than the cheapest paid plan
  if (currentIndex <= 1) return null;

  // For solo users or small teams, check if a cheaper plan suffices
  if (teamSize <= 5 && currentPlan.pricePerUser > 20) {
    // Look for a plan in the $10-25 range
    for (let i = 1; i < currentIndex; i++) {
      const plan = plans[i];
      if (plan.isCustomPricing) continue;
      if (plan.pricePerUser > 0 && plan.pricePerUser < currentPlan.pricePerUser) {
        const maxTeam = plan.maxRecommendedTeamSize;
        if (!maxTeam || teamSize <= maxTeam) {
          return {
            plan,
            reasoning: `Your team of ${teamSize} likely doesn't need ${currentPlan.name}-tier features like ${currentPlan.features.slice(-1)[0] || 'enterprise features'}. ${plan.name} ($${plan.pricePerUser}/user) provides the core functionality at a lower price point.`,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Check 3: Cheaper alternative — is there a rival tool that's significantly cheaper?
 */
function checkCheaperAlternative(
  toolSlug: string,
  currentPlan: PlanInfo,
  seats: number,
  useCase: string
): { altTool: string; altPlan: PlanInfo; reasoning: string } | null {
  const alternatives = ALTERNATIVES[toolSlug];
  if (!alternatives || alternatives.length === 0) return null;

  for (const alt of alternatives) {
    const altTool = TOOLS[alt.tool];
    if (!altTool) continue;

    // Find the best comparable plan from the alternative
    const altPlans = altTool.plans.filter(p => p.pricePerUser > 0 && !p.isCustomPricing);
    if (altPlans.length === 0) continue;

    const cheapestAlt = altPlans[0];

    // Only flag if the alternative is at least 20% cheaper
    if (cheapestAlt.pricePerUser < currentPlan.pricePerUser * 0.8) {
      return {
        altTool: alt.tool,
        altPlan: cheapestAlt,
        reasoning: alt.reason,
      };
    }
  }

  return null;
}

/**
 * Check 4: Retail vs credits — are they paying full retail?
 * (Always yes — that's the Credex pitch)
 */
function checkRetailVsCredits(
  currentMonthlyCost: number
): { credexEstimate: number; reasoning: string } {
  const estimatedSavings = Math.round(currentMonthlyCost * CREDEX_DISCOUNT_AVG * 100) / 100;
  return {
    credexEstimate: estimatedSavings,
    reasoning: `You're paying $${currentMonthlyCost}/mo at retail pricing. Credex credits can reduce this by 20-40%, saving an estimated $${estimatedSavings}/mo.`,
  };
}

/**
 * Audit a single tool entry
 */
function auditTool(input: ToolInput, context: AuditContext): ToolAuditResult {
  const tool = TOOLS[input.tool];
  const toolName = tool?.name || input.tool;
  const currentPlan = tool?.plans.find(p => p.slug === input.plan);

  // If tool or plan not found, return as optimal (we can't analyze unknown tools)
  if (!tool || !currentPlan) {
    const credexCheck = checkRetailVsCredits(input.monthlyCost);
    return {
      tool: input.tool,
      toolName,
      currentPlan: input.plan,
      currentMonthlyCost: input.monthlyCost,
      recommendedPlan: input.plan,
      recommendedMonthlyCost: input.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      recommendedAction: input.monthlyCost > 0 ? 'credits' : 'optimal',
      reasoning: input.monthlyCost > 0
        ? credexCheck.reasoning
        : 'Your current spend appears optimal for your usage.',
      credexSavingsEstimate: credexCheck.credexEstimate,
    };
  }

  // For API tools (pay-per-token), we can only suggest credits
  if (tool.category === 'api') {
    const credexCheck = checkRetailVsCredits(input.monthlyCost);
    return {
      tool: input.tool,
      toolName,
      currentPlan: currentPlan.name,
      currentMonthlyCost: input.monthlyCost,
      recommendedPlan: currentPlan.name,
      recommendedMonthlyCost: input.monthlyCost,
      monthlySavings: 0,
      annualSavings: 0,
      recommendedAction: input.monthlyCost > 0 ? 'credits' : 'optimal',
      reasoning: input.monthlyCost > 0
        ? `API usage is pay-per-token. ${credexCheck.reasoning}`
        : 'No current spend on this API.',
      credexSavingsEstimate: credexCheck.credexEstimate,
    };
  }

  // Run the 4 checks in priority order
  let bestSavings = 0;
  let bestAction: ToolAuditResult['recommendedAction'] = 'optimal';
  let bestPlanName = currentPlan.name;
  let bestMonthlyCost = input.monthlyCost;
  let bestReasoning = 'Your current plan is well-suited for your team size and usage. No changes recommended.';

  // Check 1: Plan fit
  const planFitResult = checkPlanFit(input.tool, currentPlan, input.seats, context.teamSize);
  if (planFitResult) {
    const newCost = planFitResult.plan.pricePerUser * input.seats;
    const savings = input.monthlyCost - newCost;
    if (savings > bestSavings) {
      bestSavings = savings;
      bestAction = 'downgrade';
      bestPlanName = planFitResult.plan.name;
      bestMonthlyCost = newCost;
      bestReasoning = planFitResult.reasoning;
    }
  }

  // Check 2: Cheaper tier
  const cheaperTierResult = checkCheaperTier(input.tool, currentPlan, input.seats, context.teamSize);
  if (cheaperTierResult) {
    const newCost = cheaperTierResult.plan.pricePerUser * input.seats;
    const savings = input.monthlyCost - newCost;
    if (savings > bestSavings) {
      bestSavings = savings;
      bestAction = 'downgrade';
      bestPlanName = cheaperTierResult.plan.name;
      bestMonthlyCost = newCost;
      bestReasoning = cheaperTierResult.reasoning;
    }
  }

  // Check 3: Cheaper alternative
  const altResult = checkCheaperAlternative(input.tool, currentPlan, input.seats, context.useCase);
  if (altResult) {
    const newCost = altResult.altPlan.pricePerUser * input.seats;
    const savings = input.monthlyCost - newCost;
    if (savings > bestSavings) {
      bestSavings = savings;
      bestAction = 'switch';
      bestPlanName = `${TOOLS[altResult.altTool]?.name} ${altResult.altPlan.name}`;
      bestMonthlyCost = newCost;
      bestReasoning = altResult.reasoning;
    }
  }

  // Check 4: Retail vs credits (always applies if spending > 0)
  const credexCheck = checkRetailVsCredits(input.monthlyCost);

  // If no other savings found but they're spending money, suggest credits
  if (bestSavings === 0 && input.monthlyCost > 0) {
    bestAction = 'credits';
    bestReasoning = bestReasoning + ' ' + credexCheck.reasoning;
  }

  return {
    tool: input.tool,
    toolName,
    currentPlan: currentPlan.name,
    currentMonthlyCost: input.monthlyCost,
    recommendedPlan: bestPlanName,
    recommendedMonthlyCost: bestMonthlyCost,
    monthlySavings: Math.max(0, bestSavings),
    annualSavings: Math.max(0, bestSavings) * 12,
    recommendedAction: bestAction,
    reasoning: bestReasoning,
    credexSavingsEstimate: credexCheck.credexEstimate,
  };
}

/**
 * Main export: Run a full audit across all tools
 */
export function runAudit(tools: ToolInput[], context: AuditContext): AuditResult {
  const toolResults = tools.map(tool => auditTool(tool, context));

  const totalCurrentMonthlySpend = toolResults.reduce(
    (sum, t) => sum + t.currentMonthlyCost, 0
  );
  const totalMonthlySavings = toolResults.reduce(
    (sum, t) => sum + t.monthlySavings, 0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const credexTotalEstimate = toolResults.reduce(
    (sum, t) => sum + t.credexSavingsEstimate, 0
  );

  const userSpendPerSeat = context.teamSize > 0 
    ? totalCurrentMonthlySpend / context.teamSize 
    : 0;
  const industryBenchmark = getBenchmarkForTeamSize(context.teamSize);
  const percentDifference = industryBenchmark > 0 
    ? ((userSpendPerSeat - industryBenchmark) / industryBenchmark) * 100 
    : 0;

  let status: 'above' | 'below' | 'average' = 'average';
  if (percentDifference > 10) status = 'above';
  else if (percentDifference < -10) status = 'below';

  return {
    tools: toolResults,
    totalCurrentMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsTier: getSavingsTier(totalMonthlySavings),
    credexTotalEstimate,
    teamSize: context.teamSize,
    benchmarkData: {
      userSpendPerSeat,
      industryBenchmark,
      percentDifference,
      status,
    },
  };
}

/**
 * Generate a template-based fallback summary (used when Anthropic API fails)
 */
export function generateFallbackSummary(audit: AuditResult, context: AuditContext): string {
  const toolNames = audit.tools.map(t => t.toolName).join(', ');
  const topSaving = audit.tools.reduce(
    (max, t) => (t.monthlySavings > max.monthlySavings ? t : max),
    audit.tools[0]
  );

  if (audit.totalMonthlySavings === 0) {
    return `Your team of ${context.teamSize} is spending $${audit.totalCurrentMonthlySpend}/mo across ${toolNames}. ` +
      `Our analysis shows your current plans are well-optimized for your ${context.useCase} use case. ` +
      `No immediate plan changes are recommended. However, you could still save an estimated ` +
      `$${Math.round(audit.credexTotalEstimate)}/mo by using Credex credits instead of paying retail pricing. ` +
      `Consider reviewing your usage quarterly to ensure plans remain well-fitted as your team grows.`;
  }

  const actionVerb = topSaving.recommendedAction === 'downgrade' ? 'downgrading' :
    topSaving.recommendedAction === 'switch' ? 'switching from' : 'optimizing';

  return `Your team of ${context.teamSize} is spending $${audit.totalCurrentMonthlySpend}/mo across ${toolNames}. ` +
    `Our audit found $${audit.totalMonthlySavings}/mo in potential savings ($${audit.totalAnnualSavings}/yr). ` +
    `The biggest opportunity: ${actionVerb} ${topSaving.toolName} to save $${topSaving.monthlySavings}/mo. ` +
    `${topSaving.reasoning.split('.')[0]}. Start with this change for immediate impact, ` +
    `then explore Credex credits to save an additional $${Math.round(audit.credexTotalEstimate)}/mo on remaining spend.`;
}
