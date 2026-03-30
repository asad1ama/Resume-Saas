# ResumeAI — AI-Powered Resume Review SaaS

> Upload your resume and get instant AI feedback, ATS score, and improvement suggestions. Built and deployed as a production full-stack SaaS.

🌐 **Live Demo:** [resume-saas-ebon.vercel.app](https://resume-saas-ebon.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green?style=flat-square&logo=postgresql)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![AI](https://img.shields.io/badge/AI-Groq%20LLaMA-orange?style=flat-square)
![Payments](https://img.shields.io/badge/Payments-Razorpay-blue?style=flat-square)

---

## What is this?

ResumeAI is a production-ready SaaS application where users upload their resume PDF and receive:

- **ATS Score** out of 100 — how well it passes automated screening
- **5 specific issues** with actionable fix suggestions
- **Rewritten bullet points** — stronger, more impactful versions
- **Missing keywords** — what to add to improve ATS ranking

Users get 3 free reviews. Additional credits can be purchased via Razorpay.

---

## Features

| Feature | Description |
|---|---|
| Google OAuth | Sign in with Google using NextAuth v5 |
| PDF Upload & Parsing | Extract text from uploaded resume PDFs |
| AI Analysis | Groq LLaMA 3.1 analyzes resume and returns structured JSON feedback |
| ATS Scoring | Score out of 100 with visual progress bar |
| Credit System | Users start with 3 free credits, buy more via Razorpay |
| Razorpay Payments | Full payment flow with webhook signature verification |
| Review History | Dashboard shows all past reviews with scores |
| Responsive UI | Works on mobile, tablet, and desktop |
| CI/CD | Auto-deploy to Vercel on every GitHub push |

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) — React framework with server components
- **TypeScript** — Type safety throughout
- **Tailwind CSS** — Utility-first styling

### Backend
- **Next.js API Routes** — Serverless API endpoints
- **Prisma ORM** — Type-safe database access
- **NextAuth v5** — Authentication with JWT sessions

### AI & Integrations
- **Groq API** (LLaMA 3.1 8B) — Fast, free AI inference
- **unpdf** — PDF text extraction
- **Razorpay** — Indian payment gateway with webhook verification

### Infrastructure
- **Supabase** — PostgreSQL database
- **Vercel** — Deployment with serverless functions
- **GitHub Actions** — CI/CD pipeline

---

## Architecture

```
User Browser
     │
     ▼
Next.js App (Vercel)
     │
     ├── /app/(auth)/login          → Google OAuth via NextAuth
     ├── /app/(dashboard)/dashboard → User dashboard (server component)
     ├── /app/(dashboard)/review    → Upload + results pages
     ├── /app/(dashboard)/billing   → Credit purchase page
     │
     └── /app/api/
              ├── auth/[...nextauth] → NextAuth handlers
              ├── review/create     → PDF parse + Groq AI + DB save
              └── payment/
                       ├── create-order → Razorpay order creation
                       └── webhook      → Payment confirmation + credit addition
                                          (HMAC-SHA256 signature verification)
     │
     ├── Supabase PostgreSQL
     │    ├── User (id, email, credits)
     │    ├── Review (atsScore, issues, rewrites, keywords, status)
     │    └── Payment (razorpayOrderId, amount, credits, status)
     │
     ├── Groq API (LLaMA 3.1)
     └── Razorpay Payment Gateway
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  credits   Int      @default(3)
  reviews   Review[]
  payments  Payment[]
}

model Review {
  id        String       @id @default(cuid())
  userId    String
  atsScore  Int?
  issues    Json?        // [{title, description}]
  rewrites  Json?        // [{original, improved}]
  keywords  Json?        // [string]
  status    ReviewStatus // PENDING | DONE | FAILED
}

model Payment {
  id                String        @id @default(cuid())
  userId            String
  razorpayOrderId   String        @unique
  razorpayPaymentId String?
  amount            Int           // in paise
  credits           Int
  status            PaymentStatus // PENDING | SUCCESS | FAILED
}
```

---

## Key Engineering Decisions

### Why Groq instead of OpenAI?
Groq provides free API access with 14,400 requests/day using LLaMA 3.1. For a portfolio project this removes the need for paid API credits while still delivering production-quality AI responses.

### Why JWT sessions instead of database sessions?
Prisma 7 with serverless Vercel functions has cold-start connection issues with database sessions. JWT sessions are stateless — no DB call needed to verify auth, which makes every request faster.

### Why credits deduct after AI response, not before?
If the AI call fails, the user shouldn't lose a credit. Credits are deducted only after a successful `DONE` review is written to the database — protecting users from being charged for failed reviews.

### Razorpay Webhook Security
All webhook events are verified using HMAC-SHA256 signature before processing. This prevents anyone from hitting the webhook endpoint directly and fraudulently adding credits without paying.



### Required Environment Variables

```bash
# Database
DATABASE_URL=""              # Supabase PostgreSQL connection string

# Auth
AUTH_SECRET=""               # Random secret for JWT signing
AUTH_URL=""                  # Your app URL
AUTH_GOOGLE_ID=""            # Google OAuth Client ID
AUTH_GOOGLE_SECRET=""        # Google OAuth Client Secret

# AI
GROQ_API_KEY=""              # From console.groq.com (free)

# Payments
RAZORPAY_KEY_ID=""           # From Razorpay Dashboard
RAZORPAY_KEY_SECRET=""       # From Razorpay Dashboard
RAZORPAY_WEBHOOK_SECRET=""   # Set in Razorpay Webhook settings
```

---

## Project Structure

```
resume-saas/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/
│   │   ├── dashboard/         # Main dashboard
│   │   ├── review/
│   │   │   ├── new/           # Upload page
│   │   │   └── [id]/          # Review results
│   │   └── billing/           # Credits & payments
│   └── api/
│       ├── auth/[...nextauth]/ # Auth handlers
│       ├── review/create/      # AI review endpoint
│       └── payment/
│           ├── create-order/   # Razorpay order
│           └── webhook/        # Payment confirmation
├── components/
│   ├── shared/                # SignOutButton, SessionProvider, BuyCreditsButton
│   └── review/                # Review-specific components
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── prisma.ts              # Prisma client singleton
│   └── openai.ts              # Groq AI helper
├── prisma/
│   └── schema.prisma          # Database schema
└── types/                     # Shared TypeScript types
```

---

## What I Learned Building This

- How to structure a full-stack Next.js app with App Router and route groups
- Handling PDF parsing in serverless environments
- Prompt engineering for structured JSON responses from LLMs
- Razorpay webhook signature verification using HMAC-SHA256
- Managing Prisma in serverless Vercel deployments
- JWT vs database sessions tradeoffs in production

---

## Author

**Asad Amanullah**
- Live project: [resume-saas-ebon.vercel.app](https://resume-saas-ebon.vercel.app)
- GitHub: [@asad1ama](https://github.com/asad1ama)

