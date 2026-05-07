# Metrics

## North Star Metric
**Qualified Leads Generated per Week**
*Definition*: The number of unique, valid email addresses captured from users whose audit resulted in a "High" savings tier (>$500/mo potential savings).

*Why*: For a B2B lead-generation tool, "Daily Active Users" is a vanity metric. If 10,000 people use the tool but no one has high savings or enters their email, the asset fails its primary business objective for Credex. A "qualified lead" proves both traffic quality and product value.

## 3 Input Metrics
These are the leading indicators that drive the North Star metric:

1. **Form Completion Rate (%)**
   - *What it is*: (Number of Audits Run) / (Number of Unique Visitors).
   - *Why it matters*: Measures how low-friction the initial hook is. If this drops below 20%, the form is too complex.

2. **Lead Capture Conversion Rate (%)**
   - *What it is*: (Emails Submitted) / (Audits Run).
   - *Why it matters*: Measures how compelling the audit results are. If the results are generic, users won't trade their email for the PDF version. Target is >30%.

3. **Viral Share Rate (%)**
   - *What it is*: (Number of "Copy Share Link" clicks) / (Audits Run).
   - *Why it matters*: The primary growth loop. Every shared URL acts as a billboard for the tool.

## What to Instrument First
Using tools like PostHog or Vercel Web Analytics, we must track:
- Clicks on `id="analyze-btn"` (to track Form Completion Rate)
- Successful form submissions on `id="lead-capture"` (to track Lead Conversion)
- Clicks on `id="credex-cta-btn"` (to track intent to purchase Credex credits)

## Pivot Trigger
**Trigger Number:** < 5% Lead Capture Conversion Rate after 1,000 unique visitors.
**Action:** If fewer than 50 people give us their email out of 1,000 visitors, it means the audit results aren't providing enough "wow" factor to justify the email exchange. We would pivot from a "form-based" audit to a "connect your Google Workspace/Slack" audit to pull the data automatically and provide a much deeper, undeniable level of insight.
