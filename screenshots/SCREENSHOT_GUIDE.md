# Screenshot Evidence Guide
## Prognosis Financial AI Chatbot — CIP Submission

This guide tells you exactly what screenshot to take, where to navigate, and what to show in each one.

**Tool to use:** Windows Snipping Tool (`Win + Shift + S`) or browser full-page screenshot
**Format:** PNG preferred
**Resolution:** Minimum 1280×720

---

## Required Screenshots — 14 Total

### SS-01: Homepage / Landing Page
**File name:** `SS-01-homepage.png`
**URL:** https://prognosis-financial-eight.vercel.app
**What to show:**
- Full landing page in browser
- "AI Financial Assistant" heading visible
- 6 quick action buttons (SIP, Mutual Fund, Demat, Insurance, Goal Planning, Talk to Advisor)
- "Start a Conversation" CTA button
- Prognosis Financial logo and header

**Steps:**
1. Open Chrome/Edge
2. Navigate to https://prognosis-financial-eight.vercel.app
3. Scroll to show full page
4. Take screenshot

---

### SS-02: Chat Interface (Active Conversation)
**File name:** `SS-02-chat-interface.png`
**URL:** https://prognosis-financial-eight.vercel.app/chat
**What to show:**
- Welcome message from bot
- Online indicator (green dot)
- Quick reply chips ("What is SIP?", "Types of mutual funds", etc.)
- Chat input bar
- "AI Assistant" header

**Steps:**
1. Click "Start a Conversation" on homepage
2. Screenshot before typing anything

---

### SS-03: SIP Conversation
**File name:** `SS-03-sip-conversation.png`
**URL:** /chat
**What to show:**
- User message: "What is SIP?"
- Bot response with SIP explanation (bullet points visible)
- Intent displayed as non-escalated

**Steps:**
1. Open chat
2. Type "What is SIP?" and send
3. Wait for response
4. Screenshot showing both user message and bot response

---

### SS-04: Mutual Fund Conversation
**File name:** `SS-04-mutual-fund-conversation.png`
**URL:** /chat
**What to show:**
- User message: "Explain mutual funds"
- Bot response with types (equity, debt, hybrid, ELSS)

**Steps:**
1. Open fresh chat (or continue)
2. Type "Explain mutual funds to me" and send
3. Screenshot response

---

### SS-05: Demat Conversation
**File name:** `SS-05-demat-conversation.png`
**URL:** /chat
**What to show:**
- User message: "What documents are needed for Demat account?"
- Bot response listing PAN, Aadhaar, Bank details, KYC

**Steps:**
1. Type "What documents are needed for Demat account?" and send
2. Screenshot response

---

### SS-06: Insurance Conversation
**File name:** `SS-06-insurance-conversation.png`
**URL:** /chat
**What to show:**
- User message about health or term insurance
- Bot response with coverage information

**Steps:**
1. Type "Explain health insurance and term insurance" and send
2. Screenshot response

---

### SS-07: Goal Planning Page
**File name:** `SS-07-goal-planning.png`
**URL:** https://prognosis-financial-eight.vercel.app/goal-planning
**What to show:**
- Goal Planning page with 5 goal cards
- Retirement, Child Education, Wealth Creation, Emergency Fund, Home Purchase cards visible
- "Plan Your Financial Goals" heading

**Steps:**
1. Click "Goal Planning" on the homepage
2. Screenshot the full goal grid

---

### SS-07b: Goal Detail (Retirement)
**File name:** `SS-07b-retirement-goal-detail.png`
**URL:** /goal-planning
**What to show:**
- Retirement Planning detail with 5 key educational facts
- "Ask AI Assistant" and "Talk to Advisor" CTAs

**Steps:**
1. Click "Retirement Planning" card
2. Screenshot the detail view

---

### SS-08: Lead Capture Form — Step 1
**File name:** `SS-08a-lead-capture-step1.png`
**URL:** /chat
**What to show:**
- Lead Capture Form appearing after 2nd message
- Step 1: Name, Phone, Email fields
- "Step 1 of 2" indicator

**Steps:**
1. Open chat
2. Send 2 messages (any topic)
3. The lead form appears automatically
4. Screenshot Step 1

---

### SS-08b: Lead Capture Form — Step 2
**File name:** `SS-08b-lead-capture-step2.png`
**What to show:**
- Step 2: Investment Goal, Risk Profile, Investment Horizon dropdowns
- "Step 2 of 2" indicator

