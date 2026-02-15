# Personal Life OS (Habit + Planner)

Existing React + TypeScript + Tailwind app extended into a modular personal productivity system.

## Tech

- React + TypeScript (Vite)
- Tailwind CSS
- Zustand (modular global store + migration)
- Supabase Auth + per-user cloud persistence

## Main Modules

- `Dashboard`
  - Vertical day layout (Mon -> Sun)
  - Each day has 2 separated sections:
    - `Daily Habits`
    - `Weekly Planner / Agenda`
- `Books`
  - Route-based pages: `/books` and `/books/:id`
  - Book list + dedicated detail page
  - Page logging, notes, quotes, progress, on-track check
- `Sports`
  - Workout programs by day
  - Exercise completion + edit + delete + clear day
- `Shopping Lists`
  - Default lists: Grocery List, Wish List
  - Add / rename / delete lists + item purchase status + optional price
- `Budget`
  - Monthly income/expenses, remaining balance, savings
- `Watch/Read Later`
  - Movies / TV / books list with completion status
- `Settings`
  - Theme mode + primary/secondary/background/card color
  - Global font family selection

## Habit System Features

- Habit priority: `Normal`, `! (Important)`
- Recurrence rules at creation:
  - `This week only`
  - `Repeat for X weeks`
  - `Repeat indefinitely`
- Recurrence applies silently (no recurring badge in cards)
- Important habits:
  - Sorted to top
  - Minimal `!` indicator only
- Duration tracking:
  - Target duration
  - Completed duration (inline)
- Duration UI renders only when duration data exists

## Store Architecture

The global Zustand store is split into scalable slices:

- `habits`
- `weeklyPlanner`
- `books`
- `sports`
- `shoppingLists`
- `budget`
- `mediaList`
- `userProfile`
- `themeSettings`

Plus runtime-only auth/session fields:

- `userAuth`
- `cloudRowId`

## Persistence

- Local: `habit-weekly-planner-store`
- Cloud: user-specific row in `weekly_plans` table where:
  - `week_label = '__APP_STATE_V3__'`
  - `data` contains all module state

## Supabase Setup

### 1) Enable Email Auth

- Supabase -> `Authentication` -> `Providers` -> `Email`

### 2) SQL (run once)

```sql
create table if not exists weekly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  week_label text not null,
  data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table weekly_plans enable row level security;

create policy "users can read own plans"
on weekly_plans for select
using (auth.uid() = user_id);

create policy "users can insert own plans"
on weekly_plans for insert
with check (auth.uid() = user_id);

create policy "users can update own plans"
on weekly_plans for update
using (auth.uid() = user_id);
```

### 3) Environment Variables

Create `.env` in project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Local Run

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Build

```bash
npm run build
```

## Deployment (Vercel)

- Framework: `Vite`
- Build command: `vite build`
- Output directory: `dist`
- Add same env vars in Vercel project settings.

### First-Time Deploy (Step-by-Step)

1. Push code to GitHub:

```bash
cd "/Users/damlaustun/Documents/New project/habit-project"
git add .
git commit -m "life os upgrade"
git push origin main
```

2. In Vercel:
- `Add New Project` -> import `damlaustun/habit-project`
- Preset: `Vite`
- Root Directory: `./`
- Add env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Click `Deploy`

3. Production URL:
- Open Vercel project -> `Overview`
- Your live URL is shown there (usually `*.vercel.app`)

### Redeploy After Every Git Push

- If GitHub is connected, every `git push origin main` auto-deploys.

### One-Command Manual Redeploy (Deploy Hook)

Create `.env.deploy` in project root:

```env
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...
```

Run:

```bash
cd "/Users/damlaustun/Documents/New project/habit-project"
./scripts/deploy.sh
```

## Notes

- Migration logic preserves older saved state formats.
- Existing habit completion logic is preserved and extended.
