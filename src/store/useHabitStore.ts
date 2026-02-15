import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEmptyWeek, createMockWeek } from '../data/mockWeek';
import type {
  BookEntry,
  BudgetMonth,
  DayId,
  ExpenseItem,
  HabitHistoryEventType,
  HabitHistoryItem,
  HabitInput,
  HabitItem,
  HabitOverride,
  HabitPriority,
  MediaItem,
  MediaType,
  PlannerInput,
  PlannerItem,
  RecurringHabitTemplate,
  ThemeColors,
  ThemeMode,
  UserAuthState,
  UserProfile,
  WeeklyPlan,
  WishList,
  WorkoutProgram
} from '../types/habit';
import {
  DAY_ORDER
} from '../types/habit';
import {
  addWeeksToId,
  compareWeekIds,
  dayIdToIndex,
  getCurrentMonthKey,
  getCurrentWeekId,
  getWeekLabelFromId,
  uid
} from '../utils/date';

type DragTarget = {
  day: DayId;
  id: string;
};

type WeeklyPlannerSlice = {
  currentWeekId: string;
  currentWeekLabel: string;
  weeks: Record<string, WeeklyPlan>;
};

type HabitsSlice = {
  recurringHabits: Record<string, RecurringHabitTemplate>;
  habitOverrides: Record<string, HabitOverride>;
  habitHistory: HabitHistoryItem[];
  dailyGoal: number;
  weeklyGoal: number;
  lockPastWeeks: boolean;
};

type BooksSlice = {
  entries: BookEntry[];
  sidebarOpen: boolean;
};

type SportsSlice = {
  programs: WorkoutProgram[];
};

type WishListsSlice = {
  lists: WishList[];
};

type BudgetSlice = {
  currentMonthKey: string;
  months: Record<string, BudgetMonth>;
};

type MediaListSlice = {
  items: MediaItem[];
};

type ThemeSettingsSlice = {
  mode: ThemeMode;
  colors: ThemeColors;
};

type CloudAppState = {
  weeklyPlanner: WeeklyPlannerSlice;
  habits: HabitsSlice;
  books: BooksSlice;
  sports: SportsSlice;
  wishLists: WishListsSlice;
  budget: BudgetSlice;
  mediaList: MediaListSlice;
  userProfile: UserProfile;
  themeSettings: ThemeSettingsSlice;
};

type HabitStore = CloudAppState & {
  userAuth: UserAuthState;
  cloudRowId: string | null;
  setUserAuth: (auth: UserAuthState) => void;
  setCloudRowId: (id: string | null) => void;
  setUserProfile: (patch: Partial<UserProfile>) => void;
  exportCloudState: () => CloudAppState;
  importCloudState: (payload: Partial<CloudAppState>) => void;

  getCurrentWeek: () => WeeklyPlan;
  isCurrentWeekReadOnly: () => boolean;
  setCurrentWeek: (weekId: string) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  resetCurrentWeek: () => void;

  addHabit: (day: DayId, input: HabitInput) => void;
  updateHabit: (
    day: DayId,
    habitId: string,
    patch: Partial<
      Pick<
        HabitItem,
        | 'title'
        | 'description'
        | 'points'
        | 'priority'
        | 'completed'
        | 'targetDurationMin'
        | 'completedDurationMin'
      >
    >
  ) => void;
  toggleHabit: (day: DayId, habitId: string) => void;
  deleteHabit: (day: DayId, habitId: string) => void;
  updateHabitDuration: (day: DayId, habitId: string, completedDurationMin: number) => void;
  reorderHabit: (from: DragTarget, to: DragTarget) => void;
  moveHabitToDayEnd: (from: DragTarget, toDay: DayId) => void;

  addPlannerItem: (day: DayId, input: PlannerInput) => void;
  updatePlannerItem: (
    day: DayId,
    itemId: string,
    patch: Partial<Pick<PlannerItem, 'title' | 'description' | 'eventTime' | 'completed'>>
  ) => void;
  togglePlannerItem: (day: DayId, itemId: string) => void;
  deletePlannerItem: (day: DayId, itemId: string) => void;

  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
  setDailyGoal: (value: number) => void;
  setWeeklyGoal: (value: number) => void;
  setLockPastWeeks: (enabled: boolean) => void;

  toggleBooksSidebar: () => void;
  addBook: (input: {
    title: string;
    author: string;
    startDate: string;
    targetFinishDate: string;
    dailyPageGoal: number;
    totalPages: number;
    notes?: string;
  }) => void;
  logBookPages: (bookId: string, date: string, pages: number) => void;
  updateBookNotes: (bookId: string, notes: string) => void;
  addBookQuote: (bookId: string, quote: string) => void;

  addWorkoutProgram: (name: string) => void;
  addWorkoutItem: (
    programId: string,
    day: DayId,
    input: { title: string; reps?: string; durationMin?: number }
  ) => void;
  toggleWorkoutItem: (programId: string, day: DayId, itemId: string) => void;

  addWishList: (name: string) => void;
  addWishItem: (listId: string, name: string, price?: number) => void;
  toggleWishItem: (listId: string, itemId: string) => void;

  setMonthlyIncome: (monthKey: string, income: number) => void;
  addExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  deleteExpense: (monthKey: string, expenseId: string) => void;

  addMediaItem: (input: { type: MediaType; title: string; genre?: string; notes?: string }) => void;
  toggleMediaItem: (itemId: string) => void;
  deleteMediaItem: (itemId: string) => void;
};

