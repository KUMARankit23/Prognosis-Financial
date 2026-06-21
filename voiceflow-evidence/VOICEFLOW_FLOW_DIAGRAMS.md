# Voiceflow Flow Diagrams
## Prognosis Financial AI Chatbot — All 8 Flows

---

## Flow 1: SIP Information Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SIP INFORMATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[START]
    │
    ▼
[GREETING NODE]
"Welcome to Prognosis Financial AI Assistant!"
    │
    ▼
[INTENT DETECTION: sip_query]
Trigger: "SIP", "systematic investment", "monthly investment"
    │
    ▼
[RESPONSE NODE — What is SIP?]
"A SIP allows you to invest a fixed amount regularly in mutual funds..."
    │
    ├──► [CHOICE NODE]
    │         │
    │         ├──► "Benefits of SIP"
    │         │         └──► [Response: Compounding, Rupee Cost Averaging, Discipline]
    │         │
    │         ├──► "How to Start SIP"
    │         │         └──► [Response: Choose fund → Set amount → Set date → Automate]
    │         │                   └──► [LEAD CAPTURE FLOW ─►]
    │         │
    │         └──► "SIP Calculator Concepts"
    │                   └──► [Response: Formula, example with ₹5,000/month @ 12%]
    │
    ▼
[END / BACK TO MENU]
```

---

## Flow 2: Mutual Fund Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      MUTUAL FUND FLOW                           │
└─────────────────────────────────────────────────────────────────┘

[START]
    │
    ▼
[INTENT DETECTION: mutual_fund_query]
Trigger: "mutual fund", "MF", "NAV", "AMC", "ELSS"
    │
    ▼
[RESPONSE NODE — What are Mutual Funds?]
"Mutual funds pool money from investors into diversified portfolios..."
    │
    ▼
[CHOICE NODE — Type of MF?]
    │
    ├──► "Equity Funds"
    │         └──► [Response: Higher risk, higher returns, 7+ year horizon]
    │
    ├──► "Debt Funds"
    │         └──► [Response: Stable returns, lower risk, short-medium term]
    │
    ├──► "Hybrid Funds"
    │         └──► [Response: Mix of equity + debt, balanced approach]
    │
    └──► "ELSS Funds"
              └──► [Response: Tax-saving, 3-year lock-in]
    │
    ▼
[CONDITION NODE — Personalized Recommendation?]
IF user asks "which fund should I buy?" OR "recommend a fund"
    │
    ├──► YES → [ADVISOR ESCALATION FLOW ─►]
    │
    └──► NO  → [Continue Education]
                    └──► [END]
```

---

## Flow 3: Demat Account Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEMAT ACCOUNT FLOW                           │
└─────────────────────────────────────────────────────────────────┘

[START]
    │
    ▼
[INTENT DETECTION: demat_query]
Trigger: "demat", "trading account", "depository", "NSDL", "CDSL"
    │
    ▼
[RESPONSE NODE — What is Demat?]
"A Demat account holds shares electronically, replacing physical certificates..."
    │
    ▼
[CHOICE NODE]
    │
    ├──► "Documents Required"
    │         └──► [Response: PAN Card, Aadhaar Card, Bank Account Details, KYC, Photo]
    │
    ├──► "How to Open?"
    │         └──► [Response: Choose broker → Fill KYC → Submit docs → Verify → Done]
    │
    ├──► "Benefits of Demat"
    │         └──► [Response: Safe storage, easy transfer, no physical risk, paperless]
    │
    └──► "Talk to Advisor"
              └──► [FOLLOW-UP FLOW ─►]
    │
    ▼
[END]
```

---

## Flow 4: Insurance Information Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  INSURANCE INFORMATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

[START]
    │
    ▼
[INTENT DETECTION: insurance_query]
Trigger: "insurance", "term plan", "health insurance", "premium", "ULIP"
    │
    ▼
[CHOICE NODE — Insurance Type?]
    │
    ├──► "Term Insurance"
    │         └──► [Response: Pure life cover, affordable premiums, no maturity benefit]
    │                   └──► [Key Fact: ₹1 Cr cover from ~₹600/month]
    │
    ├──► "Health Insurance"
    │         └──► [Response: Hospitalization cover, cashless, network hospitals, claims]
    │
    └──► "Insurance Benefits"
              └──► [Response: Financial protection, tax benefit u/s 80C & 80D]
    │
    ▼
[CONDITION NODE]
IF "which policy should I buy?" → [ADVISOR ESCALATION FLOW ─►]
ELSE → [END]
```

---

