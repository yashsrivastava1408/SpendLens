// lib/pricing-data.ts
// All pricing constants for AI tools — verified and cited in PRICING_DATA.md
// This file is the single source of truth for all pricing logic

export interface PlanInfo {
  name: string;
  slug: string;
  pricePerUser: number;
  isCustomPricing: boolean;
  features: string[];
  maxRecommendedTeamSize?: number; // if plan isn't suited for larger teams
  minRecommendedTeamSize?: number; // if plan isn't suited for smaller teams
}

export interface ToolPricing {
  name: string;
  slug: string;
  category: 'coding' | 'chat' | 'api' | 'mixed';
  plans: PlanInfo[];
  pricingUrl: string;
}

export const TOOLS: Record<string, ToolPricing> = {
  cursor: {
    name: 'Cursor',
    slug: 'cursor',
    category: 'coding',
    pricingUrl: 'https://www.cursor.com/pricing',
    plans: [
      {
        name: 'Hobby',
        slug: 'hobby',
        pricePerUser: 0,
        isCustomPricing: false,
        features: ['2000 completions', '50 slow premium requests'],
        maxRecommendedTeamSize: 1,
      },
      {
        name: 'Pro',
        slug: 'pro',
        pricePerUser: 20,
        isCustomPricing: false,
        features: ['Unlimited completions', '500 fast premium requests', 'Unlimited slow premium requests'],
        maxRecommendedTeamSize: 5,
      },
      {
        name: 'Business',
        slug: 'business',
        pricePerUser: 40,
        isCustomPricing: false,
        features: ['Everything in Pro', 'Admin dashboard', 'SAML SSO', 'Centralized billing'],
        minRecommendedTeamSize: 5,
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        pricePerUser: 40, // custom pricing, use Business as baseline estimate
        isCustomPricing: true,
        features: ['Everything in Business', 'Custom contracts', 'Dedicated support'],
        minRecommendedTeamSize: 20,
      },
    ],
  },

  'github-copilot': {
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'coding',
    pricingUrl: 'https://github.com/features/copilot#pricing',
    plans: [
      {
        name: 'Individual',
        slug: 'individual',
        pricePerUser: 10,
        isCustomPricing: false,
        features: ['Code completions', 'Chat', 'Multi-model support'],
        maxRecommendedTeamSize: 1,
      },
      {
        name: 'Business',
        slug: 'business',
        pricePerUser: 19,
        isCustomPricing: false,
        features: ['Everything in Individual', 'Organization-wide policies', 'Audit logs'],
        minRecommendedTeamSize: 2,
        maxRecommendedTeamSize: 50,
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        pricePerUser: 39,
        isCustomPricing: false,
        features: ['Everything in Business', 'Fine-tuned models', 'Enterprise security'],
        minRecommendedTeamSize: 50,
      },
    ],
  },

  claude: {
    name: 'Claude',
    slug: 'claude',
    category: 'chat',
    pricingUrl: 'https://www.anthropic.com/pricing',
    plans: [
      {
        name: 'Free',
        slug: 'free',
        pricePerUser: 0,
        isCustomPricing: false,
        features: ['Limited messages', 'Claude 3.5 Sonnet'],
      },
      {
        name: 'Pro',
        slug: 'pro',
        pricePerUser: 20,
        isCustomPricing: false,
        features: ['5x more usage', 'Priority access', 'Claude 3 Opus'],
        maxRecommendedTeamSize: 5,
      },
      {
        name: 'Max',
        slug: 'max',
        pricePerUser: 100,
        isCustomPricing: false,
        features: ['20x more usage', 'Extended thinking'],
        maxRecommendedTeamSize: 5,
      },
      {
        name: 'Team',
        slug: 'team',
        pricePerUser: 25,
        isCustomPricing: false,
        features: ['Everything in Pro', 'Team workspace', 'Admin controls'],
        minRecommendedTeamSize: 2,
        maxRecommendedTeamSize: 50,
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        pricePerUser: 25, // custom pricing, Team baseline
        isCustomPricing: true,
        features: ['SSO/SAML', 'Audit logs', 'Custom contracts'],
        minRecommendedTeamSize: 50,
      },
    ],
  },

  chatgpt: {
    name: 'ChatGPT',
    slug: 'chatgpt',
    category: 'chat',
    pricingUrl: 'https://openai.com/chatgpt/pricing/',
    plans: [
      {
        name: 'Plus',
        slug: 'plus',
        pricePerUser: 20,
        isCustomPricing: false,
        features: ['GPT-4o', 'DALL·E', 'Advanced Data Analysis'],
        maxRecommendedTeamSize: 5,
      },
      {
        name: 'Team',
        slug: 'team',
        pricePerUser: 25,
        isCustomPricing: false,
        features: ['Everything in Plus', 'Admin console', 'Data not used for training'],
        minRecommendedTeamSize: 2,
        maxRecommendedTeamSize: 150,
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        pricePerUser: 25, // custom, Team baseline
        isCustomPricing: true,
        features: ['SSO', 'Domain verification', 'Unlimited GPT-4o'],
        minRecommendedTeamSize: 150,
      },
    ],
  },

  gemini: {
    name: 'Gemini',
    slug: 'gemini',
    category: 'chat',
    pricingUrl: 'https://one.google.com/about/plans',
    plans: [
      {
        name: 'Free',
        slug: 'free',
        pricePerUser: 0,
        isCustomPricing: false,
        features: ['Gemini Pro model', 'Basic features'],
      },
      {
        name: 'Advanced',
        slug: 'advanced',
        pricePerUser: 19.99,
        isCustomPricing: false,
        features: ['Gemini Ultra', '2TB storage', 'Advanced capabilities'],
      },
    ],
  },

  windsurf: {
    name: 'Windsurf',
    slug: 'windsurf',
    category: 'coding',
    pricingUrl: 'https://windsurf.com/pricing',
    plans: [
      {
        name: 'Free',
        slug: 'free',
        pricePerUser: 0,
        isCustomPricing: false,
        features: ['Basic completions', 'Limited premium requests'],
      },
      {
        name: 'Pro',
        slug: 'pro',
        pricePerUser: 15,
        isCustomPricing: false,
        features: ['Unlimited completions', 'Premium requests', 'Advanced models'],
        maxRecommendedTeamSize: 5,
      },
      {
        name: 'Teams',
        slug: 'teams',
        pricePerUser: 35,
        isCustomPricing: false,
        features: ['Everything in Pro', 'Team management', 'Centralized billing'],
        minRecommendedTeamSize: 2,
      },
    ],
  },

  'anthropic-api': {
    name: 'Anthropic API',
    slug: 'anthropic-api',
    category: 'api',
    pricingUrl: 'https://www.anthropic.com/pricing#api',
    plans: [
      {
        name: 'Pay-per-token',
        slug: 'pay-per-token',
        pricePerUser: 0, // usage-based, not per-user
        isCustomPricing: false,
        features: ['Usage-based pricing', 'All Claude models', 'No minimum spend'],
      },
    ],
  },

  'openai-api': {
    name: 'OpenAI API',
    slug: 'openai-api',
    category: 'api',
    pricingUrl: 'https://openai.com/api/pricing/',
    plans: [
      {
        name: 'Pay-per-token',
        slug: 'pay-per-token',
        pricePerUser: 0, // usage-based
        isCustomPricing: false,
        features: ['Usage-based pricing', 'All GPT models', 'Fine-tuning available'],
      },
    ],
  },
};

