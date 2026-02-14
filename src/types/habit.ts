export const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export type DayId = (typeof DAY_ORDER)[number];

export type TaskPriority = 'normal' | 'important';

export type Task = {
  id: string;
  title: string;
  description?: string;
  points: number;
  completed: boolean;
  priority: TaskPriority;
  createdAt: string;
};

export type DayPlan = {
  day: DayId;
  label: string;
  tasks: Task[];
};

export type WeeklyPlan = {
  id: string;
  weekId: string;
  weekLabel: string;
  createdAt: string;
  days: Record<DayId, DayPlan>;
};

export type TaskInput = {
  title: string;
  description?: string;
  points: number;
  priority: TaskPriority;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeSettings = {
  mode: ThemeMode;
};

export type ColorSettings = {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
};

export type GoalSettings = {
  dailyGoal: number;
  weeklyGoal: number;
};

export type AppSettings = {
  themeSettings: ThemeSettings;
  colorSettings: ColorSettings;
  goals: GoalSettings;
  lockPastWeeks: boolean;
};
