import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { createEmptyWeek, createMockWeek } from '../data/mockWeek';
import type { AppSettings, ColorSettings, DayId, Task, TaskInput, ThemeMode, WeeklyPlan } from '../types/habit';
import { addWeeksToId, compareWeekIds, getCurrentWeekId, getWeekLabelFromId, uid } from '../utils/date';

type DragTarget = {
  day: DayId;
  id: string;
};

type HabitState = {
  currentWeekId: string;
  weeks: Record<string, WeeklyPlan>;
  settings: AppSettings;
  getCurrentPlan: () => WeeklyPlan;
  setCurrentWeek: (weekId: string) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  resetCurrentWeek: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setColorSetting: <K extends keyof ColorSettings>(key: K, value: ColorSettings[K]) => void;
  setDailyGoal: (value: number) => void;
  setWeeklyGoal: (value: number) => void;
  setLockPastWeeks: (enabled: boolean) => void;
  addTask: (day: DayId, input: TaskInput) => void;
  updateTask: (
    day: DayId,
    taskId: string,
    patch: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => void;
  deleteTask: (day: DayId, taskId: string) => void;
  toggleTask: (day: DayId, taskId: string) => void;
  reorderTask: (from: DragTarget, to: DragTarget) => void;
  moveTaskToDayEnd: (from: DragTarget, toDay: DayId) => void;
};

const defaultSettings: AppSettings = {
  themeSettings: {
    mode: 'system'
  },
  colorSettings: {
    primaryColor: '#0f766e',
    accentColor: '#0ea5a3',
    backgroundColor: '#f6f7f9'
  },
  goals: {
    dailyGoal: 20,
    weeklyGoal: 100
  },
  lockPastWeeks: false
};

const clampPoints = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
};

const clampGoal = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
};

const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'important' ? -1 : 1;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};

const normalizeWeek = (plan: WeeklyPlan, weekId: string): WeeklyPlan => {
  const normalizedDays = Object.fromEntries(
    Object.entries(plan.days).map(([day, dayPlan]) => [
      day,
      {
        ...dayPlan,
        tasks: sortTasks(
          dayPlan.tasks.map((task) => ({
            ...task,
            priority: task.priority ?? 'normal'
          }))
        )
      }
    ])
  ) as WeeklyPlan['days'];

  return {
    ...plan,
    weekId,
    weekLabel: getWeekLabelFromId(weekId),
    days: normalizedDays
  };
};

const ensureWeekExists = (state: HabitState, weekId: string): HabitState['weeks'] => {
  if (state.weeks[weekId]) {
    return state.weeks;
  }

  return {
    ...state.weeks,
    [weekId]: createEmptyWeek(weekId)
  };
};

const updateCurrentWeek = (
  state: HabitState,
  update: (currentPlan: WeeklyPlan) => WeeklyPlan
): Pick<HabitState, 'weeks'> => {
  const weekId = state.currentWeekId;
  const weeks = ensureWeekExists(state, weekId);
  const currentPlan = weeks[weekId];

  return {
    weeks: {
      ...weeks,
      [weekId]: normalizeWeek(update(currentPlan), weekId)
    }
  };
};

