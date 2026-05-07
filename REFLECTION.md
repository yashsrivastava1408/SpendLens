# Reflection

**1. What was the hardest bug you faced and how did you fix it?**
The most difficult challenge was managing the TypeScript type definitions for the shadcn/ui `Select` component (`components/SpendForm.tsx`, line 276). In Next.js 15+ and the latest Radix UI version, the `onValueChange` callback passes a `string | null` value, but my state update functions strictly expected a `string`. This caused the Next.js build to fail (`npm run build`) with a confusing type error, even though it worked fine in development. I fixed it by implementing defensive guards in the `onValueChange` handlers (e.g., `onValueChange={(val) => { if (val) handleToolChange(entry.id, val); }}`) which satisfied the TypeScript compiler and made the application more robust.

**2. What was a decision you reversed during the build?**
Initially, I planned to build the Audit Engine entirely on the backend to prevent users from manipulating the logic. However, I reversed this decision and moved `lib/audit-engine.ts` to be used strictly on the client-side. By keeping the audit logic as pure functions running in the browser, I eliminated server latency, making the results appear instantaneously (Step 3 of the user journey). The backend (`/api/audit`) is now only used for persisting the final results. This created a much faster, "wow" user experience while keeping server costs practically zero.

**3. What is your vision for Week 2 of this product?**
In Week 2, I would implement the "Benchmark Mode." The current audit tells users what they *could* be paying based on hard rules, but users really care about what their peers are doing. By aggregating the anonymized data collected in Week 1, I would add a feature comparing their spend-per-seat to companies of similar size and stage. Additionally, I would add an embeddable widget (`<script>` tag) so Credex partners could drop the audit tool onto their own SaaS blogs, creating a decentralized distribution network.

**4. How did you use AI tools during this build?**
I used an AI coding assistant extensively for writing boilerplate code and scaffolding the Next.js architecture. For example, generating the custom Tailwind utilities and the initial `globals.css` gradient logic was heavily AI-assisted to achieve the premium aesthetic quickly. However, I explicitly *did not* use AI to write the actual pricing logic in `pricing-data.ts` or the core algorithm in `audit-engine.ts`. Because financial math must be highly defensible and deterministic, I wrote those entirely by hand and validated them via Vitest tests.

**5. Rate yourself 1-10 on the following (with brief justification):**
- **Speed**: 9/10. Shipped all 6 MVP features, plus a custom premium UI and comprehensive tests, well within the 7-day timeline.
- **Code Quality**: 8/10. The frontend architecture is clean, and the audit engine is 100% pure functions. Room for improvement in adding more robust rate-limiting.
- **Product Sense**: 9/10. Optimized the funnel by showing value instantly without an email gate, and focused heavily on a shareable URL design that actually looks good when posted on Twitter.