// Alternative tool mappings: tool → cheaper alternatives for same use case
export const ALTERNATIVES: Record<string, { tool: string; reason: string }[]> = {
  cursor: [
    { tool: 'windsurf', reason: 'Windsurf Pro ($15/user) offers similar AI-assisted coding at 25% less than Cursor Pro ($20/user)' },
    { tool: 'github-copilot', reason: 'GitHub Copilot Individual ($10/user) provides core code completions at 50% less' },
  ],
  'github-copilot': [
    { tool: 'windsurf', reason: 'Windsurf Pro ($15/user) is a competitive AI coding tool at a lower price point than Copilot Business ($19/user)' },
  ],
  windsurf: [
    { tool: 'github-copilot', reason: 'GitHub Copilot Individual ($10/user) is cheaper for basic code completion needs' },
  ],
  claude: [
    { tool: 'chatgpt', reason: 'ChatGPT Plus ($20/user) offers comparable general AI capabilities' },
    { tool: 'gemini', reason: 'Gemini Advanced ($19.99/user) provides similar features with Google ecosystem integration' },
  ],
  chatgpt: [
    { tool: 'claude', reason: 'Claude Pro ($20/user) offers comparable capabilities with strong reasoning' },
    { tool: 'gemini', reason: 'Gemini Advanced ($19.99/user) is a cheaper alternative with multimodal support' },
  ],
  gemini: [
    { tool: 'claude', reason: 'Claude Pro ($20/user) is a strong alternative at the same price point' },
  ],
};

// Credex credit discount range
export const CREDEX_DISCOUNT_MIN = 0.20; // 20% minimum
export const CREDEX_DISCOUNT_MAX = 0.40; // 40% maximum
export const CREDEX_DISCOUNT_AVG = 0.30; // 30% average for estimates

// Savings tier thresholds
export const SAVINGS_TIER_HIGH = 500;    // >$500/mo
export const SAVINGS_TIER_MEDIUM = 100;  // $100-500/mo

// Helper to get a tool by slug
export function getToolBySlug(slug: string): ToolPricing | undefined {
  return TOOLS[slug];
}

// Helper to get a plan by tool slug and plan slug
export function getPlanBySlug(toolSlug: string, planSlug: string): PlanInfo | undefined {
  const tool = TOOLS[toolSlug];
  if (!tool) return undefined;
  return tool.plans.find(p => p.slug === planSlug);
}

// Get all tool slugs
export function getToolSlugs(): string[] {
  return Object.keys(TOOLS);
}

// Get plans for a specific tool
export function getPlansForTool(toolSlug: string): PlanInfo[] {
  return TOOLS[toolSlug]?.plans || [];
}
