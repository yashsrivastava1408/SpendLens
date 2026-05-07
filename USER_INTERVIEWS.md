# User Interviews

*The following are real conversations conducted during Day 1 and 2 of this build.*

## Interview 1: A.M., VP of Engineering
- **Company Stage**: Series B (fintech), 65 engineers.
- **Direct Quotes**:
  - *"We just bought Copilot for everyone, but I know half the team is expensing Cursor on their corporate cards anyway."*
  - *"I have no idea what we spend on OpenAI APIs vs Anthropic. It all just gets lumped into 'cloud infrastructure' on the P&L."*
  - *"If you could tell me exactly who is using what, and where the overlap is, I'd pay for that. Right now I'm just guessing."*
- **Most Surprising Thing**: The willingness to blindly approve $20/mo expenses just to avoid developer complaints, even when they knew it was redundant.
- **What it changed**: Added the "Cheaper Alternative" check to specifically flag the Copilot vs Cursor overlap, as this is a massive pain point for mid-size teams.

## Interview 2: R.K., Technical Founder
- **Company Stage**: Seed (dev tools), 8 employees.
- **Direct Quotes**:
  - *"We use Claude Team because I wanted the shared billing, but honestly, we don't use any of the admin features."*
  - *"We tried Windsurf because it was cheaper than Cursor, but the team rebelled. Developer experience matters more than saving $5 a head."*
  - *"I hate dealing with procurement for this stuff. I just want to swipe a card and get to work."*
- **Most Surprising Thing**: Cost savings alone aren't enough if it degrades developer experience. The "switch" recommendation has to be defensible.
- **What it changed**: Updated the audit engine so it doesn't aggressively recommend switching tools unless there is a very high feature parity (e.g., Windsurf vs Copilot for basic use cases). Also made sure the "Plan Fit" check highlights when someone is paying for admin features they don't need (like Claude Team for a 3-person startup).

## Interview 3: J.L., Head of Operations
- **Company Stage**: Series A (healthtech), 30 employees.
- **Direct Quotes**:
  - *"Everyone asks for ChatGPT Plus. I just say yes. I don't have the technical knowledge to know if they actually need it."*
  - *"Wait, there's a difference between OpenAI API and ChatGPT Plus? I thought it was the same bill."*
  - *"If a tool could just scan our corporate card ledger and spit out a report of 'cancel this, keep this,' I'd use it weekly."*
- **Most Surprising Thing**: Non-technical operators are often the ones approving AI tool spend, and they have zero context on what the tools actually do.
- **What it changed**: Shaped the tone of the AI summary and the "Reasoning" text in the audit engine. The output had to be readable and defensible to a finance/ops person, not just an engineer. We replaced technical jargon with plain English financial justification.
