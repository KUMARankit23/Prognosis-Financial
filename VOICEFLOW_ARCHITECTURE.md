# Voiceflow Architecture Documentation
## Prognosis Financial — CIP Chatbot Design Layer

---

## Overview
Voiceflow was used as the **conversation design and prototyping platform** before implementation in React + Node.js.
It served to:
- Design all conversation journeys visually
- Validate chatbot logic and decision trees
- Test customer interaction flows
- Prototype user experiences before code implementation

---

## Architecture Layer

```
User Input
    ↓
[Voiceflow Conversation Design Layer]
    ├── Intent Classification Flows
    ├── Response Logic Trees
    ├── Escalation Decision Points
    └── Lead Capture Flow Design
    ↓
React Frontend (Implementation)
    ↓
Node.js Backend
    ↓
Google Gemini AI (Response Generation)
    ↓
MongoDB (Data Storage)
    ↓
Lead Management & Advisor Escalation
    ↓
Customer Engagement Dashboard
```

---

## Voiceflow Conversation Flows Designed

### 1. SIP Information Flow
```
START → Greeting
    → "What is SIP?" trigger
    → Display SIP explanation
    → Offer: "Learn about SIP benefits" | "SIP Calculator concepts" | "Start a SIP"
    → If "Start a SIP" → Lead Capture Flow
    → END
```

### 2. Mutual Fund Flow
```
START → "Mutual Fund" intent detected
    → Clarify: "Equity" | "Debt" | "Hybrid" | "ELSS"
    → Display category-specific info
    → If "Which fund should I buy?" → ESCALATION FLOW
    → END
```

### 3. Demat Account Flow
```
START → "Demat" intent detected
    → Sub-menu: "What is Demat?" | "How to open?" | "Documents needed?"
    → Documents path: PAN + Aadhaar + Bank + KYC
    → Offer advisor callback → Follow-Up Flow
    → END
```

### 4. Insurance Information Flow
```
START → "Insurance" intent detected
    → Branch: "Term Insurance" | "Health Insurance"
    → Term: Coverage, premium, sum assured info
    → Health: Cashless, network hospitals, claims
    → Offer: "Talk to advisor" → Escalation Flow
    → END
```

### 5. Goal Planning Flow
```
START → "Goal Planning" intent
    → Goal selector: Retirement | Education | Wealth | Emergency | Home
    → Display goal-specific education content
    → Key facts and investment timeline
    → CTA: "Ask AI more" | "Talk to Advisor"
    → END
```

### 6. Lead Capture Flow
```
START → Triggered after 2nd user message
    → Step 1: Name → Phone → Email validation
    → Step 2: Investment Goal → Risk Profile → Horizon
    → Priority scoring (High/Medium/Low)
    → Save to MongoDB
    → Confirmation message
    → END
```

### 7. Advisor Escalation Flow
```
START → Escalation trigger detected
    → Response: "Your query requires personalized guidance..."
    → Auto-create Advisor Ticket (ticketId generated)
    → Notify admin dashboard
    → Status: Open
    → END
```

### 8. Follow-Up Request Flow
```
START → "Call me back" | "Schedule a meeting" trigger
    → Confirm contact details
    → Select channel: Call | Email | WhatsApp
    → Optionally schedule date/time
    → Create FollowUp record in MongoDB
    → Status: Pending/Scheduled
    → END
```

---

## Voiceflow Deliverables Checklist

| Deliverable | Status |
|-------------|--------|
| Voiceflow Canvas (conversation design) | ✅ Designed |
| SIP Flow | ✅ Implemented |
| Mutual Fund Flow | ✅ Implemented |
| Demat Flow | ✅ Implemented |
| Insurance Flow | ✅ Implemented |
| Goal Planning Flow | ✅ Implemented (dedicated page) |
| Lead Capture Flow (2-step form) | ✅ Implemented |
| Advisor Escalation Flow | ✅ Implemented with ticket creation |
| Follow-Up Request Flow | ✅ Implemented with status tracking |

---

## Voiceflow → Implementation Mapping

| Voiceflow Design | Code Implementation |
|-----------------|---------------------|
| Intent nodes | `intentClassifier.js` — regex pattern matching |
| Escalation decision | `ESCALATION_PATTERNS` array + `AdvisorTicket` model |
| Response content | `geminiService.js` — Gemini AI + fallback responses |
| Lead capture form | `LeadCaptureForm.tsx` — 2-step profile form |
| Goal planning paths | `GoalPlanningPage.tsx` — 5 goal topics |
| Follow-up node | `FollowUp.js` model + `followUpController.js` |
| Conversation history | `Message.js` MongoDB collection |
| Admin reporting | `AdminDashboard.tsx` — CIP metrics |

---

## Canvas Screenshots

> **Instructions for CIP Submission:**
> Place the following screenshots in `voiceflow-evidence/screenshots/` before submission.
> See `voiceflow-evidence/VOICEFLOW_CANVAS_GUIDE.md` for exact capture instructions.

| Screenshot File | Contents |
|----------------|----------|
| `VF-01-canvas-overview.png` | All 8 flows visible in Voiceflow project dashboard |
| `VF-02-sip-flow.png` | SIP Information Flow canvas nodes |
| `VF-03-mutual-fund-flow.png` | Mutual Fund Flow + escalation branch |
| `VF-04-demat-flow.png` | Demat Flow with documents sub-menu |
| `VF-05-insurance-flow.png` | Insurance Flow with Health/Term split |
| `VF-06-goal-planning-flow.png` | Goal Planning Flow — 5 branches |
| `VF-07-lead-capture-flow.png` | Lead Capture 2-step form nodes |
| `VF-08-escalation-flow.png` | Advisor Escalation ticket creation node |
| `VF-09-followup-flow.png` | Follow-Up Request flow |
| `VF-10-test-conversation.png` | Voiceflow test panel — live conversation |

---

## Published Voiceflow Link

**Link:** `[ADD YOUR VOICEFLOW PUBLISHED PROTOTYPE LINK HERE BEFORE SUBMISSION]`

To generate:
1. Open the Voiceflow project
2. Click Publish (top right) → Enable "Share via link"
3. Copy URL (format: `https://creator.voiceflow.com/prototype/XXXX`)
4. Replace the placeholder above with your actual link

---

## Voiceflow Test Conversations

See `voiceflow-evidence/VOICEFLOW_TEST_CONVERSATIONS.md` for 10 full test conversations
covering all 8 flows, including escalation, lead capture, follow-up, and security validation.

---

## Voiceflow Evidence Package

See `voiceflow-evidence/` folder for the complete evidence bundle:
- `VOICEFLOW_EVIDENCE_PACKAGE.md` — Index and overview
- `VOICEFLOW_FLOW_DIAGRAMS.md` — Detailed ASCII flow diagrams for all 8 flows
- `VOICEFLOW_TEST_CONVERSATIONS.md` — 10 test conversation transcripts
- `VOICEFLOW_CANVAS_GUIDE.md` — Screenshot instructions and naming convention
- `VOICEFLOW_IMPLEMENTATION_MAPPING.md` — Node-level design-to-code traceability matrix

---

*Note: Voiceflow was used for design and prototyping. Final implementation is in React + Node.js.*
*Canvas screenshots and published link to be added to `voiceflow-evidence/screenshots/` before CIP submission.*
