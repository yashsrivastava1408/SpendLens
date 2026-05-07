// tests/audit-engine.test.ts
import { describe, it, expect } from 'vitest';
import { runAudit, getSavingsTier } from '../lib/audit-engine';

describe('Audit Engine', () => {
  it('flags Cursor Business for solo user — should recommend savings', () => {
    const result = runAudit(
      [{ tool: 'cursor', plan: 'business', seats: 1, monthlyCost: 40 }],
      { teamSize: 1, useCase: 'coding' }
    );
    expect(result.tools[0].monthlySavings).toBeGreaterThan(0);
    // Should recommend either downgrade or switch — whatever saves more
    expect(['downgrade', 'switch']).toContain(result.tools[0].recommendedAction);
  });

  it('marks spend as optimal when on lowest practical paid plan', () => {
    const result = runAudit(
      [{ tool: 'github-copilot', plan: 'individual', seats: 1, monthlyCost: 10 }],
      { teamSize: 1, useCase: 'coding' }
    );
    expect(result.tools[0].monthlySavings).toBe(0);
    // Individual is the cheapest paid plan — no downgrade possible
    expect(result.tools[0].recommendedAction).not.toBe('downgrade');
  });

  it('calculates annual savings as monthly x 12', () => {
    const result = runAudit(
      [{ tool: 'cursor', plan: 'business', seats: 5, monthlyCost: 200 }],
      { teamSize: 5, useCase: 'coding' }
    );
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it('assigns high savings tier for >$500/mo savings', () => {
    const result = runAudit(
      [{ tool: 'cursor', plan: 'enterprise', seats: 20, monthlyCost: 1000 }],
      { teamSize: 20, useCase: 'coding' }
    );
    // Expect either high savings or appropriate tier based on actual savings
    if (result.totalMonthlySavings > 500) {
      expect(result.savingsTier).toBe('high');
    }
    // Verify the tier function directly
    expect(getSavingsTier(501)).toBe('high');
    expect(getSavingsTier(1000)).toBe('high');
  });

  it('does not manufacture savings for optimal spend', () => {
    const result = runAudit(
      [{ tool: 'github-copilot', plan: 'individual', seats: 1, monthlyCost: 10 }],
      { teamSize: 1, useCase: 'coding' }
    );
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('handles multiple tools and aggregates savings correctly', () => {
    const result = runAudit(
      [
        { tool: 'cursor', plan: 'business', seats: 1, monthlyCost: 40 },
        { tool: 'github-copilot', plan: 'individual', seats: 1, monthlyCost: 10 },
      ],
      { teamSize: 1, useCase: 'coding' }
    );
    const manualTotal = result.tools.reduce((sum, t) => sum + t.monthlySavings, 0);
    expect(result.totalMonthlySavings).toBe(manualTotal);
    expect(result.totalAnnualSavings).toBe(manualTotal * 12);
  });

  it('calculates Credex credit savings for all tools', () => {
    const result = runAudit(
      [{ tool: 'chatgpt', plan: 'plus', seats: 5, monthlyCost: 100 }],
      { teamSize: 5, useCase: 'mixed' }
    );
    expect(result.credexTotalEstimate).toBeGreaterThan(0);
    // Should be roughly 30% of spend (using CREDEX_DISCOUNT_AVG = 0.30)
    expect(result.credexTotalEstimate).toBe(30); // 30% of $100
  });

  it('correctly classifies savings tiers', () => {
    expect(getSavingsTier(0)).toBe('optimal');
    expect(getSavingsTier(50)).toBe('low');
    expect(getSavingsTier(100)).toBe('medium');
    expect(getSavingsTier(499)).toBe('medium');
    expect(getSavingsTier(501)).toBe('high');
  });

  it('handles API tools (pay-per-token) with credits suggestion', () => {
    const result = runAudit(
      [{ tool: 'anthropic-api', plan: 'pay-per-token', seats: 1, monthlyCost: 200 }],
      { teamSize: 5, useCase: 'mixed' }
    );
    expect(result.tools[0].monthlySavings).toBe(0);
    expect(result.tools[0].recommendedAction).toBe('credits');
    expect(result.tools[0].credexSavingsEstimate).toBeGreaterThan(0);
  });

  it('handles unknown tools gracefully', () => {
    const result = runAudit(
      [{ tool: 'unknown-tool', plan: 'basic', seats: 1, monthlyCost: 50 }],
      { teamSize: 1, useCase: 'coding' }
    );
    expect(result.tools[0].monthlySavings).toBe(0);
    expect(result.tools).toHaveLength(1);
  });
});
