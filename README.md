# Prognosis Financial — AI Customer Engagement System
### Corporate Internship Program (CIP) Project

> AI-powered Customer Engagement and Communication Support System for Prognosis Financial Wealth Management Company.

**Live Demo:** https://prognosis-financial-eight.vercel.app
**Backend API:** https://prognosis-financial.onrender.com
**GitHub:** https://github.com/KUMARankit23/Prognosis-Financial

---

## System Architecture

```
User
  ↓
[Voiceflow Conversation Design Layer]
  ↓
React Frontend (Vite + TypeScript + Tailwind CSS)
  ↓
Node.js + Express Backend
  ↓
Google Gemini AI (Free Tier)
  ↓
MongoDB Atlas
  ↓
Lead Management → Advisor Escalation → Customer Engagement Dashboard
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI | Google Gemini 2.5 Flash-Lite (Free — 1000 req/day) |
| Prototype | Voiceflow (conversation design) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Features

### Chatbot Capabilities
- SIP (Systematic Investment Plans) education
- Mutual Fund types and concepts
- Demat Account guidance and documents
- Health & Term Insurance information
- Goal-Based Investing (5 goal types)
- Wealth Creation basics

### Lead Management (CIP)
- **2-step lead capture** with extended profile
- Name, Phone, Email, Investment Goal
- Risk Profile (Conservative/Moderate/Aggressive)
- Investment Horizon (Short/Medium/Long Term)
- Product Interest tracking

### Lead Priority Scoring (CIP)
| Priority | Triggers |
|----------|---------|
| HIGH | Retirement, Wealth Creation, Investment > ₹5 Lakh, Portfolio discussions |
| MEDIUM | SIP, Mutual Fund, Insurance queries |
| LOW | FAQ-only interactions |

### Goal Planning Module (CIP)
- Retirement Planning
- Child Education Planning
- Wealth Creation
- Emergency Fund Planning
- Home Purchase Planning

### Advisor Escalation (CIP)
Auto-escalates:
- Mutual fund recommendations
- Portfolio allocation advice
- Tax planning advice
- Personalized investment advice
- Fund selection requests

### Follow-Up Management (CIP)
- Follow-Up Requests from chatbot
- Status: Pending → Scheduled → Completed → Escalated
- Channel: Call, Email, WhatsApp, In-App
- Admin dashboard management

### Customer Engagement Monitoring (CIP)
- Engagement Score (0-100)
- Total Conversations
- Last Active Date
- Lead Status tracking
- Follow-Up Count
- Advisor Escalation Count

### Admin Dashboard
- Total Users, Messages, Leads
- Open Advisor Tickets
- High Priority Lead alerts
- Pending Follow-Ups widget
- Intent Distribution chart
- Lead Priority chart (CIP)
- Investment Goals distribution chart (CIP)

---

## Voiceflow Prototype Section

Voiceflow was used to design and validate all conversation flows before implementation.

**Flows Designed:**
1. SIP Information Flow
2. Mutual Fund Flow
3. Demat Account Flow
4. Insurance Information Flow
5. Goal Planning Flow
6. Lead Capture Flow
7. Advisor Escalation Flow
8. Follow-Up Request Flow

See [VOICEFLOW_ARCHITECTURE.md](./VOICEFLOW_ARCHITECTURE.md) for full documentation.

---

## Database Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Chat sessions and user activity |
| `messages` | Full conversation history |
| `leads` | Extended customer profiles (CIP) |
| `advisortickets` | Escalation tickets |
| `followups` | Follow-up request tracking |
| `admins` | Admin accounts |

---

## API Endpoints

### Chat
- `POST /api/chat/message` — Send message, get AI response
- `GET /api/chat/history/:sessionId` — Conversation history

### Leads
- `POST /api/leads` — Capture lead (public)
- `GET /api/leads` — All leads with filters (admin)
- `PATCH /api/leads/:id` — Update lead status (admin)

### Follow-Ups (CIP)
- `POST /api/followups` — Request follow-up (public)
- `GET /api/followups` — All follow-ups (admin)
- `PATCH /api/followups/:id` — Update status (admin)

### Admin
- `POST /api/admin/login` — Admin login
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/advisor-tickets` — Advisor tickets
- `PATCH /api/admin/advisor-tickets/:id` — Update ticket

---

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your GEMINI_API_KEY and MONGODB_URI
# Get Gemini API key (free): https://aistudio.google.com/app/apikey
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## Testing Evidence

See [TESTING_EVIDENCE.md](./TESTING_EVIDENCE.md)

15 test cases covering:
- SIP queries ✅
- Mutual Fund queries ✅
- Demat account queries ✅
- Insurance queries ✅
- Goal Planning ✅
- Lead Capture ✅
- Advisor Escalation ✅
- Follow-Up Flow ✅
- Priority Scoring ✅
- Security/Prompt Injection ✅

---

## CIP Compliance

| CIP Requirement | Status |
|----------------|--------|
| Chatbot (Voiceflow design + React implementation) | ✅ |
| SIP / MF / Demat / Insurance information | ✅ |
| Goal Planning Module (5 goals) | ✅ |
| Extended Customer Profile | ✅ |
| Lead Priority Scoring (High/Medium/Low) | ✅ |
| Advisor Escalation + Ticket creation | ✅ |
| Follow-Up Management Module | ✅ |
| Customer Engagement Monitoring | ✅ |
| Admin Dashboard with CIP metrics | ✅ |
| No personalized investment advice | ✅ |
| Testing Evidence (15+ test cases) | ✅ |
| Deployed (Vercel + Render) | ✅ |
| GitHub repository | ✅ |

---

## Security
- XSS prevention (xss library)
- MongoDB injection prevention (express-mongo-sanitize)
- Prompt injection blocking
- Rate limiting (100 req/15 min)
- JWT authentication for admin
- Input sanitization on all endpoints

---

## Admin Access
- URL: `/admin/login`
- Email: `admin@prognosisfinancial.com`
- Password: `Admin@1234`

---

*© 2024 Prognosis Financial. AI responses are educational only — not personalized investment advice.*
