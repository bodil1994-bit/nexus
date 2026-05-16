# Nexus - Beginner Setup Guide

This guide is written for people with little or no development experience.
Follow it top-to-bottom and copy/paste commands exactly.

## What this project is

This is a Next.js web app with a local SQLite database managed by Prisma.

- App framework: Next.js
- Database: SQLite (local file)
- ORM/tooling: Prisma

## 1) Install required software

You need these installed on your computer:

1. Node.js 20+ (recommended: latest LTS)
2. npm (comes with Node.js)
3. Git (optional, but recommended)

To check Node/npm:

```bash
node -v
npm -v
```

## 2) Download and open the project

If you already have the folder, open a terminal in the project root.
If not:

```bash
git clone <your-repo-url>
cd nexus
```

## 3) Install project dependencies

Run:

```bash
npm install
```

This downloads all required packages.

## 4) Environment file (.env)

This project uses a `.env` file in the repo root.

Expected value:

```env
DATABASE_URL="file:./dev.db"
```

If `.env` is missing, create it and paste that exact line.

## 5) Initialize the database

Run migration (creates tables):

```bash
npm run db:migrate -- --name init
```

Seed demo data:

```bash
npm run db:seed
```

After seeding, you should have:

- 1 Supplier
- 1 Manufacturer
- 1 Order
- 2 Batches

## 6) Run the app

Start development server:

```bash
npm run dev
```

Open this in your browser:

- http://localhost:3000

## 7) Useful commands (copy/paste)

Run tests:

```bash
npm test
```

Run linter:

```bash
npm run lint
```

Open Prisma Studio (database UI):

```bash
npm run db:studio
```

Reset database completely (deletes data, then re-runs migrations):

```bash
npm run db:reset
```

## 8) Common issues and fixes

### "Port 3000 is already in use"

- Close the other app using port 3000, or run on another port:

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

### "Cannot find module" or dependency errors

Run:

```bash
rm -rf node_modules package-lock.json
npm install
```

Then try again.

### Prisma or DB errors

Try full reset:

```bash
npm run db:reset
npm run db:seed
```

## 9) Project structure (only what you need)

- `src/` - application code
- `prisma/schema.prisma` - database schema
- `prisma/seed.ts` - demo data seeding script
- `.env` - local environment settings

## 10) First-time success checklist

Run these in order:

1. `npm install`
2. `npm run db:migrate -- --name init`
3. `npm run db:seed`
4. `npm run dev`

If step 4 opens at `http://localhost:3000`, setup is complete.
