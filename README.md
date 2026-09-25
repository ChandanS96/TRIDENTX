# TrustLens AI

AI-Powered Website Security & Trust Analyzer

TrustLens AI analyzes website URLs to detect suspicious patterns, checks security signals, and uses Google Gemini AI to provide an easy-to-understand Trust Score and explanation for non-technical users.

## Features

- **URL Intelligence:** Detects suspicious URL structures, lookalike domains, IP-based hosts, and phishing patterns.
- **Security Signals:** Examines HTTPS, connection security, and available threat intelligence.
- **Trust Score Engine:** Transparent scoring algorithm (0-100) that explains exactly which signals affected the score.
- **AI Explanation:** Uses Google Gemini to explain technical security findings in simple language.
- **Scan History:** Authenticated users can save, view, and manage past scans on their dashboard.
- **Secure Architecture:** Built with SSRF protection, secure JWT authentication, and Zod validation.

## Architecture

                 USER
                   │
                   ▼
             REACT FRONTEND
                   │
              REST API
                   │
                   ▼
          NODE + EXPRESS SERVER
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
   URL ENGINE   SECURITY    DATABASE
                SIGNALS
        │          │
        └────┬─────┘
             ▼
       TRUST SCORE ENGINE
             │
             ▼
         GEMINI AI
             │
             ▼
      EXPLANATION ENGINE
             │
             ▼
         USER RESULT

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Lucide Icons
- **Backend:** Node.js, Express.js, JWT, bcrypt, Zod
- **Database:** PostgreSQL (pg module)
- **Generative AI:** Google GenAI SDK (Gemini 2.5)

## Local Setup

### 1. Database Setup
Create a PostgreSQL database named `trustlens`.
Run the SQL script found in `database/schema.sql` to create the required tables.

### 2. Environment Variables
Copy the `.env.example` file to `.env` in the root of the `trustlens` project (or inside `server` directory) and fill in the details:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/trustlens
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Backend Setup
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/analyze` - Analyze a URL (returns Trust Score, signals, AI explanation)
- `GET /api/scans` - Get scan history for user
- `GET /api/scans/:id` - Get specific scan details
- `DELETE /api/scans/:id` - Delete a scan

## Demo Instructions for Judges

1. Open TrustLens frontend.
2. Click **Analyze Website**.
3. Try a demo URL (e.g., `https://example.com` for safe, or `http://192.168.1.10/login` for malicious).
4. Watch the progress stages as the URL is validated, analyzed, and Gemini generates an explanation.
5. Review the transparent **Trust Score** and the AI explanation.
6. Register an account and analyze another URL.
7. Go to **Dashboard** and **History** to view the saved scans.

## Limitations

- TrustLens provides automated security indicators and does not guarantee that a website is definitely safe or malicious.
- Advanced threat intelligence (e.g., Google Safe Browsing, VirusTotal) are optional adapters and require configured API keys.
