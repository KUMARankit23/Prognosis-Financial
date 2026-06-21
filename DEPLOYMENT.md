# Deployment Guide — Prognosis Financial AI Chatbot

## Overview
- **Frontend** → Vercel (free)
- **Backend** → Render (free)
- **Database** → MongoDB Atlas (free 512MB)
- **AI** → Google Gemini (free 1000 req/day)

---

## Step 1: Push to GitHub

```bash
cd chatbot
git init
git add .
git commit -m "Initial commit - Prognosis Financial AI Chatbot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prognosis-financial.git
git push -u origin main
```

---

## Step 2: MongoDB Atlas (Free Database)

1. Go to → https://cloud.mongodb.com
2. Sign up free → Create a free cluster (M0)
3. Database Access → Add user → username + password
4. Network Access → Add IP → `0.0.0.0/0` (allow all)
5. Connect → Drivers → Copy connection string:
   `mongodb+srv://username:password@cluster.mongodb.net/prognosis_financial`

---

## Step 3: Deploy Backend → Render

1. Go to → https://render.com → Sign up with GitHub
2. New → Web Service → Connect your GitHub repo
3. Configure:
   - **Name**: `prognosis-financial-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

4. Add Environment Variables (one by one):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prognosis_financial
GEMINI_API_KEY=your-gemini-api-key-from-aistudio-google-com
GEMINI_MODEL=gemini-2.5-flash-lite-preview-06-17
JWT_SECRET=your-long-random-secret-string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@prognosisfinancial.com
ADMIN_PASSWORD=Admin@1234
ALLOWED_ORIGINS=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **AI Provider:** This project uses Google Gemini (free tier).
> Get your key at: https://aistudio.google.com/app/apikey
> Do NOT add OPENAI_API_KEY — it is not used.

5. Click **Deploy** → Wait 2-3 minutes
6. Copy your backend URL: `https://prognosis-financial-backend.onrender.com`

---

## Step 4: Deploy Frontend → Vercel

1. Go to → https://vercel.com → Sign up with GitHub
2. New Project → Import your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
```
VITE_API_URL=https://prognosis-financial-backend.onrender.com/api
VITE_APP_NAME=Prognosis Financial
```

5. Click **Deploy** → Get your URL: `https://prognosis-financial.vercel.app`

---

## Step 5: Update CORS

Go back to Render → Your backend service → Environment:
- Update `ALLOWED_ORIGINS` to your actual Vercel URL:
```
ALLOWED_ORIGINS=https://prognosis-financial.vercel.app
```
Click **Save** → Render auto-redeploys.

---

## Step 6: Verify

- Frontend: `https://your-app.vercel.app` → Landing page loads
- Backend health: `https://your-backend.onrender.com/health`
- Admin panel: `https://your-app.vercel.app/admin/login`
  - Email: `admin@prognosisfinancial.com`
  - Password: `Admin@1234`

---

## Local Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev    # runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev    # runs on http://localhost:5173
```
