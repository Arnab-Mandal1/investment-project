# Pro Investment — MERN Stack Project

A full-stack investment and referral platform built with the MERN Stack (MongoDB, Express.js, React.js, Node.js).

---

## Live Demo

| | URL |
|---|---|
| **Frontend** | https://investment-project-six.vercel.app |
| **Backend API** | https://investment-project-3rxk.onrender.com |
| **Health Check** | https://investment-project-3rxk.onrender.com/api/health |

> **Note:** Backend is hosted on Render free tier. First request after inactivity may take 30-50 seconds to wake up. Subsequent requests are fast.

### Deployment Stack

| Layer | Platform | Details |
|---|---|---|
| Frontend | Vercel | Auto-deploys on push to main |
| Backend | Render | Auto-deploys on push to main |
| Database | MongoDB Atlas | Free tier, M0 cluster |

---

## Project Structure

```
investment-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── investmentController.js
│   │   │   └── referralController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── Investment.js
│   │   │   ├── ReferralIncome.js
│   │   │   ├── ROIHistory.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── investment.js
│   │   │   └── referral.js
│   │   ├── services/
│   │   │   ├── cronService.js
│   │   │   ├── emailService.js
│   │   │   ├── referralService.js
│   │   │   └── roiService.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   └── generateReferralCode.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   └── ui/
│   │   │       ├── Badge.jsx
│   │   │       ├── CountUp.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Spinner.jsx
│   │   │       └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── InvestmentsPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ReferralsPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── investmentService.js
│   │   │   └── referralService.js
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   └── formatDate.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── postman_collection.json
├── .gitignore
├── package.json
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js v4 |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT (jsonwebtoken), bcryptjs v2.4.3 |
| Scheduler | node-cron |
| Email | Brevo (@getbrevo/brevo) |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account
- Brevo account (for email)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Arnab-Mandal1/investment-project.git
cd investment-project
```

### 2. Install dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in your values

# Frontend
cp frontend/.env.example frontend/.env
# Set VITE_API_BASE_URL
```

### 4. Run in development

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB Atlas URI | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `random 64-char hex` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `MAX_REFERRAL_LEVELS` | Referral depth | `5` |
| `CRON_SCHEDULE` | Cron expression | `0 0 * * *` |
| `ROI_TRIGGER_SECRET` | Secret for manual ROI trigger | `any-strong-random-string` |
| `BREVO_API_KEY` | Brevo API key for transactional email | `xkeysib-...` |
| `FRONTEND_URL` | Frontend base URL for email reset links | `http://localhost:5173` |

> **Note:** `ROI_TRIGGER_SECRET` is required in all environments. Without it, `/api/trigger-roi` always returns 403.

> **Note:** `FRONTEND_URL` should be `http://localhost:5173` locally and `https://investment-project-six.vercel.app` on Render.

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

---

## API Documentation

### Base URL

- Local: `http://localhost:5000/api`
- Production: `https://investment-project-3rxk.onrender.com/api`

All protected routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/auth/forgot-password` | No | Send password reset email |
| POST | `/auth/reset-password` | No | Reset password using token from email |

**POST /auth/register — Request:**
```json
{
  "fullName": "Arnab Mandal",
  "email": "arnab@gmail.com",
  "mobile": "9876543210",
  "password": "MyPass123",
  "referralCode": "O0CDF0EW"
}
```

**POST /auth/register — Response:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "...",
      "fullName": "Arnab Mandal",
      "email": "arnab@gmail.com",
      "referralCode": "K7MN2PLQ",
      "walletBalance": 0,
      "accountStatus": "Active"
    }
  }
}
```

**POST /auth/login — Request:**
```json
{
  "email": "arnab@gmail.com",
  "password": "MyPass123"
}
```

**POST /auth/login — Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "...",
      "fullName": "Arnab Mandal",
      "walletBalance": 50,
      "referralCode": "O0CDF0EW"
    }
  }
}
```

**POST /auth/forgot-password — Request:**
```json
{
  "email": "arnab@gmail.com"
}
```

**POST /auth/forgot-password — Response:**
```json
{
  "success": true,
  "message": "If that email exists, a reset link has been sent."
}
```

> **Note:** Always returns the same message whether or not the email exists — prevents email enumeration attacks.

**POST /auth/reset-password — Request:**
```json
{
  "token": "raw_token_from_email_link",
  "newPassword": "NewPass123"
}
```

**POST /auth/reset-password — Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in."
}
```

### Investments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/investments` | Yes | Create investment |
| GET | `/investments` | Yes | Get all investments |
| GET | `/investments/:id` | Yes | Get single investment |

**POST /investments — Request:**
```json
{
  "amount": 5000
}
```

