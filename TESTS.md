# Automated Tests

The audit engine is fully tested using Vitest. It operates as a set of pure functions with zero side effects.

**File:** `tests/audit-engine.test.ts`
**Command to run:** `npm test` (or `npx vitest run`)

### Test Coverage

1. **`flags Cursor Business for solo user — should recommend savings`**
   - **Covers**: The plan fit and cheaper alternative checks. Ensures that a solo user on an expensive team plan is advised to downgrade or switch.

2. **`marks spend as optimal when on lowest practical paid plan`**
   - **Covers**: False positive prevention. Ensures the engine doesn't recommend downgrading below the base paid tier.

3. **`calculates annual savings as monthly x 12`**
   - **Covers**: Math validation. Ensures the annualized savings calculation is strictly `monthlySavings * 12`.

4. **`assigns high savings tier for >$500/mo savings`**
   - **Covers**: The `savingsTier` classification logic, critical for showing the Credex CTA correctly.

5. **`does not manufacture savings for optimal spend`**
   - **Covers**: The honesty requirement. Ensures that if a user is completely optimized, the system reports $0 in savings.

6. **`handles multiple tools and aggregates savings correctly`**
   - **Covers**: Aggregation math. Validates that the totals correctly sum up the individual tool savings.

7. **`calculates Credex credit savings for all tools`**
   - **Covers**: The `checkRetailVsCredits` logic. Ensures that even optimized tools show a 20-40% discount opportunity via Credex.

8. **`correctly classifies savings tiers`**
   - **Covers**: Edge cases for tier boundaries (e.g., exactly $0, exactly $500, >$500).

9. **`handles API tools (pay-per-token) with credits suggestion`**
   - **Covers**: Usage-based pricing logic. Since API usage cannot be "downgraded", it correctly falls back to suggesting Credex credits.

10. **`handles unknown tools gracefully`**
    - **Covers**: Error handling. If a user enters an unrecognized tool, it doesn't crash, returns $0 direct savings, but still applies the Credex credit estimate.
