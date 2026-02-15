export const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export type DayId = (typeof DAY_ORDER)[number];

export type HabitPriority = 'normal' | 'important';

export type HabitType = 'normal' | 'important';

export type RecurrenceMode = 'this_week' | 'weeks' | 'forever';

export type RecurrenceInput =
  | {
      mode: 'this_week';
    }
  | {
      mode: 'weeks';
      weeks: number;
    }
  | {
      mode: 'forever';
    };

export type HabitItem = {
  id: string;
  title: string;
  description?: string;
  points: number;
  completed: boolean;
  completedAt?: string;
  completionLog: string[];
  priority: HabitPriority;
  recurringId?: string;
  targetDurationMin?: number;
  completedDurationMin: number;
  createdAt: string;
  updatedAt: string;
};

export type PlannerItem = {
  id: string;
  title: string;
  description?: string;
  eventTime?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DayContainerData = {
  day: DayId;
  label: string;
  habits: HabitItem[];
  agenda: PlannerItem[];
};

export type WeeklyPlan = {
  id: string;
  weekId: string;
  weekLabel: string;
  createdAt: string;
  updatedAt: string;
  days: Record<DayId, DayContainerData>;
};

export type RecurringHabitTemplate = {
  id: string;
  title: string;
  description?: string;
  points: number;
  priority: HabitPriority;
  targetDurationMin?: number;
  createdAt: string;
  startsWeekId: string;
  weekday: DayId;
  recurrence: Exclude<RecurrenceInput, { mode: 'this_week' }>;
};

export type HabitOverride = {
  recurringId: string;
  weekId: string;
  day: DayId;
  deleted?: boolean;
  patch?: Partial<
    Pick<
      HabitItem,
      | 'title'
      | 'description'
      | 'points'
      | 'priority'
      | 'targetDurationMin'
      | 'completedDurationMin'
      | 'completed'
      | 'completedAt'
      | 'completionLog'
    >
  >;
  updatedAt: string;
};

export type HabitInput = {
  title: string;
  description?: string;
  points: number;
  habitType: HabitType;
  targetDurationMin?: number;
  recurrence: RecurrenceInput;
};

export type PlannerInput = {
  title: string;
  description?: string;
  eventTime?: string;
};

export type BookEntry = {
  id: string;
  title: string;
  author: string;
  startDate: string;
  targetFinishDate: string;
  dailyPageGoal: number;
  totalPages: number;
  notes: string;
  quotes: string[];
  pagesLog: Record<string, number>;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutItem = {
  id: string;
  title: string;
  reps?: string;
  durationMin?: number;
  completed: boolean;
};

export type WorkoutProgram = {
  id: string;
  name: string;
  days: Record<DayId, WorkoutItem[]>;
  createdAt: string;
};

export type WishItem = {
  id: string;
  name: string;
  price?: number;
  purchased: boolean;
};

export type WishList = {
  id: string;
  name: string;
  items: WishItem[];
};

export type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  category?: string;
  createdAt: string;
};

export type BudgetMonth = {
  monthKey: string;
  income: number;
  expenses: ExpenseItem[];
};

export type MediaType = 'movie' | 'tv' | 'book';

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  genre?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColors = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  panelColor: string;
  cardColor: string;
};

export type FontFamilyOption = 'system' | 'inter' | 'poppins' | 'roboto';

export type UserProfile = {
  name: string;
  avatar: string;
};

export type UserAuthState = {
  status: 'loading' | 'signed_out' | 'signed_in';
  userId: string | null;
  email: string | null;
};

// Backward-compat aliases used by existing components
export type Task = HabitItem;
export type TaskInput = HabitInput;
export type DayPlan = DayContainerData;