const CLOUD_STATE_WEEK_LABEL = '__APP_STATE_V3__';

export const getCloudStateWeekLabel = (): string => CLOUD_STATE_WEEK_LABEL;

const clampNumber = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
};

const defaultThemeSettings: ThemeSettingsSlice = {
  mode: 'system',
  colors: {
    primaryColor: '#0f766e',
    secondaryColor: '#0ea5a3',
    backgroundColor: '#f6f7f9'
  }
};

const defaultUserProfile: UserProfile = {
  name: 'New User',
  avatar: '🙂'
};

const createSampleSportsProgram = (): WorkoutProgram => ({
  id: uid(),
  name: 'Starter Program',
  createdAt: new Date().toISOString(),
  days: {
    mon: [{ id: uid(), title: 'Chest Workout', reps: '3x12', completed: false }],
    tue: [{ id: uid(), title: '30 min cardio', durationMin: 30, completed: false }],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
  }
});

const createSampleBooks = (): BookEntry[] => [
  {
    id: uid(),
    title: 'Atomic Habits',
    author: 'James Clear',
    startDate: new Date().toISOString().slice(0, 10),
    targetFinishDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    dailyPageGoal: 20,
    totalPages: 320,
    notes: 'Identity-based habits summary notes',
    quotes: ['You do not rise to the level of your goals.'],
    pagesLog: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const createSampleWishLists = (): WishList[] => [
  {
    id: uid(),
    name: 'Tech Wishlist',
    items: [{ id: uid(), name: 'Mechanical Keyboard', price: 120, purchased: false }]
  }
];

const createSampleMedia = (): MediaItem[] => [
  {
    id: uid(),
    type: 'movie',
    title: 'Interstellar',
    genre: 'Sci-Fi',
    notes: 'Rewatch with notes',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

const createDefaultBudget = (): BudgetSlice => {
  const monthKey = getCurrentMonthKey();
  return {
    currentMonthKey: monthKey,
    months: {
      [monthKey]: {
        monthKey,
        income: 0,
        expenses: []
      }
    }
  };
};

const createDefaultCloudState = (): CloudAppState => {
  const currentWeekId = getCurrentWeekId();
  const week = createMockWeek(currentWeekId);

  return {
    weeklyPlanner: {
      currentWeekId,
      currentWeekLabel: week.weekLabel,
      weeks: {
        [currentWeekId]: week
      }
    },
    habits: {
      recurringHabits: {},
      habitOverrides: {},
      habitHistory: [],
      dailyGoal: 20,
      weeklyGoal: 100,
      lockPastWeeks: false
    },
    books: {
      entries: createSampleBooks(),
      sidebarOpen: true
    },
    sports: {
      programs: [createSampleSportsProgram()]
    },
    wishLists: {
      lists: createSampleWishLists()
    },
    budget: createDefaultBudget(),
    mediaList: {
      items: createSampleMedia()
    },
    userProfile: defaultUserProfile,
    themeSettings: defaultThemeSettings
  };
};

const isImportant = (priority: HabitPriority): boolean => priority === 'important';

const sortHabits = (habits: HabitItem[]): HabitItem[] => {
  return [...habits].sort((a, b) => {
    if (a.priority !== b.priority) {
      return isImportant(a.priority) ? -1 : 1;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

const normalizeHabit = (habit: HabitItem): HabitItem => ({
  ...habit,
  points: clampNumber(habit.points),
  completedDurationMin: clampNumber(habit.completedDurationMin),
  priority: habit.priority ?? 'normal',
  completionLog: habit.completionLog ?? (habit.completedAt ? [habit.completedAt] : []),
  isRecurringInstance: habit.isRecurringInstance ?? Boolean(habit.recurringId),
  updatedAt: habit.updatedAt ?? habit.createdAt
});

const normalizeAgendaItem = (item: PlannerItem): PlannerItem => ({
  ...item,
  updatedAt: item.updatedAt ?? item.createdAt
});

const normalizeWeek = (plan: WeeklyPlan, weekId: string): WeeklyPlan => {
  const base = createEmptyWeek(weekId);

  const normalizedDays = DAY_ORDER.reduce((acc, day) => {
    const sourceDay = plan.days[day] ?? base.days[day];
    const legacyTasks = (sourceDay as unknown as { tasks?: HabitItem[] }).tasks ?? [];

    const habits = sourceDay.habits ?? legacyTasks;
    const agenda = sourceDay.agenda ?? [];

    acc[day] = {
      ...base.days[day],
      ...sourceDay,
      habits: sortHabits(habits.map(normalizeHabit)),
      agenda: agenda.map(normalizeAgendaItem)
    };

    return acc;
  }, {} as WeeklyPlan['days']);

  return {
    ...base,
    ...plan,
    weekId,
    weekLabel: getWeekLabelFromId(weekId),
    updatedAt: plan.updatedAt ?? plan.createdAt ?? new Date().toISOString(),
    days: normalizedDays
  };
};

const makeHistoryEvent = (
  payload: Omit<HabitHistoryItem, 'id' | 'timestamp'> & { eventType: HabitHistoryEventType }
): HabitHistoryItem => ({
  id: uid(),
  timestamp: new Date().toISOString(),
  ...payload
});

const pushHistory = (history: HabitHistoryItem[], event: HabitHistoryItem): HabitHistoryItem[] => {
  return [event, ...history].slice(0, 1500);
};

const getOverrideKey = (weekId: string, day: DayId, recurringId: string): string =>
  `${weekId}:${day}:${recurringId}`;

const shouldRecurringAppear = (
  recurring: RecurringHabitTemplate,
  weekId: string,
  day: DayId
): boolean => {
  const cmp = compareWeekIds(weekId, recurring.startsWeekId);
  if (cmp < 0) {
    return false;
  }

  if (cmp === 0 && dayIdToIndex(day) < dayIdToIndex(recurring.startsDayId)) {
    return false;
  }

  return recurring.active;
};

const buildRecurringHabit = (
  recurring: RecurringHabitTemplate,
  override: HabitOverride | undefined,
  existing: HabitItem | undefined
): HabitItem => {
  const now = new Date().toISOString();
  const patch = override?.patch;

  const base: HabitItem = {
    id: existing?.id ?? uid(),
    title: recurring.title,
    description: recurring.description,
    points: recurring.points,
    completed: false,
    completedAt: undefined,
    completionLog: [],
    priority: recurring.priority,
    recurringId: recurring.id,
    isRecurringInstance: true,
    targetDurationMin: recurring.targetDurationMin,
    completedDurationMin: 0,
    createdAt: existing?.createdAt ?? recurring.createdAt,
    updatedAt: now
  };

  return normalizeHabit({
    ...base,
    ...patch,
    completionLog: patch?.completionLog ?? base.completionLog,
    completedAt: patch?.completedAt ?? base.completedAt,
    updatedAt: now
  });
};

const applyRecurringToWeek = (
  plan: WeeklyPlan,
  recurringHabits: Record<string, RecurringHabitTemplate>,
  habitOverrides: Record<string, HabitOverride>
): WeeklyPlan => {
  // Build each day from manual habits + generated recurring instances while respecting day-specific overrides.
  const week = normalizeWeek(plan, plan.weekId);

  const nextDays = DAY_ORDER.reduce((acc, day) => {
    const existingDay = week.days[day];

    const generatedMap = new Map<string, HabitItem>();
    existingDay.habits
      .filter((habit) => habit.recurringId)
      .forEach((habit) => {
        if (habit.recurringId) {
          generatedMap.set(habit.recurringId, habit);
        }
      });

    const manualHabits = existingDay.habits.filter(
      (habit) => !habit.recurringId || !recurringHabits[habit.recurringId]
    );

    const generatedHabits: HabitItem[] = [];

    Object.values(recurringHabits).forEach((recurring) => {
      if (!shouldRecurringAppear(recurring, week.weekId, day)) {
        return;
      }

      const override = habitOverrides[getOverrideKey(week.weekId, day, recurring.id)];
      if (override?.deleted) {
        return;
      }

      generatedHabits.push(buildRecurringHabit(recurring, override, generatedMap.get(recurring.id)));
    });

    acc[day] = {
      ...existingDay,
      habits: sortHabits([...manualHabits, ...generatedHabits])
    };

    return acc;
  }, {} as WeeklyPlan['days']);

  return {
    ...week,
    updatedAt: new Date().toISOString(),
    days: nextDays
  };
};

const ensureWeekExists = (
  weeklyPlanner: WeeklyPlannerSlice,
  habitsSlice: HabitsSlice,
  weekId: string
): WeeklyPlannerSlice => {
  const existing = weeklyPlanner.weeks[weekId];
  const base = existing ? normalizeWeek(existing, weekId) : createEmptyWeek(weekId);
  const generated = applyRecurringToWeek(base, habitsSlice.recurringHabits, habitsSlice.habitOverrides);

  return {
    ...weeklyPlanner,
    weeks: {
      ...weeklyPlanner.weeks,
      [weekId]: generated
    }
  };
};

const applyRecurringToFutureKnownWeeks = (
  weeklyPlanner: WeeklyPlannerSlice,
  habitsSlice: HabitsSlice,
  startsWeekId: string
): WeeklyPlannerSlice => {
  const nextWeeks = { ...weeklyPlanner.weeks };

  Object.entries(nextWeeks).forEach(([weekId, week]) => {
    if (compareWeekIds(weekId, startsWeekId) >= 0) {
      nextWeeks[weekId] = applyRecurringToWeek(week, habitsSlice.recurringHabits, habitsSlice.habitOverrides);
    }
  });

  return {
    ...weeklyPlanner,
    weeks: nextWeeks
  };
};

const updateWeekForCurrent = (
  state: HabitStore,
  updater: (week: WeeklyPlan) => WeeklyPlan
): WeeklyPlannerSlice => {
  const weekId = state.weeklyPlanner.currentWeekId;
  const ensured = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
  const currentWeek = ensured.weeks[weekId];

  return {
    ...ensured,
    weeks: {
      ...ensured.weeks,
      [weekId]: normalizeWeek(updater(currentWeek), weekId)
    },
    currentWeekLabel: getWeekLabelFromId(weekId)
  };
};

const getDefaultMonth = (monthKey: string): BudgetMonth => ({
  monthKey,
  income: 0,
  expenses: []
});

const ensureBudgetMonth = (budget: BudgetSlice, monthKey: string): BudgetSlice => {
  if (budget.months[monthKey]) {
    return budget;
  }

  return {
    ...budget,
    months: {
      ...budget.months,
      [monthKey]: getDefaultMonth(monthKey)
    }
  };
};

const fromCloudState = (payload: Partial<CloudAppState>): CloudAppState => {
  const defaults = createDefaultCloudState();

  const legacyWeeklyRangePayload = payload as unknown as {
    weeklyRange?: { currentWeekId?: string; currentWeekLabel?: string };
    weeks?: Record<string, WeeklyPlan>;
  };

  const currentWeekId =
    payload.weeklyPlanner?.currentWeekId ??
    legacyWeeklyRangePayload.weeklyRange?.currentWeekId ??
    getCurrentWeekId();

  const weeksRaw =
    payload.weeklyPlanner?.weeks ?? legacyWeeklyRangePayload.weeks ?? defaults.weeklyPlanner.weeks;

  const habitsRaw = payload.habits ??
    ((payload as unknown as {
      recurringHabits?: Record<string, RecurringHabitTemplate>;
      habitOverrides?: Record<string, HabitOverride>;
      habitHistory?: HabitHistoryItem[];
      dailyGoal?: number;
      weeklyGoal?: number;
      lockPastWeeks?: boolean;
    }) as Partial<HabitsSlice>);

  const habits: HabitsSlice = {
    recurringHabits: habitsRaw.recurringHabits ?? defaults.habits.recurringHabits,
    habitOverrides: habitsRaw.habitOverrides ?? defaults.habits.habitOverrides,
    habitHistory: habitsRaw.habitHistory ?? defaults.habits.habitHistory,
    dailyGoal: clampNumber(habitsRaw.dailyGoal ?? defaults.habits.dailyGoal),
    weeklyGoal: clampNumber(habitsRaw.weeklyGoal ?? defaults.habits.weeklyGoal),
    lockPastWeeks: habitsRaw.lockPastWeeks ?? defaults.habits.lockPastWeeks
  };

  const normalizedWeeks = Object.fromEntries(
    Object.entries(weeksRaw).map(([weekId, week]) => [
      weekId,
      applyRecurringToWeek(normalizeWeek(week, weekId), habits.recurringHabits, habits.habitOverrides)
    ])
  ) as Record<string, WeeklyPlan>;

  const weeklyPlannerBase: WeeklyPlannerSlice = {
    currentWeekId,
    currentWeekLabel: getWeekLabelFromId(currentWeekId),
    weeks: normalizedWeeks
  };

  const weeklyPlanner = ensureWeekExists(weeklyPlannerBase, habits, currentWeekId);

  const incomingTheme = payload.themeSettings;
  const legacyThemePayload = payload as unknown as {
    themeMode?: ThemeMode;
    themeColors?: ThemeColors;
    settings?: {
      themeSettings?: { mode?: ThemeMode };
      colorSettings?: { primaryColor?: string; accentColor?: string; backgroundColor?: string };
    };
  };

  const themeSettings: ThemeSettingsSlice = {
    mode:
      incomingTheme?.mode ??
      legacyThemePayload.themeMode ??
      legacyThemePayload.settings?.themeSettings?.mode ??
      defaults.themeSettings.mode,
    colors: {
      primaryColor:
        incomingTheme?.colors?.primaryColor ??
        legacyThemePayload.themeColors?.primaryColor ??
        legacyThemePayload.settings?.colorSettings?.primaryColor ??
        defaults.themeSettings.colors.primaryColor,
      secondaryColor:
        incomingTheme?.colors?.secondaryColor ??
        legacyThemePayload.themeColors?.secondaryColor ??
        legacyThemePayload.settings?.colorSettings?.accentColor ??
        defaults.themeSettings.colors.secondaryColor,
      backgroundColor:
        incomingTheme?.colors?.backgroundColor ??
        legacyThemePayload.themeColors?.backgroundColor ??
        legacyThemePayload.settings?.colorSettings?.backgroundColor ??
        defaults.themeSettings.colors.backgroundColor
    }
  };

  const budgetRaw = payload.budget ?? defaults.budget;
  const currentMonthKey = budgetRaw.currentMonthKey ?? getCurrentMonthKey();
  const budget = ensureBudgetMonth(
    {
      currentMonthKey,
      months: budgetRaw.months ?? defaults.budget.months
    },
    currentMonthKey
  );

  return {
    weeklyPlanner,
    habits,
    books: {
      entries: payload.books?.entries ?? defaults.books.entries,
      sidebarOpen: payload.books?.sidebarOpen ?? defaults.books.sidebarOpen
    },
    sports: {
      programs: payload.sports?.programs ?? defaults.sports.programs
    },
    wishLists: {
      lists: payload.wishLists?.lists ?? defaults.wishLists.lists
    },
    budget,
    mediaList: {
      items: payload.mediaList?.items ?? defaults.mediaList.items
    },
    userProfile: {
      ...defaults.userProfile,
      ...(payload.userProfile ?? {})
    },
    themeSettings
  };
};

const migratePersistedState = (persisted: unknown): CloudAppState => {
  // Supports older store shapes so users keep existing data after modular Life OS upgrade.
  if (!persisted || typeof persisted !== 'object') {
    return createDefaultCloudState();
  }

  const raw = persisted as Record<string, unknown>;

  if (raw.weeklyPlanner && raw.habits) {
    return fromCloudState(raw as Partial<CloudAppState>);
  }

  if (raw.weeklyRange || raw.weeks || raw.currentWeekId || raw.plan) {
    return fromCloudState(raw as Partial<CloudAppState>);
  }

  return createDefaultCloudState();
};

const initialCloud = createDefaultCloudState();

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      ...initialCloud,
      userAuth: {
        status: 'loading',
        userId: null,
        email: null
      },
      cloudRowId: null,

      setUserAuth: (auth) => set({ userAuth: auth }),
      setCloudRowId: (id) => set({ cloudRowId: id }),
      setUserProfile: (patch) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...patch
          }
        })),

      exportCloudState: () => ({
        weeklyPlanner: get().weeklyPlanner,
        habits: get().habits,
        books: get().books,
        sports: get().sports,
        wishLists: get().wishLists,
        budget: get().budget,
        mediaList: get().mediaList,
        userProfile: get().userProfile,
        themeSettings: get().themeSettings
      }),
      importCloudState: (payload) =>
        set((state) => ({
          ...state,
          ...fromCloudState(payload)
        })),

      getCurrentWeek: () => {
        const state = get();
        return (
          state.weeklyPlanner.weeks[state.weeklyPlanner.currentWeekId] ??
          createEmptyWeek(state.weeklyPlanner.currentWeekId)
        );
      },
      isCurrentWeekReadOnly: () => {
        const state = get();
        return (
          state.habits.lockPastWeeks &&
          compareWeekIds(state.weeklyPlanner.currentWeekId, getCurrentWeekId()) < 0
        );
      },
      setCurrentWeek: (weekId) =>
        set((state) => {
          const weeklyPlanner = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          return {
            weeklyPlanner: {
              ...weeklyPlanner,
              currentWeekId: weekId,
              currentWeekLabel: getWeekLabelFromId(weekId)
            }
          };
        }),
      goToPreviousWeek: () =>
        set((state) => {
          const weekId = addWeeksToId(state.weeklyPlanner.currentWeekId, -1);
          const weeklyPlanner = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          return {
            weeklyPlanner: {
              ...weeklyPlanner,
              currentWeekId: weekId,
              currentWeekLabel: getWeekLabelFromId(weekId)
            }
          };
        }),
      goToNextWeek: () =>
        set((state) => {
          const weekId = addWeeksToId(state.weeklyPlanner.currentWeekId, 1);
          const weeklyPlanner = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          return {
            weeklyPlanner: {
              ...weeklyPlanner,
              currentWeekId: weekId,
              currentWeekLabel: getWeekLabelFromId(weekId)
            }
          };
        }),
      resetCurrentWeek: () =>
        set((state) => {
          const weekId = state.weeklyPlanner.currentWeekId;
          const base = createEmptyWeek(weekId);
          const week = applyRecurringToWeek(base, state.habits.recurringHabits, state.habits.habitOverrides);

          return {
            weeklyPlanner: {
              ...state.weeklyPlanner,
              currentWeekLabel: week.weekLabel,
              weeks: {
                ...state.weeklyPlanner.weeks,
                [weekId]: week
              }
            }
          };
        }),

      addHabit: (day, input) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const weekId = state.weeklyPlanner.currentWeekId;

          if (input.habitType === 'recurring') {
            const recurringId = uid();
            const recurring: RecurringHabitTemplate = {
              id: recurringId,
              title: input.title.trim(),
              description: input.description?.trim(),
              points: clampNumber(input.points),
              priority: 'normal',
              targetDurationMin: clampNumber(input.targetDurationMin ?? 0) || undefined,
              createdAt: new Date().toISOString(),
              startsWeekId: weekId,
              startsDayId: day,
              active: true
            };

            const habits: HabitsSlice = {
              ...state.habits,
              recurringHabits: {
                ...state.habits.recurringHabits,
                [recurringId]: recurring
              }
            };

            const weeklyPlanner = applyRecurringToFutureKnownWeeks(state.weeklyPlanner, habits, weekId);
            const ensured = ensureWeekExists(weeklyPlanner, habits, weekId);

            const habit = ensured.weeks[weekId].days[day].habits.find((item) => item.recurringId === recurringId);
            const habitHistory = habit
              ? pushHistory(
                  habits.habitHistory,
                  makeHistoryEvent({
                    habitId: habit.id,
                    day,
                    weekId,
                    titleSnapshot: habit.title,
                    eventType: 'generated_recurring'
                  })
                )
              : habits.habitHistory;

            return {
              habits: {
                ...habits,
                habitHistory
              },
              weeklyPlanner: ensured
            };
          }

          const priority: HabitPriority = input.habitType === 'important' ? 'important' : 'normal';
          const now = new Date().toISOString();

          const habit: HabitItem = normalizeHabit({
            id: uid(),
            title: input.title.trim(),
            description: input.description?.trim(),
            points: clampNumber(input.points),
            completed: false,
            completedAt: undefined,
            completionLog: [],
            priority,
            recurringId: undefined,
            isRecurringInstance: false,
            targetDurationMin: clampNumber(input.targetDurationMin ?? 0) || undefined,
            completedDurationMin: 0,
            createdAt: now,
            updatedAt: now
          });

          const weeklyPlanner = updateWeekForCurrent(state, (week) => ({
            ...week,
            days: {
              ...week.days,
              [day]: {
                ...week.days[day],
                habits: sortHabits([...week.days[day].habits, habit])
              }
            }
          }));

          return {
            weeklyPlanner,
            habits: {
              ...state.habits,
              habitHistory: pushHistory(
                state.habits.habitHistory,
                makeHistoryEvent({
                  habitId: habit.id,
                  day,
                  weekId,
                  titleSnapshot: habit.title,
                  eventType: 'created'
                })
              )
            }
          };
        }),

      updateHabit: (day, habitId, patch) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const weekId = state.weeklyPlanner.currentWeekId;
          const weeklyPlannerEnsured = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          const currentWeek = weeklyPlannerEnsured.weeks[weekId];
          const existing = currentWeek.days[day].habits.find((habit) => habit.id === habitId);

          if (!existing) {
            return state;
          }

          const now = new Date().toISOString();
          let eventType: HabitHistoryEventType = 'updated';
          let completedAt = existing.completedAt;
          let completionLog = [...existing.completionLog];

          if (patch.completed !== undefined && patch.completed !== existing.completed) {
            if (patch.completed) {
              completedAt = now;
              completionLog = [...completionLog, now];
              eventType = 'completed';
            } else {
              completedAt = undefined;
              eventType = 'uncompleted';
            }
          }

          if (
            patch.completedDurationMin !== undefined &&
            clampNumber(patch.completedDurationMin) !== existing.completedDurationMin
          ) {
            eventType = 'duration_updated';
          }

          const updatedHabit = normalizeHabit({
            ...existing,
            ...patch,
            title: patch.title === undefined ? existing.title : patch.title.trim(),
            description: patch.description === undefined ? existing.description : patch.description.trim(),
            points: patch.points === undefined ? existing.points : clampNumber(patch.points),
            targetDurationMin:
              patch.targetDurationMin === undefined
                ? existing.targetDurationMin
                : clampNumber(patch.targetDurationMin) || undefined,
            completedDurationMin:
              patch.completedDurationMin === undefined
                ? existing.completedDurationMin
                : clampNumber(patch.completedDurationMin),
            completed: patch.completed === undefined ? existing.completed : patch.completed,
            completedAt,
            completionLog,
            updatedAt: now
          });

          const weeklyPlanner = {
            ...weeklyPlannerEnsured,
            weeks: {
              ...weeklyPlannerEnsured.weeks,
              [weekId]: {
                ...currentWeek,
                updatedAt: now,
                days: {
                  ...currentWeek.days,
                  [day]: {
                    ...currentWeek.days[day],
                    habits: sortHabits(
                      currentWeek.days[day].habits.map((habit) =>
                        habit.id === habitId ? updatedHabit : habit
                      )
                    )
                  }
                }
              }
            }
          };

          const habits = { ...state.habits };
          if (updatedHabit.recurringId) {
            habits.habitOverrides = {
              ...habits.habitOverrides,
              [getOverrideKey(weekId, day, updatedHabit.recurringId)]: {
                recurringId: updatedHabit.recurringId,
                weekId,
                day,
                patch: {
                  title: updatedHabit.title,
                  description: updatedHabit.description,
                  points: updatedHabit.points,
                  priority: updatedHabit.priority,
                  targetDurationMin: updatedHabit.targetDurationMin,
                  completedDurationMin: updatedHabit.completedDurationMin,
                  completed: updatedHabit.completed,
                  completedAt: updatedHabit.completedAt,
                  completionLog: updatedHabit.completionLog
                },
                updatedAt: now
              }
            };
          }

          habits.habitHistory = pushHistory(
            habits.habitHistory,
            makeHistoryEvent({
              habitId,
              day,
              weekId,
              titleSnapshot: updatedHabit.title,
              eventType
            })
          );

          return {
            weeklyPlanner,
            habits
          };
        }),

      toggleHabit: (day, habitId) => {
        const state = get();
        const week = state.getCurrentWeek();
        const habit = week.days[day].habits.find((item) => item.id === habitId);
        if (!habit) {
          return;
        }
        state.updateHabit(day, habitId, { completed: !habit.completed });
      },

      deleteHabit: (day, habitId) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const weekId = state.weeklyPlanner.currentWeekId;
          const weeklyPlannerEnsured = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          const week = weeklyPlannerEnsured.weeks[weekId];
          const habit = week.days[day].habits.find((item) => item.id === habitId);

          if (!habit) {
            return state;
          }

          const weeklyPlanner = {
            ...weeklyPlannerEnsured,
            weeks: {
              ...weeklyPlannerEnsured.weeks,
              [weekId]: {
                ...week,
                updatedAt: new Date().toISOString(),
                days: {
                  ...week.days,
                  [day]: {
                    ...week.days[day],
                    habits: week.days[day].habits.filter((item) => item.id !== habitId)
                  }
                }
              }
            }
          };

          const habits = { ...state.habits };
          if (habit.recurringId) {
            habits.habitOverrides = {
              ...habits.habitOverrides,
              [getOverrideKey(weekId, day, habit.recurringId)]: {
                recurringId: habit.recurringId,
                weekId,
                day,
                deleted: true,
                updatedAt: new Date().toISOString()
              }
            };
          }

          habits.habitHistory = pushHistory(
            habits.habitHistory,
            makeHistoryEvent({
              habitId,
              day,
              weekId,
              titleSnapshot: habit.title,
              eventType: 'deleted'
            })
          );

          return {
            weeklyPlanner,
            habits
          };
        }),

      updateHabitDuration: (day, habitId, completedDurationMin) =>
        get().updateHabit(day, habitId, { completedDurationMin: clampNumber(completedDurationMin) }),

      reorderHabit: (from, to) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const weekId = state.weeklyPlanner.currentWeekId;
          const weeklyPlannerEnsured = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          const week = weeklyPlannerEnsured.weeks[weekId];

          if (from.day === to.day) {
            const habits = week.days[from.day].habits;
            const oldIndex = habits.findIndex((item) => item.id === from.id);
            const newIndex = habits.findIndex((item) => item.id === to.id);

            if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
              return state;
            }

            const moved = sortHabits(arrayMove(habits, oldIndex, newIndex));

            return {
              weeklyPlanner: {
                ...weeklyPlannerEnsured,
                weeks: {
                  ...weeklyPlannerEnsured.weeks,
                  [weekId]: {
                    ...week,
                    days: {
                      ...week.days,
                      [from.day]: {
                        ...week.days[from.day],
                        habits: moved
                      }
                    }
                  }
                }
              }
            };
          }

          const source = [...week.days[from.day].habits];
          const target = [...week.days[to.day].habits];
          const sourceIndex = source.findIndex((item) => item.id === from.id);
          const targetIndex = target.findIndex((item) => item.id === to.id);

          if (sourceIndex < 0 || targetIndex < 0) {
            return state;
          }

          const [moved] = source.splice(sourceIndex, 1);
          target.splice(targetIndex, 0, moved);

          return {
            weeklyPlanner: {
              ...weeklyPlannerEnsured,
              weeks: {
                ...weeklyPlannerEnsured.weeks,
                [weekId]: {
                  ...week,
                  days: {
                    ...week.days,
                    [from.day]: {
                      ...week.days[from.day],
                      habits: sortHabits(source)
                    },
                    [to.day]: {
                      ...week.days[to.day],
                      habits: sortHabits(target)
                    }
                  }
                }
              }
            }
          };
        }),

      moveHabitToDayEnd: (from, toDay) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const weekId = state.weeklyPlanner.currentWeekId;
          const weeklyPlannerEnsured = ensureWeekExists(state.weeklyPlanner, state.habits, weekId);
          const week = weeklyPlannerEnsured.weeks[weekId];
          const source = [...week.days[from.day].habits];
          const idx = source.findIndex((item) => item.id === from.id);

          if (idx < 0) {
            return state;
          }

          const [moved] = source.splice(idx, 1);
          const target = sortHabits([...week.days[toDay].habits, moved]);

          return {
            weeklyPlanner: {
              ...weeklyPlannerEnsured,
              weeks: {
                ...weeklyPlannerEnsured.weeks,
                [weekId]: {
                  ...week,
                  days: {
                    ...week.days,
                    [from.day]: {
                      ...week.days[from.day],
                      habits: sortHabits(source)
                    },
                    [toDay]: {
                      ...week.days[toDay],
                      habits: target
                    }
                  }
                }
              }
            }
          };
        }),

      addPlannerItem: (day, input) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          const plannerItem: PlannerItem = {
            id: uid(),
            title: input.title.trim(),
            description: input.description?.trim(),
            eventTime: input.eventTime,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          return {
            weeklyPlanner: updateWeekForCurrent(state, (week) => ({
              ...week,
              days: {
                ...week.days,
                [day]: {
                  ...week.days[day],
                  agenda: [...week.days[day].agenda, plannerItem]
                }
              }
            }))
          };
        }),

      updatePlannerItem: (day, itemId, patch) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          return {
            weeklyPlanner: updateWeekForCurrent(state, (week) => ({
              ...week,
              days: {
                ...week.days,
                [day]: {
                  ...week.days[day],
                  agenda: week.days[day].agenda.map((item) =>
                    item.id === itemId
                      ? {
                          ...item,
                          ...patch,
                          title: patch.title === undefined ? item.title : patch.title.trim(),
                          description:
                            patch.description === undefined
                              ? item.description
                              : patch.description.trim(),
                          updatedAt: new Date().toISOString()
                        }
                      : item
                  )
                }
              }
            }))
          };
        }),

      togglePlannerItem: (day, itemId) => {
        const week = get().getCurrentWeek();
        const item = week.days[day].agenda.find((entry) => entry.id === itemId);
        if (!item) {
          return;
        }

        get().updatePlannerItem(day, itemId, { completed: !item.completed });
      },

      deletePlannerItem: (day, itemId) =>
        set((state) => {
          if (get().isCurrentWeekReadOnly()) {
            return state;
          }

          return {
            weeklyPlanner: updateWeekForCurrent(state, (week) => ({
              ...week,
              days: {
                ...week.days,
                [day]: {
                  ...week.days[day],
                  agenda: week.days[day].agenda.filter((entry) => entry.id !== itemId)
                }
              }
            }))
          };
        }),

      setThemeMode: (mode) =>
        set((state) => ({
          themeSettings: {
            ...state.themeSettings,
            mode
          }
        })),
      setThemeColor: (key, value) =>
        set((state) => ({
          themeSettings: {
            ...state.themeSettings,
            colors: {
              ...state.themeSettings.colors,
              [key]: value
            }
          }
        })),
      setDailyGoal: (value) =>
        set((state) => ({
          habits: {
            ...state.habits,
            dailyGoal: clampNumber(value)
          }
        })),
      setWeeklyGoal: (value) =>
        set((state) => ({
          habits: {
            ...state.habits,
            weeklyGoal: clampNumber(value)
          }
        })),
      setLockPastWeeks: (enabled) =>
        set((state) => ({
          habits: {
            ...state.habits,
            lockPastWeeks: enabled
          }
        })),

      toggleBooksSidebar: () =>
        set((state) => ({
          books: {
            ...state.books,
            sidebarOpen: !state.books.sidebarOpen
          }
        })),
      addBook: (input) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: [
              {
                id: uid(),
                title: input.title.trim(),
                author: input.author.trim(),
                startDate: input.startDate,
                targetFinishDate: input.targetFinishDate,
                dailyPageGoal: clampNumber(input.dailyPageGoal),
                totalPages: clampNumber(input.totalPages),
                notes: input.notes?.trim() ?? '',
                quotes: [],
                pagesLog: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              ...state.books.entries
            ]
          }
        })),
      logBookPages: (bookId, date, pages) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: state.books.entries.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    pagesLog: {
                      ...book.pagesLog,
                      [date]: clampNumber(pages)
                    },
                    updatedAt: new Date().toISOString()
                  }
                : book
            )
          }
        })),
      updateBookNotes: (bookId, notes) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: state.books.entries.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    notes: notes.trim(),
                    updatedAt: new Date().toISOString()
                  }
                : book
            )
          }
        })),
      addBookQuote: (bookId, quote) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: state.books.entries.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    quotes: quote.trim() ? [...book.quotes, quote.trim()] : book.quotes,
                    updatedAt: new Date().toISOString()
                  }
                : book
            )
          }
        })),

      addWorkoutProgram: (name) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: [
              {
                id: uid(),
                name: name.trim(),
                createdAt: new Date().toISOString(),
                days: {
                  mon: [],
                  tue: [],
                  wed: [],
                  thu: [],
                  fri: [],
                  sat: [],
                  sun: []
                }
              },
              ...state.sports.programs
            ]
          }
        })),
      addWorkoutItem: (programId, day, input) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: state.sports.programs.map((program) =>
              program.id === programId
                ? {
                    ...program,
                    days: {
                      ...program.days,
                      [day]: [
                        ...program.days[day],
                        {
                          id: uid(),
                          title: input.title.trim(),
                          reps: input.reps,
                          durationMin: input.durationMin,
                          completed: false
                        }
                      ]
                    }
                  }
                : program
            )
          }
        })),
      toggleWorkoutItem: (programId, day, itemId) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: state.sports.programs.map((program) =>
              program.id === programId
                ? {
                    ...program,
                    days: {
                      ...program.days,
                      [day]: program.days[day].map((item) =>
                        item.id === itemId ? { ...item, completed: !item.completed } : item
                      )
                    }
                  }
                : program
            )
          }
        })),

      addWishList: (name) =>
        set((state) => ({
          wishLists: {
            ...state.wishLists,
            lists: [...state.wishLists.lists, { id: uid(), name: name.trim(), items: [] }]
          }
        })),
      addWishItem: (listId, name, price) =>
        set((state) => ({
          wishLists: {
            ...state.wishLists,
            lists: state.wishLists.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    items: [
                      ...list.items,
                      {
                        id: uid(),
                        name: name.trim(),
                        price: price === undefined ? undefined : clampNumber(price),
                        purchased: false
                      }
                    ]
                  }
                : list
            )
          }
        })),
      toggleWishItem: (listId, itemId) =>
        set((state) => ({
          wishLists: {
            ...state.wishLists,
            lists: state.wishLists.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    items: list.items.map((item) =>
                      item.id === itemId ? { ...item, purchased: !item.purchased } : item
                    )
                  }
                : list
            )
          }
        })),

      setMonthlyIncome: (monthKey, income) =>
        set((state) => {
          const budget = ensureBudgetMonth(state.budget, monthKey);
          return {
            budget: {
              ...budget,
              currentMonthKey: monthKey,
              months: {
                ...budget.months,
                [monthKey]: {
                  ...budget.months[monthKey],
                  income: clampNumber(income)
                }
              }
            }
          };
        }),
      addExpense: (monthKey, input) =>
        set((state) => {
          const budget = ensureBudgetMonth(state.budget, monthKey);
          const expense: ExpenseItem = {
            id: uid(),
            name: input.name.trim(),
            amount: Math.max(0, Number(input.amount) || 0),
            category: input.category?.trim(),
            createdAt: new Date().toISOString()
          };

          return {
            budget: {
              ...budget,
              currentMonthKey: monthKey,
              months: {
                ...budget.months,
                [monthKey]: {
                  ...budget.months[monthKey],
                  expenses: [expense, ...budget.months[monthKey].expenses]
                }
              }
            }
          };
        }),
      deleteExpense: (monthKey, expenseId) =>
        set((state) => {
          const budget = ensureBudgetMonth(state.budget, monthKey);
          return {
            budget: {
              ...budget,
              months: {
                ...budget.months,
                [monthKey]: {
                  ...budget.months[monthKey],
                  expenses: budget.months[monthKey].expenses.filter((expense) => expense.id !== expenseId)
                }
              }
            }
          };
        }),

      addMediaItem: (input) =>
        set((state) => ({
          mediaList: {
            ...state.mediaList,
            items: [
              {
                id: uid(),
                type: input.type,
                title: input.title.trim(),
                genre: input.genre?.trim(),
                notes: input.notes?.trim(),
                completed: false,
                createdAt: new Date().toISOString()
              },
              ...state.mediaList.items
            ]
          }
        })),
      toggleMediaItem: (itemId) =>
        set((state) => ({
          mediaList: {
            ...state.mediaList,
            items: state.mediaList.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        })),
      deleteMediaItem: (itemId) =>
        set((state) => ({
          mediaList: {
            ...state.mediaList,
            items: state.mediaList.items.filter((item) => item.id !== itemId)
          }
        }))
    }),
    {
      name: 'habit-weekly-planner-store',
      version: 4,
      partialize: (state) => ({
        weeklyPlanner: state.weeklyPlanner,
        habits: state.habits,
        books: state.books,
        sports: state.sports,
        wishLists: state.wishLists,
        budget: state.budget,
        mediaList: state.mediaList,
        userProfile: state.userProfile,
        themeSettings: state.themeSettings
      }),
      migrate: (persisted) => {
        const cloud = migratePersistedState(persisted);
        return {
          ...cloud,
          userAuth: {
            status: 'loading',
            userId: null,
            email: null
          },
          cloudRowId: null
        } as HabitStore;
      }
    }
  )
);