**Steps:**
1. Fill Step 1 with test data (e.g., "Ankit", "9876543210", "ankit@test.com")
2. Click Continue
3. Screenshot Step 2

---

### SS-09: Advisor Escalation Response
**File name:** `SS-09-advisor-escalation.png`
**URL:** /chat
**What to show:**
- User message: "Which mutual fund should I invest in?"
- Bot response: "Your query requires personalized financial guidance..."
- Yellow "Escalated to Advisor" badge visible
- Ticket ID badge: "Ticket: TKT-..."

**Steps:**
1. Open chat
2. Type "Which mutual fund should I invest in?" and send
3. Screenshot showing escalation response with ticket badge

---

### SS-10: Admin Dashboard
**File name:** `SS-10-admin-dashboard.png`
**URL:** https://prognosis-financial-eight.vercel.app/admin/login → Dashboard
**Login:** admin@prognosisfinancial.com / Admin@1234
**What to show:**
- All stat cards (Total Users, Messages, Leads, Tickets, High Priority, Follow-Ups)
- At least one chart (Intent Distribution or Lead Priority)
- "CIP — Prognosis Financial AI Assistant Overview" subtitle

**Steps:**
1. Go to /admin/login
2. Login with credentials
3. Dashboard loads automatically
4. Screenshot full dashboard

---

### SS-11: Leads Management Screen
**File name:** `SS-11-admin-leads.png`
**URL:** /admin/leads
**What to show:**
- Leads table with Name, Contact, Goal, Priority badge, Status columns
- Priority badges (HIGH=red, MEDIUM=yellow, LOW=green)
- Search and filter controls

**Steps:**
1. Click "Leads" in admin sidebar
2. Screenshot the leads table

---

### SS-12: Follow-Up Management Screen
**File name:** `SS-12-admin-followups.png`
**URL:** /admin/followups
**What to show:**
- Follow-Up Management table
- Status filter buttons (All, Pending, Scheduled, Completed, Escalated)
- Customer name, reason, channel, status columns

**Steps:**
1. Click "Follow-Ups" in admin sidebar
2. Screenshot the follow-ups table

---

### SS-13: Advisor Tickets Screen
**File name:** `SS-13-admin-tickets.png`
**URL:** /admin/tickets
**What to show:**
- Advisor Tickets list
- Ticket ID badges (TKT-...)
- Status badges (Open, Assigned, etc.)
- Expandable query details

**Steps:**
1. Click "Tickets" in admin sidebar
2. Screenshot the tickets list (expand one for detail)

---

### SS-14: MongoDB Collections
**File name:** `SS-14-mongodb-collections.png`
**URL:** https://cloud.mongodb.com → your cluster → Browse Collections
**What to show:**
- MongoDB Atlas database view
- Collections visible: users, messages, leads, advisortickets, followups, admins
- Document count for each collection

**Steps:**
1. Log into MongoDB Atlas
2. Browse collections for `prognosis_financial` database
3. Screenshot showing all 6 collections

---

## Screenshot Checklist

Before CIP submission, verify all files exist in `screenshots/` folder:

- [ ] SS-01-homepage.png
- [ ] SS-02-chat-interface.png
- [ ] SS-03-sip-conversation.png
- [ ] SS-04-mutual-fund-conversation.png
- [ ] SS-05-demat-conversation.png
- [ ] SS-06-insurance-conversation.png
- [ ] SS-07-goal-planning.png
- [ ] SS-07b-retirement-goal-detail.png
- [ ] SS-08a-lead-capture-step1.png
- [ ] SS-08b-lead-capture-step2.png
- [ ] SS-09-advisor-escalation.png
- [ ] SS-10-admin-dashboard.png
- [ ] SS-11-admin-leads.png
- [ ] SS-12-admin-followups.png
- [ ] SS-13-admin-tickets.png
- [ ] SS-14-mongodb-collections.png

**Total: 16 screenshots** (exceeds the 10 minimum required)

---

## Tips

- Use incognito mode for clean screenshots (no browser extensions visible)
- Show the browser URL bar — proves the deployment URL
- Take screenshots at 100% zoom for best quality
- For admin screens: ensure at least some data is visible (not empty tables)
  - Send a few test messages first to populate the database
