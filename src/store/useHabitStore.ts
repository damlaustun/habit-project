import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEmptyWeek, createMockWeek } from '../data/mockWeek';
import type {
  BookEntry,
  BudgetMonth,
  DayId,
  ExpenseItem,
  FontFamilyOption,
  HabitInput,
  HabitItem,
  HabitOverride,
  HabitPriority,
  MediaItem,
  MediaType,
  NoteFolder,
  NoteItem,
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
  getCurrentMonthKey,
  getCurrentWeekId,
  getWeekDistance,
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
  recurrenceRules: Record<string, RecurringHabitTemplate>;
  habitOverrides: Record<string, HabitOverride>;
  dailyGoal: number;
  lockPastWeeks: boolean;
};

type BooksSlice = {
  entries: BookEntry[];
};

type SportsSlice = {
  programs: WorkoutProgram[];
  completions: Record<string, boolean>;
};

type ShoppingListsSlice = {
  lists: WishList[];
};

type BudgetSlice = {
  currentMonthKey: string;
  months: Record<string, BudgetMonth>;
};

type MediaListSlice = {
  items: MediaItem[];
};

type NotesSlice = {
  folders: NoteFolder[];
};

type ThemeSettingsSlice = {
  mode: ThemeMode;
  colors: ThemeColors;
  fontFamily: FontFamilyOption;
};

type CloudAppState = {
  weeklyPlanner: WeeklyPlannerSlice;
  habits: HabitsSlice;
  books: BooksSlice;
  sports: SportsSlice;
  shoppingLists: ShoppingListsSlice;
  budget: BudgetSlice;
  mediaList: MediaListSlice;
  notes: NotesSlice;
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
  setFontFamily: (value: FontFamilyOption) => void;
  setDailyGoal: (value: number) => void;
  setLockPastWeeks: (enabled: boolean) => void;
  resetAppData: () => void;

  addBook: (input: {
    title: string;
    author: string;
    startDate: string;
    targetFinishDate: string;
    dailyPageGoal: number;
    totalPages: number;
    notes?: string;
  }) => void;
  updateBook: (
    bookId: string,
    patch: Partial<
      Pick<
        BookEntry,
        'title' | 'author' | 'startDate' | 'targetFinishDate' | 'dailyPageGoal' | 'totalPages' | 'notes'
      >
    >
  ) => void;
  deleteBook: (bookId: string) => void;
  logBookPages: (bookId: string, date: string, pages: number) => void;
  updateBookNotes: (bookId: string, notes: string) => void;
  addBookQuote: (bookId: string, quote: string) => void;

  addWorkoutProgram: (name: string) => void;
  updateWorkoutProgram: (programId: string, patch: { name?: string; description?: string }) => void;
  deleteWorkoutProgram: (programId: string) => void;
  addWorkoutItem: (
    programId: string,
    day: DayId,
    input: { title: string; sets?: number; reps?: number; durationMin?: number }
  ) => void;
  toggleWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  updateWorkoutItem: (
    programId: string,
    day: DayId,
    itemId: string,
    patch: { title?: string; sets?: number; reps?: number; durationMin?: number }
  ) => void;
  deleteWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  clearWorkoutDay: (programId: string, day: DayId) => void;

  addShoppingList: (name: string) => void;
  renameShoppingList: (listId: string, name: string) => void;
  deleteShoppingList: (listId: string) => void;
  addShoppingItem: (listId: string, name: string, price?: number) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;

  setMonthlyIncome: (monthKey: string, income: number) => void;
  addFixedExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  addExpense: (monthKey: string, input: { name: string; amount: number; category?: string }) => void;
  deleteExpense: (monthKey: string, expenseId: string, section: 'fixed' | 'extra') => void;

  addMediaItem: (input: { type: MediaType; title: string; genre?: string; notes?: string }) => void;
  toggleMediaItem: (itemId: string) => void;
  deleteMediaItem: (itemId: string) => void;

  addNoteFolder: (name: string) => void;
  renameNoteFolder: (folderId: string, name: string) => void;
  deleteNoteFolder: (folderId: string) => void;
  addNote: (folderId: string, input: { title: string; content?: string }) => void;
  updateNote: (folderId: string, noteId: string, patch: { title?: string; content?: string }) => void;
  deleteNote: (folderId: string, noteId: string) => void;
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
  mode: 'light',
  colors: {
    // Pastel minimal default theme
    primaryColor: '#ffffff',
    secondaryColor: '#7e73aa',
    backgroundColor: '#f7f4fb',
    cardColor: '#efeaf8'
  },
  fontFamily: 'system'
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
    mon: [{ id: uid(), title: 'Bench Press', sets: 3, reps: 12, completed: false }],
    tue: [{ id: uid(), title: '30 min cardio', durationMin: 30, completed: false }],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
  }
});

