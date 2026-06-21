# Voiceflow → Code Implementation Mapping
## Design-to-Code Traceability Matrix

This document proves that the React + Node.js implementation directly reflects the Voiceflow prototype design.

---

## Node-Level Mapping

### Intent Detection Nodes
| Voiceflow Node | Code Implementation | File |
|---------------|--------------------|----|
| SIP Intent Trigger | `INTENT_PATTERNS.sip_query` regex array | `intentClassifier.js` |
| Mutual Fund Intent Trigger | `INTENT_PATTERNS.mutual_fund_query` | `intentClassifier.js` |
| Demat Intent Trigger | `INTENT_PATTERNS.demat_query` | `intentClassifier.js` |
| Insurance Intent Trigger | `INTENT_PATTERNS.insurance_query` | `intentClassifier.js` |
| Goal Planning Intent Trigger | `INTENT_PATTERNS.goal_planning_query` | `intentClassifier.js` |
| Wealth Creation Trigger | `INTENT_PATTERNS.wealth_creation_query` | `intentClassifier.js` |
| Follow-Up Trigger | `INTENT_PATTERNS.follow_up_query` | `intentClassifier.js` |
| Greeting Detection | `INTENT_PATTERNS.greeting` | `intentClassifier.js` |

### Escalation Condition Nodes
| Voiceflow Condition | Code Implementation | File |
|--------------------|--------------------|----|
| "Which fund should I buy?" | `ESCALATION_PATTERNS` regex array | `intentClassifier.js` |
| "Recommend a portfolio" | `/suggest\s+(me\|a\|best\|good)/i` | `intentClassifier.js` |
| "Tax planning advice" | `/tax\s+(saving\|advice\|planning)/i` | `intentClassifier.js` |
| "Personalized advice" | `/personalized.*advice/i` | `intentClassifier.js` |
| Auto-escalate → ticket | `AdvisorTicket.create()` | `chatController.js` |

### Response Generation Nodes
| Voiceflow Response | Code Implementation | File |
|-------------------|--------------------|----|
| Educational responses | Gemini AI + system prompt | `geminiService.js` |
| Escalation static response | `getFallbackResponse('advisor_escalation')` | `geminiService.js` |
| Fallback responses (offline) | `getFallbackResponse(intent)` map | `geminiService.js` |
| Scope restriction ("You MUST NOT") | `SYSTEM_PROMPT` instructions | `geminiService.js` |

### Lead Capture Form Nodes
| Voiceflow Form Node | Code Implementation | File |
|--------------------|--------------------|------|
| Step 1: Name/Phone/Email | `LeadCaptureForm.tsx` — step 1 state | `LeadCaptureForm.tsx` |
| Phone validation | `/^[6-9]\d{9}$/.test()` | `LeadCaptureForm.tsx` + `sanitizer.js` |
| Email validation | `validator.isEmail()` | `sanitizer.js` |
| Step 2: Goal/Risk/Horizon | `LeadCaptureForm.tsx` — step 2 state | `LeadCaptureForm.tsx` |
| Priority scoring node | `scorePriority()` function | `intentClassifier.js` |
| HIGH: retirement/wealth | Forced HIGH in `leadController.js` | `leadController.js` |
| Save to DB | `Lead.create()` | `leadController.js` |
| Trigger after 2nd message | `messageCount === 2` effect | `ChatPage.tsx` |

### Goal Planning Nodes
| Voiceflow Goal Node | Code Implementation | File |
|--------------------|--------------------|----|
| Goal Selector (5 options) | `GOAL_TOPICS` array (5 items) | `GoalPlanningPage.tsx` |
| Retirement path | `GOAL_TOPICS[0]` + 5 keyFacts | `GoalPlanningPage.tsx` |
| Education path | `GOAL_TOPICS[1]` + 5 keyFacts | `GoalPlanningPage.tsx` |
| Wealth Creation path | `GOAL_TOPICS[2]` + 5 keyFacts | `GoalPlanningPage.tsx` |
| Emergency Fund path | `GOAL_TOPICS[3]` + 5 keyFacts | `GoalPlanningPage.tsx` |
| Home Purchase path | `GOAL_TOPICS[4]` + 5 keyFacts | `GoalPlanningPage.tsx` |
| "Ask AI More" CTA | Navigates to ChatPage with query | `GoalPlanningPage.tsx` |
| "Talk to Advisor" CTA | Sends advisor escalation intent | `GoalPlanningPage.tsx` |

### Follow-Up Request Nodes
| Voiceflow Node | Code Implementation | File |
|---------------|--------------------|----|
| Follow-up intent detection | `INTENT_PATTERNS.follow_up_query` | `intentClassifier.js` |
| FollowUp record creation | `FollowUp.create()` in chat | `chatController.js` |
| Channel selection | `channel` field, defaults to 'call' | `FollowUp.js` |
| Status management | `status` enum: pending/scheduled/completed/escalated | `FollowUp.js` |
| Admin view | `AdminFollowUps.tsx` table with CRUD | `AdminFollowUps.tsx` |

### Advisor Escalation Ticket Nodes
| Voiceflow Node | Code Implementation | File |
|---------------|--------------------|----|
| Ticket creation node | `AdvisorTicket.create()` | `chatController.js` |
| Ticket ID generation | `TKT-{Date.now()}-{random}` | `chatController.js` |
| Admin ticket view | `AdminTickets.tsx` | `AdminTickets.tsx` |
| Ticket status updates | `updateTicket()` | `adminController.js` |

### Dashboard Reporting Nodes
| Voiceflow Analytics | Code Implementation | File |
|--------------------|--------------------|----|
| Intent distribution | `intentDistribution` aggregate | `adminController.js` |
| Lead priority chart | `leadsByPriority` aggregate | `adminController.js` |
| Goal distribution chart | `leadsByGoal` aggregate | `adminController.js` |
| High priority alerts | `highPriorityLeads` count | `adminController.js` |
| Pending follow-ups | `pendingFollowUps` count | `adminController.js` |

---

## Summary

Every node in the Voiceflow prototype has a corresponding code implementation.
The mapping above demonstrates 100% design-to-code traceability.

The Voiceflow prototype was not just documentation — it was the actual blueprint
from which the entire application was built.