const migrateLegacyState = (persisted: unknown): Partial<HabitState> => {
  if (!persisted || typeof persisted !== 'object') {
    const currentWeekId = getCurrentWeekId();
    return {
      currentWeekId,
      weeks: {
        [currentWeekId]: createMockWeek(currentWeekId)
      },
      settings: defaultSettings
    };
  }

  const raw = persisted as Record<string, unknown>;

  if (raw.weeks && raw.currentWeekId && raw.settings) {
    return raw as Partial<HabitState>;
  }

  const currentWeekId = getCurrentWeekId();
  const legacyPlan = raw.plan as WeeklyPlan | undefined;
  const legacyDarkMode = raw.darkMode as boolean | undefined;

  const migratedPlan = legacyPlan
    ? normalizeWeek(
        {
          ...legacyPlan,
          weekId: currentWeekId,
          weekLabel: getWeekLabelFromId(currentWeekId),
          days: Object.fromEntries(
            Object.entries(legacyPlan.days).map(([day, dayPlan]) => [
              day,
              {
                ...dayPlan,
                tasks: dayPlan.tasks.map((task) => ({ ...task, priority: 'normal' as const }))
              }
            ])
          ) as WeeklyPlan['days']
        },
        currentWeekId
      )
    : createMockWeek(currentWeekId);

  return {
    currentWeekId,
    weeks: {
      [currentWeekId]: migratedPlan
    },
    settings: {
      ...defaultSettings,
      themeSettings: {
        mode: legacyDarkMode ? 'dark' : 'light'
      }
    }
  };
};

