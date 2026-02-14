# Habit Tracker / Weekly Planner

Modern, responsive habit tracker with weekly planning, task priorities, customizable themes, and persistent user settings.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- Zustand state management + localStorage persistence
- dnd-kit for drag-and-drop

## What Was Added

- Settings panel with persistent:
  - Theme mode (`light`, `dark`, `system`)
  - Color customization (primary, accent, background)
  - Daily and weekly point goals
  - Optional read-only past weeks
- Removed money conversion UI/logic (points-only)
- Weekly navigation:
  - Previous / next week
  - Week picker (`YYYY-WW`)
  - Separate stored data per week
- Task priority system:
  - `Normal` and `Important (!)`
  - Important tasks auto-sorted to top per day
  - Priority badges and highlighted card style
- Goal progress bars:
  - Daily points progress
  - Weekly points progress
- Store migration logic from legacy state (`plan` + `darkMode`) to new multi-week settings model

## Folder Structure

```text
src/
  components/
    AddTaskModal.tsx
    ColorPickerGroup.tsx
    DayColumn.tsx
    GoalProgressBar.tsx
    PointsHeader.tsx
    PriorityBadge.tsx
    SettingsPanel.tsx
    StatsBar.tsx
    TaskCard.tsx
    ThemeSelector.tsx
    WeekNavigator.tsx
    WeeklyBoard.tsx
    WeeklyCalendar.tsx
  data/
    mockWeek.ts
  store/
    useHabitStore.ts
  types/
    habit.ts
  utils/
    date.ts
    stats.ts
  App.tsx
  main.tsx
  styles.css
```

## Setup

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Production build:

```bash
npm run build
```

## Persistence

All weeks + settings persist in local storage key:

- `habit-weekly-planner-store`

## Notes

- Existing local state is migrated automatically.
- Priority sort order in each day: important first, then by creation time.