**POST /investments — Response:**
```json
{
  "success": true,
  "message": "Investment created successfully.",
  "data": {
    "investment": {
      "amount": 5000,
      "plan": {
        "planId": "basic",
        "planName": "Basic Plan",
        "dailyROIPercentage": 1,
        "durationDays": 90
      },
      "startDate": "2026-06-25T00:00:00.000Z",
      "endDate": "2026-09-23T00:00:00.000Z",
      "status": "Active"
    }
  }
}
```

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | Yes | Get summary stats |

**GET /dashboard — Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "walletBalance": 50,
      "totalROIEarned": 50,
      "totalLevelIncomeEarned": 0,
      "totalInvested": 5000,
      "todayROI": 50,
      "activeInvestmentsCount": 1,
      "totalInvestmentsCount": 1
    },
    "recentROIHistory": [],
    "recentReferralIncome": [],
    "investments": []
  }
}
```

### Referral

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/referral/direct` | Yes | Get direct referrals |
| GET | `/referral/tree` | Yes | Get full referral tree |

**GET /referral/direct — Response:**
```json
{
  "success": true,
  "data": {
    "count": 1,
    "referrals": [
      {
        "id": "...",
        "fullName": "Rahul Sharma",
        "email": "rahul@gmail.com",
        "referralCode": "7IH8LUPH",
        "totalInvested": 0,
        "accountStatus": "Active",
        "joinedAt": "2026-06-25T20:15:04.126Z"
      }
    ]
  }
}
```

**GET /referral/tree — Response:**
```json
{
  "success": true,
  "data": {
    "tree": [
      {
        "id": "...",
        "fullName": "Rahul Sharma",
        "level": 1,
        "children": []
      }
    ],
    "levelIncomeSummary": []
  }
}
```

### Manual ROI Trigger

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/trigger-roi?secret=<ROI_TRIGGER_SECRET>` | Secret token | Manually trigger ROI cron job |

> **Note:** Protected by `ROI_TRIGGER_SECRET` environment variable. Pass the secret as a query param `?secret=your_secret` or as a header `x-trigger-secret: your_secret`. Available in all environments.

---

## Investment Plans

| Plan | Amount Range | Daily ROI | Duration |
|---|---|---|---|
| Basic | ₹1,000 – ₹9,999 | 1.0% | 90 days |
| Silver | ₹10,000 – ₹49,999 | 1.5% | 90 days |
| Gold | ₹50,000 – ₹1,99,999 | 2.0% | 90 days |
| Platinum | ₹2,00,000 – ₹1,00,00,000 | 2.5% | 90 days |

---

## Referral Level Income

| Level | Percentage of ROI |
|---|---|
| Level 1 (Direct referral) | 10% |
| Level 2 | 5% |
| Level 3 | 3% |
| Level 4 | 2% |
| Level 5 | 1% |

---

## Assumptions

1. **Plan auto-detection** — Plan is automatically determined from the investment amount. Users do not manually select a plan.
2. **Multiple investments allowed** — A user can have multiple active investments simultaneously.
3. **Plan snapshot** — Plan details are stored inside each investment document at creation time so future plan changes do not affect existing investments.
4. **ROI idempotency** — Enforced via unique MongoDB index on `(investment, creditedDate)`. If cron runs twice on the same day, the second run is safely skipped.
5. **Referral income idempotency** — Enforced via manual duplicate check before each level income credit.
6. **Inactive ancestors** — If an ancestor in the referral tree is suspended, they are skipped but traversal continues to higher levels so other ancestors still earn.
7. **Wallet** — A single wallet balance field tracks all credits (ROI + referral income). Withdrawal functionality is out of scope for this assessment.
8. **Password policy** — Minimum 8 characters with at least one uppercase letter, one lowercase letter, and one number.
9. **JWT expiry** — Tokens expire after 7 days. Refresh token flow is out of scope.
10. **Timezone** — Cron job runs at midnight IST (Asia/Kolkata) using node-cron timezone option.
11. **Frontend port** — Vite dev server runs on port 5173. CORS is configured for both port 3000 and 5173.
12. **bcryptjs version** — Downgraded to v2.4.3 for compatibility with Mongoose v9 async pre-save hooks.
13. **Express version** — Using v4.19.2 for stability. Express v5 has breaking changes that conflict with standard middleware patterns.
14. **Maximum investment** — Maximum investment per transaction is ₹1,00,00,000 (1 Crore). Enforced at frontend input, route validation, and controller level.
15. **SPA routing** — `vercel.json` rewrite rules added to handle React Router client-side routing on page refresh.
16. **Password reset token** — SHA-256 hashed before storing in DB. Raw token sent via email only. Token expires in 1 hour and is invalidated after use.
17. **Email enumeration prevention** — Forgot password endpoint always returns the same response regardless of whether the email exists.
18. **Cron recovery** — `recoverMissedExecutions: true` set on node-cron so missed midnight executions are retried on server startup. External keepalive ping via cron-job.org prevents Render free tier cold starts.