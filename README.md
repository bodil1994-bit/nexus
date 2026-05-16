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

## 7.1) Graphify for AI usage

Graphify is installed globally for your user account.

Binary location:

```bash
~/Library/Python/3.14/bin/graphify
```

Add it to your shell PATH (so `graphify` works directly):

```bash
echo 'export PATH="$HOME/Library/Python/3.14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Quick verify:

```bash
graphify --version
```

Use it with your AI assistant:

```bash
/graphify .
```

## 8) Testing the supplier batch upload feature

This feature lets a supplier submit a batch passport and see extraction results.

### Setup

Make sure the app is running and the database is seeded:

```bash
npm run db:seed
npm run dev
```

### Walkthrough

1. Open http://localhost:3000
2. Click **Supplier Upload**
3. Select a manufacturer from the dropdown (KTM, Fisher, or Giro)
4. Enter an order number, e.g. `ORD-9001`
5. Enter a batch number, e.g. `BAT-100`
6. Attach the sample file below and click **Submit Batch**
7. You are redirected to http://localhost:3000/supplier/batches
8. Find your new batch in the list — status is either `complete` or `missing information`
9. Click the order number to open the batch detail page and see which fields were extracted

### Sample upload file

A ready-made CSV is included at `public/sample-passport.csv`. Download it from:

```
http://localhost:3000/sample-passport.csv
```

Contents:

```csv
field,value
product_name,LFP Battery Pack 750Wh
material,Lithium Iron Phosphate
origin_country,Germany
supplier_name,CellChem GmbH
sustainability_notes,Certified carbon-neutral manufacturing process
```

> Extraction is mocked — the result (complete vs missing information) is random. Submit the same file multiple times to see both outcomes.

### Seed data

The seed creates three pre-populated batches you can browse without submitting anything:

| Batch | Status |
|-------|--------|
| BAT-001 | processing |
| BAT-002 | complete — all 5 fields populated |
| BAT-003 | missing information — origin\_country, supplier\_name, sustainability\_notes missing |

View them at http://localhost:3000/supplier/batches

---

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
