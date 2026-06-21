# Environment Variables Reference

## Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `5000` |
| `NODE_ENV` | Yes | Environment | `development` or `production` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | Get free key at aistudio.google.com |
| `GEMINI_MODEL` | No | Gemini model to use | `gemini-2.5-flash-lite` (default) |
| `JWT_SECRET` | Yes | Secret for JWT signing | Long random string |
| `JWT_EXPIRES_IN` | No | Token expiry | `7d` |
| `ADMIN_EMAIL` | Yes | Admin account email | `admin@prognosisfinancial.com` |
| `ADMIN_PASSWORD` | Yes | Admin account password | Strong password |
| `ALLOWED_ORIGINS` | Yes | CORS allowed origins (comma-separated) | `https://your-frontend.vercel.app` |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window | `100` |

## Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `https://your-backend.onrender.com/api` |
| `VITE_APP_NAME` | No | App display name | `Prognosis Financial` |

## AI Provider Note
This project uses **Google Gemini** (not OpenAI).
- Service file: `backend/src/services/geminiService.js`
- Free tier: 1000 requests/day via Google AI Studio
- Get API key: https://aistudio.google.com/app/apikey

> Note: `backend/src/services/openaiService.js` is a legacy file retained for reference only.
> It is NOT imported or used anywhere in the active codebase.

## Notes
- Never commit `.env` files to version control
- The `.env.example` files are safe to commit (no real secrets)
- Backend auto-seeds the admin account on first start
- Change the default admin password immediately after first login
