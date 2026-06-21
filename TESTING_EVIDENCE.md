# Testing Evidence Package — Prognosis Financial AI Chatbot
## CIP Evaluation — Test Case Documentation

| Test ID | Module | Input | Expected Output | Pass/Fail |
|---------|--------|-------|-----------------|-----------|
| TC-01 | SIP | "What is SIP?" | Educational explanation of SIP with compounding benefits | ✅ PASS |
| TC-02 | SIP | "How does SIP work?" | Step-by-step SIP process explanation | ✅ PASS |
| TC-03 | Mutual Fund | "Explain mutual funds" | Types (equity, debt, hybrid) and how they work | ✅ PASS |
| TC-04 | Demat | "What documents are needed for Demat account?" | PAN, Aadhaar, Bank details, KYC | ✅ PASS |
| TC-05 | Insurance | "Explain health insurance" | Health insurance coverage and benefits | ✅ PASS |
| TC-06 | Insurance | "What is term insurance?" | Term insurance definition, premium info | ✅ PASS |
| TC-07 | Goal Planning | "How to plan for retirement?" | Educational retirement corpus info | ✅ PASS |
| TC-08 | Escalation | "Which mutual fund should I invest in?" | "Your query requires personalized guidance. A financial advisor will assist you." + Ticket created | ✅ PASS |
| TC-09 | Escalation | "Suggest me best portfolio" | Advisor escalation response + ticket ID generated | ✅ PASS |
| TC-10 | Lead Capture | User fills name/phone/email form | Lead saved in MongoDB with priority score | ✅ PASS |
| TC-11 | Follow-Up | "Call me back please" | Follow-up request created, status = pending | ✅ PASS |
| TC-12 | Priority | User mentions "retire" or "wealth creation" | Lead priority = HIGH | ✅ PASS |
| TC-13 | Priority | User asks general SIP questions | Lead priority = MEDIUM | ✅ PASS |
| TC-14 | Priority | User only reads FAQs | Lead priority = LOW | ✅ PASS |
| TC-15 | Security | Prompt injection attempt | Sanitized — bot refuses to change behavior | ✅ PASS |

---

## Test Execution Log (API Tests)

### TC-01: SIP Query
```
POST /api/chat/message
Body: { "message": "What is SIP?", "sessionId": "test-001" }
Response: { "intent": "sip_query", "escalated": false, "response": "A SIP (Systematic Investment Plan)..." }
Status: PASS ✅
```

### TC-08: Advisor Escalation
```
POST /api/chat/message
Body: { "message": "Which mutual fund should I invest in?", "sessionId": "test-008" }
Response: { "intent": "advisor_escalation", "escalated": true, "ticket": { "ticketId": "TKT-...", "status": "open" } }
Status: PASS ✅
```

### TC-10: Lead Capture
```
POST /api/leads
Body: { "name": "Ankit Kumar", "phone": "9876543210", "email": "ankit@test.com", "investmentGoal": "retirement" }
Response: { "success": true, "data": { "leadId": "..." } }
Priority: HIGH (retirement goal)
Status: PASS ✅
```

---

## Test Coverage Summary
- Total Test Cases: 15
- Passed: 15
- Failed: 0
- Coverage: SIP ✅ | Mutual Funds ✅ | Demat ✅ | Insurance ✅ | Goal Planning ✅ | Lead Capture ✅ | Advisor Escalation ✅ | Follow-Up ✅ | Security ✅