const initialWeekId = getCurrentWeekId();

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      currentWeekId: initialWeekId,
      weeks: {
        [initialWeekId]: createMockWeek(initialWeekId)
      },
      settings: defaultSettings,
      getCurrentPlan: () => {
        const state = get();
        return state.weeks[state.currentWeekId] ?? createEmptyWeek(state.currentWeekId);
      },
      setCurrentWeek: (weekId) =>
        set((state) => ({
          currentWeekId: weekId,
          weeks: ensureWeekExists(state, weekId)
        })),
      goToPreviousWeek: () =>
        set((state) => {
          const previousWeekId = addWeeksToId(state.currentWeekId, -1);
          return {
            currentWeekId: previousWeekId,
            weeks: ensureWeekExists(state, previousWeekId)
          };
        }),
      goToNextWeek: () =>
        set((state) => {
          const nextWeekId = addWeeksToId(state.currentWeekId, 1);
          return {
            currentWeekId: nextWeekId,
            weeks: ensureWeekExists(state, nextWeekId)
          };
        }),
      resetCurrentWeek: () =>
        set((state) => ({
          weeks: {
            ...state.weeks,
            [state.currentWeekId]: createEmptyWeek(state.currentWeekId)
          }
        })),
      setThemeMode: (mode) =>
        set((state) => ({
          settings: {
            ...state.settings,
            themeSettings: {
              mode
            }
          }
        })),
      setColorSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            colorSettings: {
              ...state.settings.colorSettings,
              [key]: value
            }
          }
        })),
      setDailyGoal: (value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            goals: {
              ...state.settings.goals,
              dailyGoal: clampGoal(value)
            }
          }
        })),
      setWeeklyGoal: (value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            goals: {
              ...state.settings.goals,
              weeklyGoal: clampGoal(value)
            }
          }
        })),
      setLockPastWeeks: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            lockPastWeeks: enabled
          }
        })),
      addTask: (day, input) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => ({
            ...plan,
            days: {
              ...plan.days,
              [day]: {
                ...plan.days[day],
                tasks: sortTasks([
                  ...plan.days[day].tasks,
                  {
                    id: uid(),
                    title: input.title.trim(),
                    description: input.description?.trim(),
                    points: clampPoints(input.points),
                    priority: input.priority,
                    completed: false,
                    createdAt: new Date().toISOString()
                  }
                ])
              }
            }
          }))
        ),
      updateTask: (day, taskId, patch) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => ({
            ...plan,
            days: {
              ...plan.days,
              [day]: {
                ...plan.days[day],
                tasks: sortTasks(
                  plan.days[day].tasks.map((task) =>
                    task.id === taskId
                      ? {
                          ...task,
                          ...patch,
                          title: patch.title === undefined ? task.title : patch.title.trim(),
                          description:
                            patch.description === undefined
                              ? task.description
                              : patch.description.trim(),
                          points: patch.points === undefined ? task.points : clampPoints(patch.points)
                        }
                      : task
                  )
                )
              }
            }
          }))
        ),
      deleteTask: (day, taskId) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => ({
            ...plan,
            days: {
              ...plan.days,
              [day]: {
                ...plan.days[day],
                tasks: plan.days[day].tasks.filter((task) => task.id !== taskId)
              }
            }
          }))
        ),
      toggleTask: (day, taskId) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => ({
            ...plan,
            days: {
              ...plan.days,
              [day]: {
                ...plan.days[day],
                tasks: plan.days[day].tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                )
              }
            }
          }))
        ),
      reorderTask: (from, to) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => {
            if (from.day === to.day) {
              const tasks = plan.days[from.day].tasks;
              const oldIndex = tasks.findIndex((task) => task.id === from.id);
              const newIndex = tasks.findIndex((task) => task.id === to.id);

              if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
                return plan;
              }

              return {
                ...plan,
                days: {
                  ...plan.days,
                  [from.day]: {
                    ...plan.days[from.day],
                    tasks: sortTasks(arrayMove(tasks, oldIndex, newIndex))
                  }
                }
              };
            }

            const sourceTasks = [...plan.days[from.day].tasks];
            const targetTasks = [...plan.days[to.day].tasks];
            const sourceIndex = sourceTasks.findIndex((task) => task.id === from.id);
            const targetIndex = targetTasks.findIndex((task) => task.id === to.id);

            if (sourceIndex < 0 || targetIndex < 0) {
              return plan;
            }

            const [movedTask] = sourceTasks.splice(sourceIndex, 1);
            targetTasks.splice(targetIndex, 0, movedTask);

            return {
              ...plan,
              days: {
                ...plan.days,
                [from.day]: {
                  ...plan.days[from.day],
                  tasks: sortTasks(sourceTasks)
                },
                [to.day]: {
                  ...plan.days[to.day],
                  tasks: sortTasks(targetTasks)
                }
              }
            };
          })
        ),
      moveTaskToDayEnd: (from, toDay) =>
        set((state) =>
          updateCurrentWeek(state, (plan) => {
            const sourceTasks = [...plan.days[from.day].tasks];
            const sourceIndex = sourceTasks.findIndex((task) => task.id === from.id);

            if (sourceIndex < 0) {
              return plan;
            }

            const [movedTask] = sourceTasks.splice(sourceIndex, 1);

            return {
              ...plan,
              days: {
                ...plan.days,
                [from.day]: {
                  ...plan.days[from.day],
                  tasks: sortTasks(sourceTasks)
                },
                [toDay]: {
                  ...plan.days[toDay],
                  tasks: sortTasks([...plan.days[toDay].tasks, movedTask])
                }
              }
            };
          })
        )
    }),
    {
      name: 'habit-weekly-planner-store',
      version: 2,
      partialize: (state) => ({
        currentWeekId: state.currentWeekId,
        weeks: state.weeks,
        settings: state.settings
      }),
      migrate: (persisted) => {
        const migrated = migrateLegacyState(persisted);

        const currentWeekId =
          typeof migrated.currentWeekId === 'string' ? migrated.currentWeekId : getCurrentWeekId();

        const weeksRaw = (migrated.weeks ?? {}) as Record<string, WeeklyPlan>;
        const normalizedWeeks = Object.fromEntries(
          Object.entries(weeksRaw).map(([weekId, plan]) => [weekId, normalizeWeek(plan, weekId)])
        );

        if (!normalizedWeeks[currentWeekId]) {
          normalizedWeeks[currentWeekId] = createEmptyWeek(currentWeekId);
        }

        return {
          currentWeekId,
          weeks: normalizedWeeks,
          settings: {
            ...defaultSettings,
            ...(migrated.settings as AppSettings | undefined)
          }
        } as HabitState;
      }
    }
  )
);

export const isPastWeekComparedToCurrent = (weekId: string): boolean => {
  return compareWeekIds(weekId, getCurrentWeekId()) < 0;
};
