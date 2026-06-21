# Prognosis Financial - AI Customer Engagement System

A production-quality AI-powered Customer Engagement and Communication Support System for Prognosis Financial.

## Features
- AI-powered chatbot with OpenAI GPT integration
- Intent classification (SIP, Mutual Funds, Demat, Insurance, Goal Planning)
- Lead capture and priority scoring
- Advisor escalation with ticket creation
- Admin dashboard
- Conversation history storage
- Security: XSS prevention, input sanitization, prompt injection protection

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **AI**: OpenAI API

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- OpenAI API key

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

## Project Structure
```
chatbot/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── README.md
```

## API Endpoints

### Chat
- `POST /api/chat/message` - Send a message
- `GET /api/chat/history/:userId` - Get conversation history

### Leads
- `POST /api/leads` - Create a lead
- `GET /api/leads` - Get all leads (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/advisor-tickets` - All advisor tickets

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render/Railway
- Connect your GitHub repo
- Set environment variables
- Deploy from `backend/` directory
- Build command: `npm install`
- Start command: `npm start`
