# PeopleHub — HR Dashboard

An original HR dashboard built with React 19, TypeScript, Vite, and Tailwind CSS v4. Light theme, white cards, teal accent, bilingual English/Arabic (full RTL support).

## Honest caveat

This is a **title-only build**: it was inspired by a Code & Chill Facebook reel titled *"HR Dashboard Animation"*. Facebook's login wall blocked watching the video, so only the title was visible. Everything here — layout, data, and features — is our own faithful interpretation of what an HR dashboard should do, written from scratch. It is **not** a frame-by-frame copy of the video, and no code from anyone else was used.

## Features

- **Header** — greeting, current date, EN/AR language toggle, "Demo data" badge.
- **Headcount stats** — total employees, new hires this month, department count, and open roles, all computed live from the employee list.
- **Attendance today** — Present / Remote / On leave counts with a breakdown bar.
- **Employee directory** — search by name or role, department filter (Engineering, Design, Sales, Marketing, HR, Finance), per-employee status.
- **Leave requests** — pending requests with working Approve / Reject buttons; decided requests move to a decided list with timestamps.
- **New-hire onboarding** — per-hire checklists (laptop, accounts, buddy, first-week plan, HR paperwork) with a progress bar per hire.
- **Department breakdown** — live headcount bars per department.
- **Add / delete employees** — a working add-employee form (name, role, department, email); every employee can be deleted. Stats update immediately.
- **Persistence** — employees, leave decisions, and onboarding progress are saved in `localStorage` (`hrdash-state-v1`); language under `hrdash-lang`. A "Reset demo data" button restores the original demo set.

All data is fictional demo data — no real employees.

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `@phosphor-icons/react` icons
- Manrope font
- i18n via JSON locale files (`locales/en/common.json`, `locales/ar/common.json`) with exact key parity

## Run

```bash
npm run dev      # start the dev server
npm run build    # typecheck (tsc) + production build
npm run preview  # preview the production build
```

Node modules are shared with the sibling projects via a symlink to the shared template's `node_modules` — no `npm install` needed.
