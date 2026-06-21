# Voiceflow Canvas Screenshot Guide
## Prognosis Financial AI Chatbot

---

## What Screenshots Are Required

For CIP evaluation, the following Voiceflow canvas screenshots must be captured and submitted:

| # | Screenshot | What to Show | Where to Capture |
|---|-----------|-------------|-----------------|
| VF-01 | Voiceflow Canvas Overview | All 8 flow tiles visible in project view | Voiceflow Dashboard → Project |
| VF-02 | SIP Information Flow Canvas | Full flow with nodes connected | Canvas editor — SIP flow |
| VF-03 | Mutual Fund Flow Canvas | Flow including escalation branch | Canvas editor — MF flow |
| VF-04 | Demat Flow Canvas | Documents sub-menu nodes | Canvas editor — Demat flow |
| VF-05 | Insurance Flow Canvas | Health/Term branch split | Canvas editor — Insurance flow |
| VF-06 | Goal Planning Flow Canvas | 5 goal branches visible | Canvas editor — Goal Planning flow |
| VF-07 | Lead Capture Flow Canvas | 2-step form nodes | Canvas editor — Lead Capture flow |
| VF-08 | Advisor Escalation Flow Canvas | Escalation condition node | Canvas editor — Escalation flow |
| VF-09 | Follow-Up Flow Canvas | Follow-up channel selection nodes | Canvas editor — Follow-Up flow |
| VF-10 | Voiceflow Test / Preview Screen | Active test conversation in Voiceflow | Canvas → Test (bottom right) |

---

## How to Take Voiceflow Screenshots

### Step 1: Open Your Voiceflow Project
1. Go to https://voiceflow.com
2. Log in with your account
3. Open the "Prognosis Financial AI Chatbot" project

### Step 2: Canvas Screenshots
1. Click on the flow you want to screenshot
2. Use Ctrl/Cmd + Shift + H to fit the full flow in view
3. Use Windows Snipping Tool (Win + Shift + S) or browser screenshot
4. Save as: `VF-01-canvas-overview.png`, `VF-02-sip-flow.png`, etc.

### Step 3: Test Conversation Screenshot
1. In the Voiceflow canvas, click "Test Agent" (bottom right panel)
2. Type a test message: "What is SIP?"
3. Screenshot the conversation panel showing bot response
4. Save as: `VF-10-test-conversation.png`

---

## Screenshot Naming Convention

```
voiceflow-evidence/screenshots/
├── VF-01-canvas-overview.png
├── VF-02-sip-flow.png
├── VF-03-mutual-fund-flow.png
├── VF-04-demat-flow.png
├── VF-05-insurance-flow.png
├── VF-06-goal-planning-flow.png
├── VF-07-lead-capture-flow.png
├── VF-08-escalation-flow.png
├── VF-09-followup-flow.png
└── VF-10-test-conversation.png
```

---

## Published Voiceflow Link

To get the published prototype link:
1. Open your Voiceflow project
2. Click "Publish" (top right)
3. Enable "Share via link"
4. Copy the link — format: `https://creator.voiceflow.com/prototype/XXXX`
5. Add the link to VOICEFLOW_ARCHITECTURE.md under "Published Link"

**Current Status:** Link to be added by project owner before CIP submission.

---

## CIP Evaluator Note

The Voiceflow prototype was used for:
- **Conversation design** — mapping all user interaction paths visually
- **Logic validation** — testing branch conditions and escalation triggers
- **Blueprint** — the React + Node.js implementation follows the Voiceflow design exactly

The code implementation in `intentClassifier.js`, `chatController.js`, and `geminiService.js` directly maps to the Voiceflow nodes designed in the prototype.

See `VOICEFLOW_IMPLEMENTATION_MAPPING.md` for the detailed design-to-code traceability matrix.
