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

## CIP Evaluation Evidence

### Prototype Evidence
- Voiceflow conversation flows designed for all 8 modules
- Decision trees validated before React implementation
- User interaction paths tested in Voiceflow canvas

### Deployment Evidence
- Frontend: https://prognosis-financial-eight.vercel.app
- Backend: https://prognosis-financial.onrender.com
- Database: MongoDB Atlas (ankitorg cluster)
- GitHub: https://github.com/KUMARankit23/Prognosis-Financial

### Testing Evidence
- See TESTING_EVIDENCE.md — 15 test cases, all passing
- Covers all 8 Voiceflow flows

### User Interaction Evidence
- Live chatbot at deployed URL
- Captures leads, creates tickets, tracks follow-ups

---

*Voiceflow prototype link: Available upon request from project supervisor*
*Note: Voiceflow was used for design and prototyping. Final implementation is in React + Node.js as specified.*
