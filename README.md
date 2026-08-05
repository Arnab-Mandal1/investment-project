# Pro Investment — MERN Stack Project

A full-stack investment and referral platform built with the MERN Stack (MongoDB, Express.js, React.js, Node.js).

---

## Project Structure

```
investment-project/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
├── postman_collection.json
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js v4 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs v2.4.3 |
| Scheduler | node-cron |
| Frontend | React 19, Vite, Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/investment-project.git
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
# Fill in your MongoDB URI and JWT secret

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

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

---

## API Documentation

### Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |

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

### Development Only

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/trigger-roi` | No | Manually trigger ROI cron |

---

## Investment Plans

| Plan | Amount Range | Daily ROI | Duration |
|---|---|---|---|
| Basic | ₹1,000 – ₹9,999 | 1.0% | 90 days |
| Silver | ₹10,000 – ₹49,999 | 1.5% | 90 days |
| Gold | ₹50,000 – ₹1,99,999 | 2.0% | 90 days |
| Platinum | ₹2,00,000+ | 2.5% | 90 days |

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
