# Agent Best Practices

## Operating Context
- This repository is a Next.js 16 app with React 19, Prisma 7, Tailwind CSS 4, and Vitest.
- Treat framework behavior as version-sensitive. Before changing Next.js-specific APIs, routing, metadata, rendering, server actions, or build behavior, read the relevant local guide in `node_modules/next/dist/docs/`.
- Use the installed docs and project files as the source of truth over older conventions or assumptions.

## Engineering Practices
- Keep changes small, focused, and aligned with the current product direction in `docs/PRD.md`.
- Preserve consistency between UI flows, Prisma schema, migrations, seed data, and tests.
- Prefer typed, explicit code paths over implicit framework magic when the behavior affects data or compliance workflows.
- Avoid introducing new dependencies unless the value is clear and the existing stack cannot reasonably solve the problem.
- Do not overwrite unrelated local changes. Inspect the working tree before broad edits.

## Validation
- Run the narrowest useful validation after edits.
- Use `npm run typecheck` for TypeScript changes.
- Use `npm run lint` for lint-sensitive changes.
- Use `npm test` for behavior or component changes.
- Use Prisma migration and seed commands when database schema or seed data changes.

## Commit Messages
Commit automatically when a logical unit of work is complete — do not wait to be asked, but do not commit every file change separately. Always use the exact format `<type>(<scope>): <description>` — for example `feat(ui): add batch status badges` or `chore(db): add passport document migration` — never deviations like `feat: US-004 - Title` or any format without a scope in parentheses. Never commit internal tracking updates (e.g. progress logs, prd.json status fields) as standalone commits — include them in the related code commit or skip them entirely. Never add `Co-Authored-By` trailers. Subject line must be lowercase, imperative, no period, and ≤ 72 characters.

## Documentation
- Keep this file limited to durable agent guidance and best practices.
- Keep product requirements, user flows, scope, and acceptance criteria in `docs/PRD.md`.
- Keep beginner setup and operational commands in `README.md`.