const createSampleNotes = (): NoteFolder[] => [
  {
    id: uid(),
    name: 'General',
    notes: [
      {
        id: uid(),
        title: 'Weekly focus',
        content: 'Main priority: consistency over intensity.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
];

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
    name: 'Grocery List',
    items: [{ id: uid(), name: 'Eggs', purchased: false }]
  },
  {
    id: uid(),
    name: 'Wish List',
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
        fixedExpenses: [],
        extraExpenses: []
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
      recurrenceRules: {},
      habitOverrides: {},
      dailyGoal: 20,
      lockPastWeeks: false
    },
    books: {
      entries: createSampleBooks()
    },
    sports: {
      programs: [createSampleSportsProgram()],
      completions: {}
    },
    shoppingLists: {
      lists: createSampleWishLists()
    },
    budget: createDefaultBudget(),
    mediaList: {
      items: createSampleMedia()
    },
    notes: {
      folders: createSampleNotes()
    },
    userProfile: defaultUserProfile,
    themeSettings: defaultThemeSettings
  };
};

const createBlankCloudState = (): CloudAppState => {
  const currentWeekId = getCurrentWeekId();
  const week = createEmptyWeek(currentWeekId);

  return {
    weeklyPlanner: {
      currentWeekId,
      currentWeekLabel: week.weekLabel,
      weeks: {
        [currentWeekId]: week
      }
    },
    habits: {
      recurrenceRules: {},
      habitOverrides: {},
      dailyGoal: 20,
      lockPastWeeks: false
    },
    books: {
      entries: []
    },
    sports: {
      programs: [],
      completions: {}
    },
    shoppingLists: {
      lists: []
    },
    budget: createDefaultBudget(),
    mediaList: {
      items: []
    },
    notes: {
      folders: []
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
  updatedAt: habit.updatedAt ?? habit.createdAt
});

const normalizeAgendaItem = (item: PlannerItem): PlannerItem => ({
  ...item,
  updatedAt: item.updatedAt ?? item.createdAt
});

const normalizeWorkoutItem = (item: WorkoutProgram['days'][DayId][number]) => {
  const oldReps = item.reps as unknown;
  let sets = item.sets;
  let reps = typeof oldReps === 'number' ? oldReps : undefined;

  if ((sets === undefined || reps === undefined) && typeof oldReps === 'string') {
    const match = oldReps.match(/(\d+)\s*x\s*(\d+)/i);
    if (match) {
      sets = Number(match[1]);
      reps = Number(match[2]);
    }
  }

  const hasSetRep = Number(sets) > 0 && Number(reps) > 0;

  return {
    ...item,
    completed: Boolean(item.completed),
    sets: hasSetRep ? clampNumber(Number(sets)) : undefined,
    reps: hasSetRep ? clampNumber(Number(reps)) : undefined,
    durationMin: hasSetRep ? undefined : item.durationMin ? clampNumber(item.durationMin) : undefined
  };
};

const normalizeWorkoutPrograms = (programs: WorkoutProgram[]): WorkoutProgram[] => {
  return programs.map((program) => ({
    ...program,
    description: program.description ?? '',
    days: DAY_ORDER.reduce((acc, day) => {
      acc[day] = (program.days?.[day] ?? []).map(normalizeWorkoutItem);
      return acc;
    }, {} as WorkoutProgram['days'])
  }));
};

const getWorkoutCompletionKey = (weekId: string, programId: string, day: DayId, itemId: string): string =>
  `${weekId}:${programId}:${day}:${itemId}`;

const buildLegacyWorkoutCompletions = (
  weekId: string,
  programs: WorkoutProgram[]
): Record<string, boolean> => {
  const completions: Record<string, boolean> = {};

  programs.forEach((program) => {
    DAY_ORDER.forEach((day) => {
      program.days[day].forEach((item) => {
        if (item.completed) {
          completions[getWorkoutCompletionKey(weekId, program.id, day, item.id)] = true;
        }
      });
    });
  });

  return completions;
};

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

const getOverrideKey = (weekId: string, day: DayId, recurringId: string): string =>
  `${weekId}:${day}:${recurringId}`;

const shouldRecurringAppear = (
  recurring: RecurringHabitTemplate,
  weekId: string,
  day: DayId
): boolean => {
  if (day !== recurring.weekday) {
    return false;
  }

  const weekDistance = getWeekDistance(recurring.startsWeekId, weekId);
  if (weekDistance < 0) {
    return false;
  }

  if (recurring.recurrence.mode === 'forever') {
    return true;
  }

  return weekDistance < recurring.recurrence.weeks;
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
  recurrenceRules: Record<string, RecurringHabitTemplate>,
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
      (habit) => !habit.recurringId || !recurrenceRules[habit.recurringId]
    );

    const generatedHabits: HabitItem[] = [];

    Object.values(recurrenceRules).forEach((recurring) => {
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
  const generated = applyRecurringToWeek(base, habitsSlice.recurrenceRules, habitsSlice.habitOverrides);

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
      nextWeeks[weekId] = applyRecurringToWeek(week, habitsSlice.recurrenceRules, habitsSlice.habitOverrides);
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
  fixedExpenses: [],
  extraExpenses: []
});

const normalizeBudgetMonths = (months: Record<string, BudgetMonth>): Record<string, BudgetMonth> => {
  return Object.fromEntries(
    Object.entries(months).map(([monthKey, month]) => {
      const legacyMonth = month as unknown as BudgetMonth & { expenses?: ExpenseItem[] };
      return [
        monthKey,
        {
          monthKey: month.monthKey ?? monthKey,
          income: clampNumber(month.income ?? 0),
          fixedExpenses: month.fixedExpenses ?? [],
          extraExpenses: month.extraExpenses ?? legacyMonth.expenses ?? []
        }
      ];
    })
  );
};

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
    (payload as unknown as {
      recurrenceRules?: Record<string, RecurringHabitTemplate>;
      recurringHabits?: Record<string, RecurringHabitTemplate>;
      habitOverrides?: Record<string, HabitOverride>;
      dailyGoal?: number;
      lockPastWeeks?: boolean;
    });

  const habits: HabitsSlice = {
    recurrenceRules:
      habitsRaw.recurrenceRules ??
      (habitsRaw as { recurringHabits?: Record<string, RecurringHabitTemplate> }).recurringHabits ??
      defaults.habits.recurrenceRules,
    habitOverrides: habitsRaw.habitOverrides ?? defaults.habits.habitOverrides,
    dailyGoal: clampNumber(habitsRaw.dailyGoal ?? defaults.habits.dailyGoal),
    lockPastWeeks: habitsRaw.lockPastWeeks ?? defaults.habits.lockPastWeeks
  };

  const normalizedWeeks = Object.fromEntries(
    Object.entries(weeksRaw).map(([weekId, week]) => [
      weekId,
      applyRecurringToWeek(normalizeWeek(week, weekId), habits.recurrenceRules, habits.habitOverrides)
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
    fontFamily?: FontFamilyOption;
    settings?: {
      themeSettings?: { mode?: ThemeMode };
      colorSettings?: {
        primaryColor?: string;
        accentColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        cardColor?: string;
      };
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
        defaults.themeSettings.colors.backgroundColor,
      cardColor:
        incomingTheme?.colors?.cardColor ??
        legacyThemePayload.themeColors?.cardColor ??
        legacyThemePayload.settings?.colorSettings?.cardColor ??
        defaults.themeSettings.colors.cardColor
    },
    fontFamily: incomingTheme?.fontFamily ?? legacyThemePayload.fontFamily ?? defaults.themeSettings.fontFamily
  };

  const budgetRaw = payload.budget ?? defaults.budget;
  const currentMonthKey = budgetRaw.currentMonthKey ?? getCurrentMonthKey();
  const budget = ensureBudgetMonth(
    {
      currentMonthKey,
      months: normalizeBudgetMonths(budgetRaw.months ?? defaults.budget.months)
    },
    currentMonthKey
  );

  return {
    weeklyPlanner,
    habits,
    // Workout progress is now week-based. Legacy completed flags are migrated into current selected week.
    // This keeps old user data visible while enabling per-week reset behavior.
    books: {
      entries: payload.books?.entries ?? defaults.books.entries
    },
    sports: (() => {
      const programs = normalizeWorkoutPrograms(payload.sports?.programs ?? defaults.sports.programs);
      const legacy = buildLegacyWorkoutCompletions(currentWeekId, programs);
      return {
        programs,
        completions: payload.sports?.completions ?? legacy
      };
    })(),
    shoppingLists: {
      lists:
        payload.shoppingLists?.lists ??
        (payload as unknown as { wishLists?: { lists?: WishList[] } }).wishLists?.lists ??
        defaults.shoppingLists.lists
    },
    budget,
    mediaList: {
      items: payload.mediaList?.items ?? defaults.mediaList.items
    },
    notes: (() => {
      const legacyNotes = payload.notes as unknown as { items?: NoteItem[]; folders?: NoteFolder[] } | undefined;
      if (legacyNotes?.folders && legacyNotes.folders.length > 0) {
        return { folders: legacyNotes.folders };
      }
      if (legacyNotes?.items && legacyNotes.items.length > 0) {
        return {
          folders: [
            {
              id: uid(),
              name: 'General',
              notes: legacyNotes.items
            }
          ]
        };
      }
      return { folders: defaults.notes.folders };
    })(),
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
        shoppingLists: get().shoppingLists,
        budget: get().budget,
        mediaList: get().mediaList,
        notes: get().notes,
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
          const week = applyRecurringToWeek(base, state.habits.recurrenceRules, state.habits.habitOverrides);

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
            targetDurationMin: clampNumber(input.targetDurationMin ?? 0) || undefined,
            completedDurationMin: 0,
            createdAt: now,
            updatedAt: now
          });

          if (input.recurrence.mode !== 'this_week') {
            const recurringId = uid();
            const recurring: RecurringHabitTemplate = {
              id: recurringId,
              title: habit.title,
              description: habit.description,
              points: habit.points,
              priority: habit.priority,
              targetDurationMin: habit.targetDurationMin,
              createdAt: now,
              startsWeekId: weekId,
              weekday: day,
              recurrence:
                input.recurrence.mode === 'weeks'
                  ? { mode: 'weeks', weeks: Math.max(1, input.recurrence.weeks) }
                  : { mode: 'forever' }
            };

            const habits: HabitsSlice = {
              ...state.habits,
              recurrenceRules: {
                ...state.habits.recurrenceRules,
                [recurringId]: recurring
              }
            };

            const weeklyPlanner = applyRecurringToFutureKnownWeeks(state.weeklyPlanner, habits, weekId);
            return {
              habits,
              weeklyPlanner: ensureWeekExists(weeklyPlanner, habits, weekId)
            };
          }

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
            weeklyPlanner
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
          let completedAt = existing.completedAt;
          let completionLog = [...existing.completionLog];

          if (patch.completed !== undefined && patch.completed !== existing.completed) {
            if (patch.completed) {
              completedAt = now;
              completionLog = [...completionLog, now];
            } else {
              completedAt = undefined;
            }
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
      setFontFamily: (value) =>
        set((state) => ({
          themeSettings: {
            ...state.themeSettings,
            fontFamily: value
          }
        })),
      setDailyGoal: (value) =>
        set((state) => ({
          habits: {
            ...state.habits,
            dailyGoal: clampNumber(value)
          }
        })),
      setLockPastWeeks: (enabled) =>
        set((state) => ({
          habits: {
            ...state.habits,
            lockPastWeeks: enabled
          }
        })),
      resetAppData: () =>
        set((state) => {
          const defaults = createBlankCloudState();
          return {
            ...defaults,
            userAuth: state.userAuth,
            cloudRowId: state.cloudRowId,
            userProfile: state.userProfile
          };
        }),
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
      updateBook: (bookId, patch) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: state.books.entries.map((book) =>
              book.id === bookId
                ? {
                    ...book,
                    title: patch.title === undefined ? book.title : patch.title.trim() || book.title,
                    author: patch.author === undefined ? book.author : patch.author.trim() || book.author,
                    startDate: patch.startDate ?? book.startDate,
                    targetFinishDate: patch.targetFinishDate ?? book.targetFinishDate,
                    dailyPageGoal:
                      patch.dailyPageGoal === undefined ? book.dailyPageGoal : clampNumber(patch.dailyPageGoal),
                    totalPages: patch.totalPages === undefined ? book.totalPages : clampNumber(patch.totalPages),
                    notes: patch.notes === undefined ? book.notes : patch.notes.trim(),
                    updatedAt: new Date().toISOString()
                  }
                : book
            )
          }
        })),
      deleteBook: (bookId) =>
        set((state) => ({
          books: {
            ...state.books,
            entries: state.books.entries.filter((book) => book.id !== bookId)
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
                description: '',
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
      updateWorkoutProgram: (programId, patch) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: state.sports.programs.map((program) =>
              program.id === programId
                ? {
                    ...program,
                    name: patch.name === undefined ? program.name : patch.name.trim() || program.name,
                    description:
                      patch.description === undefined ? program.description : patch.description.trim()
                  }
                : program
            )
          }
        })),
      deleteWorkoutProgram: (programId) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: state.sports.programs.filter((program) => program.id !== programId),
            completions: Object.fromEntries(
              Object.entries(state.sports.completions).filter(([key]) => {
                const [, pId] = key.split(':');
                return pId !== programId;
              })
            )
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
                        (() => {
                          const hasSetRep = Number(input.sets) > 0 && Number(input.reps) > 0;
                          return {
                            id: uid(),
                            title: input.title.trim(),
                            sets: hasSetRep ? clampNumber(Number(input.sets)) : undefined,
                            reps: hasSetRep ? clampNumber(Number(input.reps)) : undefined,
                            durationMin: hasSetRep
                              ? undefined
                              : input.durationMin
                                ? clampNumber(input.durationMin)
                                : undefined,
                            completed: false
                          };
                        })()
                      ]
                    }
                  }
                : program
            )
          }
        })),
      toggleWorkoutItem: (programId, day, itemId) =>
        set((state) => {
          const weekId = state.weeklyPlanner.currentWeekId;
          const key = getWorkoutCompletionKey(weekId, programId, day, itemId);
          const isCompleted = Boolean(state.sports.completions[key]);

          return {
            sports: {
              ...state.sports,
              completions: {
                ...state.sports.completions,
                [key]: !isCompleted
              }
            }
          };
        }),
      updateWorkoutItem: (programId, day, itemId, patch) =>
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
                        item.id === itemId
                          ? (() => {
                              const nextTitle = patch.title?.trim() || item.title;
                              const nextSets =
                                patch.sets === undefined ? item.sets : clampNumber(Number(patch.sets));
                              const nextReps =
                                patch.reps === undefined ? item.reps : clampNumber(Number(patch.reps));
                              const hasSetRep = Number(nextSets) > 0 && Number(nextReps) > 0;
                              return {
                                ...item,
                                title: nextTitle,
                                sets: hasSetRep ? nextSets : undefined,
                                reps: hasSetRep ? nextReps : undefined,
                                durationMin: hasSetRep
                                  ? undefined
                                  : patch.durationMin === undefined
                                    ? item.durationMin
                                    : patch.durationMin
                                      ? clampNumber(patch.durationMin)
                                      : undefined
                              };
                            })()
                          : item
                      )
                    }
                  }
                : program
            )
          }
        })),
      deleteWorkoutItem: (programId, day, itemId) =>
        set((state) => ({
          sports: {
            ...state.sports,
            programs: state.sports.programs.map((program) =>
              program.id === programId
                ? {
                    ...program,
                    days: {
                      ...program.days,
                      [day]: program.days[day].filter((item) => item.id !== itemId)
                    }
                  }
                : program
            ),
            completions: Object.fromEntries(
              Object.entries(state.sports.completions).filter(([key]) => {
                const [, pId, d, iId] = key.split(':');
                return !(pId === programId && d === day && iId === itemId);
              })
            )
          }
        })),
      clearWorkoutDay: (programId, day) =>
        set((state) => {
          const weekId = state.weeklyPlanner.currentWeekId;
          return {
            sports: {
              ...state.sports,
              programs: state.sports.programs.map((program) =>
                program.id === programId
                  ? {
                      ...program,
                      days: {
                        ...program.days,
                        [day]: []
                      }
                    }
                  : program
              ),
              completions: Object.fromEntries(
                Object.entries(state.sports.completions).filter(([key]) => {
                  const [wId, pId, d] = key.split(':');
                  return !(wId === weekId && pId === programId && d === day);
                })
              )
            }
          };
        }),

      addShoppingList: (name) =>
        set((state) => ({
          shoppingLists: {
            ...state.shoppingLists,
            lists: [...state.shoppingLists.lists, { id: uid(), name: name.trim(), items: [] }]
          }
        })),
      renameShoppingList: (listId, name) =>
        set((state) => ({
          shoppingLists: {
            ...state.shoppingLists,
            lists: state.shoppingLists.lists.map((list) =>
              list.id === listId ? { ...list, name: name.trim() || list.name } : list
            )
          }
        })),
      deleteShoppingList: (listId) =>
        set((state) => ({
          shoppingLists: {
            ...state.shoppingLists,
            lists: state.shoppingLists.lists.filter((list) => list.id !== listId)
          }
        })),
      addShoppingItem: (listId, name, price) =>
        set((state) => ({
          shoppingLists: {
            ...state.shoppingLists,
            lists: state.shoppingLists.lists.map((list) =>
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
      toggleShoppingItem: (listId, itemId) =>
        set((state) => ({
          shoppingLists: {
            ...state.shoppingLists,
            lists: state.shoppingLists.lists.map((list) =>
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
      addFixedExpense: (monthKey, input) =>
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
                  fixedExpenses: [expense, ...budget.months[monthKey].fixedExpenses]
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
                  extraExpenses: [expense, ...budget.months[monthKey].extraExpenses]
                }
              }
            }
          };
        }),
      deleteExpense: (monthKey, expenseId, section) =>
        set((state) => {
          const budget = ensureBudgetMonth(state.budget, monthKey);
          return {
            budget: {
              ...budget,
              months: {
                ...budget.months,
                [monthKey]: {
                  ...budget.months[monthKey],
                  fixedExpenses:
                    section === 'fixed'
                      ? budget.months[monthKey].fixedExpenses.filter((expense) => expense.id !== expenseId)
                      : budget.months[monthKey].fixedExpenses,
                  extraExpenses:
                    section === 'extra'
                      ? budget.months[monthKey].extraExpenses.filter((expense) => expense.id !== expenseId)
                      : budget.months[monthKey].extraExpenses
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
        })),
      addNoteFolder: (name) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: [
              ...state.notes.folders,
              {
                id: uid(),
                name: name.trim(),
                notes: []
              }
            ]
          }
        })),
      renameNoteFolder: (folderId, name) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: state.notes.folders.map((folder) =>
              folder.id === folderId ? { ...folder, name: name.trim() || folder.name } : folder
            )
          }
        })),
      deleteNoteFolder: (folderId) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: state.notes.folders.filter((folder) => folder.id !== folderId)
          }
        })),
      addNote: (folderId, input) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: state.notes.folders.map((folder) =>
              folder.id === folderId
                ? {
                    ...folder,
                    notes: [
                      {
                        id: uid(),
                        title: input.title.trim(),
                        content: input.content?.trim() ?? '',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      },
                      ...folder.notes
                    ]
                  }
                : folder
            )
          }
        })),
      updateNote: (folderId, noteId, patch) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: state.notes.folders.map((folder) =>
              folder.id === folderId
                ? {
                    ...folder,
                    notes: folder.notes.map((note) =>
                      note.id === noteId
                        ? {
                            ...note,
                            title: patch.title === undefined ? note.title : patch.title.trim() || note.title,
                            content: patch.content === undefined ? note.content : patch.content.trim(),
                            updatedAt: new Date().toISOString()
                          }
                        : note
                    )
                  }
                : folder
            )
          }
        })),
      deleteNote: (folderId, noteId) =>
        set((state) => ({
          notes: {
            ...state.notes,
            folders: state.notes.folders.map((folder) =>
              folder.id === folderId
                ? {
                    ...folder,
                    notes: folder.notes.filter((note) => note.id !== noteId)
                  }
                : folder
            )
          }
        }))
    }),
    {
      name: 'habit-weekly-planner-store',
      version: 6,
      partialize: (state) => ({
        weeklyPlanner: state.weeklyPlanner,
        habits: state.habits,
        books: state.books,
        sports: state.sports,
        shoppingLists: state.shoppingLists,
        budget: state.budget,
        mediaList: state.mediaList,
        notes: state.notes,
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
