# MediRush — Emergency Health & Medicine Delivery Platform

MediRush is a full-stack emergency medical platform providing sub-10-minute medicine delivery, real-time pharmacy tracking, AI-powered symptom analysis, prescription OCR uploading, and health safety tools.

---

## 🏗 Architecture & Monorepo Structure

```
MEDIRUSH.APP/
├── medirush-app/           # React 19 + Vite + Tailwind CSS Frontend
├── backend/                # Express.js 5 Backend REST API
├── symptom-checker-ml-main/ # FastAPI Python ML Symptom Checker Engine
└── schema.sql              # Supabase PostgreSQL Database Schema
```

---

## ⚡ Services Overview

| Component | Tech Stack | Port | Setup & Run |
|---|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons | `5173` | `cd medirush-app && npm install && npm run dev` |
| **Backend API** | Node.js, Express.js 5, CORS | `3000` | `cd backend && npm install && npm start` |
| **ML Engine** | Python 3.10, FastAPI, Scikit-learn | `8000` | `cd symptom-checker-ml-main && .\run.bat` |

---

## 🔑 Environment Variables Setup

Create a `.env` file inside `medirush-app/` with the following variables:

```env
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-google-gemini-api-key
```

---

## 🛠 Database Setup

1. Create a project at [Supabase](https://supabase.com).
2. Run `schema.sql` in the Supabase SQL Editor.
3. Update `medirush-app/.env` with your project URL and anon key.

---

## 🚀 Production Deployment

- **Frontend (Vite/React)**: Deploy to Vercel or Netlify (includes built-in `vercel.json` SPA rewrites).
- **Backend (Express API)**: Deploy to Render, Railway, or Heroku (`npm start`).
- **ML Engine (FastAPI)**: Deploy via Docker Compose (`docker-compose up -d`) or Render Web Service.
