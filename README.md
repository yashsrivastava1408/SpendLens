# SpendLens

SpendLens is a free web app that audits a startup's AI tool spending and shows exactly where they're wasting money. It serves as a high-converting lead-generation asset for Credex, turning overspend into a case for Credex discounted credits.

## Screenshots
![Audit Form](/public/screenshot-form.png)
![Audit Results](/public/screenshot-results.png)
![Shareable URL](/public/screenshot-share.png)

## Quick Start

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Run tests
npm test
```

## Decisions & Trade-offs
1. **Next.js App Router**: Chosen for easy API routes and SSR for OG tags, trading off a simpler SPA setup for better SEO and shareability.
2. **Supabase**: Chosen for instant Postgres with RLS, trading off complete database control for speed and security out-of-the-box.
3. **Hardcoded Logic vs AI**: Kept the audit engine strictly deterministic to ensure finance-defensible results, limiting AI to just the summary paragraph.
4. **localStorage Persistence**: Opted for client-side storage for the form to meet the "survives reload" requirement without needing a backend session.
5. **No Email Gate**: Decided to show value first and ask for email later, trading off maximum lead capture rate for higher quality leads and trust.

## Live URL
[spendlens.vercel.app](https://spendlens.vercel.app)
