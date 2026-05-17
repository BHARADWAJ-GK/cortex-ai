# 🧠 Cortex AI — AI-Powered Code Intelligence Platform

> The AI-native code review & developer intelligence platform. Catch bugs, security vulnerabilities, and performance issues before production.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

- 🤖 **AI Code Review** — Instant expert-level analysis powered by Google Gemini
- 💬 **AI Chat Assistant** — 24/7 coding help with full markdown + code rendering
- 🔐 **JWT Authentication** — Secure login/register with NextAuth.js
- 📊 **Dashboard** — Real-time stats, weekly charts, recent reviews
- 🛡️ **Security Scanner** — OWASP Top 10 detection built into reviews
- 📱 **Fully Responsive** — Works on mobile, tablet, desktop
- ⚡ **Cinematic UI** — Particle effects, smooth animations, glassmorphism
- 🎯 **Magnetic Cursor** — Premium interactive cursor experience

---

## 🗂️ Project Structure

```
cortex-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (no layout)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── layout.tsx            # Wraps with sidebar
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   ├── review/page.tsx       # Code review
│   │   ├── chat/page.tsx         # AI assistant
│   │   └── settings/page.tsx     # Profile & billing
│   ├── api/                      # API Routes (backend)
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   └── register/         # User registration
│   │   ├── review/               # AI code review
│   │   ├── chat/                 # AI chat
│   │   ├── stats/                # Dashboard stats
│   │   └── user/                 # User profile CRUD
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── loading.tsx               # Global loading
│   └── not-found.tsx             # 404 page
│
├── components/
│   ├── landing/                  # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx              # Particle canvas + animations
│   │   ├── Features.tsx          # Bento grid
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                # Dashboard UI
│   │   ├── DashboardLayout.tsx   # Sidebar + mobile menu
│   │   ├── StatsCard.tsx         # Animated counter cards
│   │   ├── ReviewCard.tsx        # Review list items
│   │   ├── WeeklyChart.tsx       # Bar chart
│   │   └── ChatInterface.tsx     # Real-time AI chat
│   ├── shared/
│   │   ├── Providers.tsx         # NextAuth session provider
│   │   └── Cursor.tsx            # Magnetic cursor effect
│   └── ui/                       # ShadCN-style primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.ts
│
├── lib/
│   ├── prisma.ts                 # Singleton Prisma client
│   ├── auth.ts                   # NextAuth configuration
│   ├── ai.ts                     # Anthropic AI integration
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # Database models
│   └── seed.ts                   # Demo data seeder
│
├── types/index.ts                # TypeScript types
├── middleware.ts                  # Route protection
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)
- GEMINI API key

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/cortex-ai.git
cd cortex-ai
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Fill in your values (see Environment Variables section below)
```

### 3. Database Setup
```bash
npx prisma db push
npx prisma generate
npx ts-node prisma/seed.ts   # Optional: loads demo data
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Demo Login
- **Email:** demo@cortexai.dev
- **Password:** Demo123!

---

## 🔑 Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cortexai"

# Auth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AI
GEMINI_API_KEY="Alza-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### How to get each key:

**DATABASE_URL:**
- Local: Install PostgreSQL, create database `cortexai`
- Cloud: Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tier)

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**GEMINI_API_KEY:**
- Create account at GEMINI API
- Go to API Keys → Create Key

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Vercel CLI (alternative)
npm i -g vercel
vercel --prod
```

---

## 🗄️ Database Schema

| Model    | Description                          |
|----------|--------------------------------------|
| User     | Accounts, plans, usage counters      |
| Review   | AI code reviews with feedback        |
| Chat     | Conversation sessions                |
| Message  | Individual chat messages             |
| Account  | OAuth provider accounts (NextAuth)   |
| Session  | Active user sessions (NextAuth)      |

---

## 🏗️ Architecture

```
Browser → Next.js (App Router)
           ├── Server Components (pages, layouts)
           ├── Client Components (interactive UI)
           └── API Routes (/api/*)
                ├── NextAuth.js (session management)
                ├── Prisma ORM → PostgreSQL
                └── Google SDK → GEMINI AI
```

---

## 🧪 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | Next.js 14, React 18      |
| Styling    | Tailwind CSS, Framer Motion|
| Backend    | Next.js API Routes        |
| Database   | PostgreSQL + Prisma ORM   |
| Auth       | NextAuth.js v4 + JWT      |
| AI         | Google GEMINI API         |
| Deployment | Vercel + Neon DB          |
| Language   | TypeScript                |

---

## 📝 Interview Talking Points

1. **"Why Next.js instead of separate frontend/backend?"**
   → Unified codebase, SSR for SEO, API routes eliminate extra server

2. **"How does authentication work?"**
   → NextAuth.js manages sessions via JWT. Passwords hashed with bcrypt (salt=12). Middleware protects routes.

3. **"How do you connect to the AI?"**
   → Google SDK calls Google GEMINI 1.5 Flash. System prompt defines AI persona. JSON-structured responses parsed for reviews.

4. **"How is the database structured?"**
   → Prisma ORM with PostgreSQL. User → Reviews (one-to-many), User → Chats → Messages (nested). Cascade deletes.

5. **"What security measures exist?"**
   → Zod validation on all inputs, bcrypt hashing, JWT sessions, middleware route protection, plan-based rate limiting.

---

## 📄 License

MIT © 2025 Cortex AI
