# LMS Application

This repository contains a full-stack Learning Management System following specified architecture.

## Structure

- `backend/`: Express.js + TypeScript server with Prisma ORM.
- `frontend/`: Next.js 14 App Router with TailwindCSS and Zustand.

## Getting Started

### Backend

```bash
cd backend
npm install
# set DATABASE_URL and secrets in .env
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

```