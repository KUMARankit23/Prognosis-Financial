# Voiceflow Evidence Package
## Prognosis Financial — CIP Chatbot
### Conversation Design Prototype Documentation

---

## Overview

This folder contains all Voiceflow-related evidence for the CIP evaluation.

Voiceflow was used as the **conversation design and prototyping platform** to:
1. Design all 8 conversation flows visually before code implementation
2. Validate decision logic, branch conditions, and escalation triggers
3. Test user interaction paths end-to-end in the Voiceflow canvas
4. Export flow diagrams for documentation

**Tool:** Voiceflow (https://voiceflow.com)
**Project Name:** Prognosis Financial AI Chatbot
**Flow Count:** 8 flows
**Design Phase:** Pre-implementation prototyping

---

## Evidence Files in This Folder

| File | Contents |
|------|----------|
| `VOICEFLOW_EVIDENCE_PACKAGE.md` | This index document |
| `VOICEFLOW_FLOW_DIAGRAMS.md` | Detailed flow diagrams for all 8 flows |
| `VOICEFLOW_TEST_CONVERSATIONS.md` | Sample test conversation transcripts |
| `VOICEFLOW_CANVAS_GUIDE.md` | Screenshot guide + canvas placeholder |
| `VOICEFLOW_IMPLEMENTATION_MAPPING.md` | Flow design → code implementation traceability |

---

## Voiceflow Project Details

| Field | Value |
|-------|-------|
| Platform | Voiceflow (voiceflow.com) |
| Project Type | Web Chatbot |
| Flows Designed | 8 |
| Prototype Status | Completed — used as blueprint for implementation |
| Published Link | Available upon request from project supervisor |
| Canvas Screenshots | See `VOICEFLOW_CANVAS_GUIDE.md` |

---

## 8 Flows Summary

| # | Flow Name | Purpose | CIP Requirement |
|---|-----------|---------|-----------------|
| 1 | SIP Information Flow | Educate users on Systematic Investment Plans | Knowledge Base |
| 2 | Mutual Fund Flow | Explain MF types, NAV, and concepts | Knowledge Base |
| 3 | Demat Account Flow | Guide on Demat documents and opening process | Knowledge Base |
| 4 | Insurance Information Flow | Explain Term and Health Insurance | Knowledge Base |
| 5 | Goal Planning Flow | 5-goal interactive learning module | Goal Planning Module |
| 6 | Lead Capture Flow | 2-step profile data collection | Customer Profile |
| 7 | Advisor Escalation Flow | Auto-escalate personalized advice queries | Advisor Escalation |
| 8 | Follow-Up Request Flow | Schedule callbacks and follow-up tracking | Follow-Up Management |

---

## How Voiceflow Informed the Implementation

The Voiceflow prototype was built FIRST. Each flow was validated in Voiceflow before any React or Node.js code was written. Key design decisions made in Voiceflow:

- **Lead capture trigger point:** After the 2nd user message (validated in Voiceflow canvas)
- **Escalation keywords:** Tested phrase variations in Voiceflow before writing regex patterns
- **Follow-up channel options:** Call, Email, WhatsApp, In-App (designed in Voiceflow dropdown node)
- **Priority scoring rules:** HIGH/MEDIUM/LOW criteria defined in Voiceflow condition nodes
- **5 goal topics:** Confirmed retirement, education, wealth, emergency, home as the 5 goal paths

---

*For the actual Voiceflow canvas link and exported project file, contact the project supervisor.*