## Flow 5: Goal Planning Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOAL PLANNING FLOW                           │
└─────────────────────────────────────────────────────────────────┘

[START]
    │
    ▼
[INTENT DETECTION: goal_planning_query]
Trigger: "goal", "retirement", "child education", "wealth", "emergency fund", "home"
    │
    ▼
[GOAL SELECTOR — 5 Options]
    │
    ├──► [1] RETIREMENT PLANNING
    │         └──► Key Facts: Start early, 25x rule, SIP in equity, NPS
    │
    ├──► [2] CHILD EDUCATION PLANNING
    │         └──► Key Facts: 10-12% inflation, ₹5K/month for 15yrs = ₹25L+, SSY
    │
    ├──► [3] WEALTH CREATION
    │         └──► Key Facts: Compounding, ₹10K/month → ₹2.3Cr in 20yrs, diversify
    │
    ├──► [4] EMERGENCY FUND PLANNING
    │         └──► Key Facts: 6 months expenses, liquid MF, automate, replenish
    │
    └──► [5] HOME PURCHASE PLANNING
              └──► Key Facts: 20-25% down payment, EMI ≤ 30-40% income, stamp duty
    │
    ▼
[CTA NODE]
    ├──► "Ask AI More" → [Chat continues]
    └──► "Talk to Advisor" → [ADVISOR ESCALATION FLOW ─►]
```

---

## Flow 6: Lead Capture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEAD CAPTURE FLOW                            │
└─────────────────────────────────────────────────────────────────┘

[TRIGGER: After 2nd user message]
    │
    ▼
[STEP 1 — Basic Info Form]
    ├── Full Name (text input, required)
    ├── Mobile Number (10-digit, Indian format validation)
    └── Email Address (format validation)
    │
    ▼
[VALIDATION NODE]
    ├── Phone: /^[6-9]\d{9}$/ → PASS → Continue
    └── FAIL → Show error, re-prompt
    │
    ▼
[STEP 2 — Investment Profile]
    ├── Investment Goal (dropdown: 7 options)
    ├── Risk Profile (dropdown: Conservative/Moderate/Aggressive/Not Specified)
    └── Investment Horizon (dropdown: Short/Medium/Long Term)
    │
    ▼
[PRIORITY SCORING NODE]
    ├── Goal = retirement/wealth_creation → HIGH
    ├── Goal = sip/mutual_fund/insurance → MEDIUM
    └── Goal = faq/other → LOW
    │
    ▼
[SAVE TO DATABASE]
Lead document created in MongoDB → sessionId linked
    │
    ▼
[CONFIRMATION NODE]
"Thank you, [Name]! Your details are saved. Our team may reach out."
    │
    ▼
[RESUME CHAT]
```

---

## Flow 7: Advisor Escalation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 ADVISOR ESCALATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

[TRIGGER: Escalation keyword detected]
Patterns: "which fund", "recommend", "best portfolio", "should I invest",
          "tax advice", "personalized advice", "portfolio allocation"
    │
    ▼
[CONDITION NODE — Escalation Check]
IF escalate = true
    │
    ▼
[STATIC RESPONSE NODE]
"Your query requires personalized financial guidance.
 A certified financial advisor from Prognosis Financial will assist you shortly. 🤝"
    │
    ▼
[TICKET CREATION NODE]
AdvisorTicket created:
    ├── ticketId: TKT-{timestamp}-{random}
    ├── query: user message
    ├── sessionId: current session
    ├── priority: HIGH
    └── status: open
    │
    ▼
[ADMIN NOTIFICATION]
Ticket appears in Admin Dashboard → Tickets screen
    │
    ▼
[END — Chat continues]
```

---

## Flow 8: Follow-Up Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   FOLLOW-UP REQUEST FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[TRIGGER: follow_up_query intent]
Patterns: "call me back", "follow up", "schedule a call",
          "contact me", "remind me", "speak to someone"
    │
    ▼
[RESPONSE NODE]
"I've noted your request! Our team will get back to you. 📞"
    │
    ▼
[FOLLOW-UP RECORD CREATION]
FollowUp document created:
    ├── sessionId: current session
    ├── leadId: linked if lead exists
    ├── userName: from lead / 'Anonymous'
    ├── reason: user message
    ├── channel: 'call' (default)
    └── status: 'pending'
    │
    ▼
[LEAD SYNC NODE]
If lead exists → followUpStatus = 'pending', followUpCount + 1
    │
    ▼
[ADMIN DASHBOARD UPDATE]
Follow-up appears in Admin → Follow-Up Management screen
Status flow: pending → scheduled → completed / escalated
    │
    ▼
[END]
```
