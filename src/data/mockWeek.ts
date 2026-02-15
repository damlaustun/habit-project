import {
  DAY_ORDER,
  type DayContainerData,
  type DayId,
  type HabitItem,
  type HabitPriority,
  type PlannerItem,
  type WeeklyPlan
} from '../types/habit';
import { getCurrentWeekId, getWeekLabelFromId, uid } from '../utils/date';

const labels: Record<DayId, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday'
};

const nowIso = (): string => new Date().toISOString();

const createHabit = (input: {
  title: string;
  points: number;
  priority?: HabitPriority;
  description?: string;
  completed?: boolean;
  targetDurationMin?: number;
  completedDurationMin?: number;
}): HabitItem => ({
  id: uid(),
  title: input.title,
  description: input.description,
  points: input.points,
  completed: input.completed ?? false,
  completedAt: input.completed ? nowIso() : undefined,
  completionLog: input.completed ? [nowIso()] : [],
  priority: input.priority ?? 'normal',
  recurringId: undefined,
  isRecurringInstance: false,
  targetDurationMin: input.targetDurationMin,
  completedDurationMin: input.completedDurationMin ?? 0,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const createAgenda = (input: { title: string; description?: string; eventTime?: string }): PlannerItem => ({
  id: uid(),
  title: input.title,
  description: input.description,
  eventTime: input.eventTime,
  completed: false,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const createDay = (day: DayId): DayContainerData => ({
  day,
  label: labels[day],
  habits: [],
  agenda: []
});

export const createEmptyWeek = (weekId: string): WeeklyPlan => ({
  id: uid(),
  weekId,
  weekLabel: getWeekLabelFromId(weekId),
  createdAt: nowIso(),
  updatedAt: nowIso(),
  days: DAY_ORDER.reduce((acc, day) => {
    acc[day] = createDay(day);
    return acc;
  }, {} as Record<DayId, DayContainerData>)
});

export const createMockWeek = (weekId = getCurrentWeekId()): WeeklyPlan => {
  const week = createEmptyWeek(weekId);

  week.days.mon.habits = [
    createHabit({
      title: 'Morning workout',
      description: '30 min full-body routine',
      points: 8,
      priority: 'important',
      completed: true,
      targetDurationMin: 30,
      completedDurationMin: 30
    }),
    createHabit({
      title: 'Read 20 pages',
      points: 5,
      targetDurationMin: 25,
      completedDurationMin: 10
    })
  ];

  week.days.mon.agenda = [
    createAgenda({ title: 'Team standup', eventTime: '09:30' }),
    createAgenda({ title: 'Doctor appointment', eventTime: '16:00' })
  ];

  week.days.wed.habits = [
    createHabit({
      title: 'Deep work session',
      description: 'No notifications for 2 hours',
      points: 12,
      priority: 'important',
      targetDurationMin: 120,
      completedDurationMin: 0
    })
  ];

  week.days.fri.agenda = [
    createAgenda({ title: 'Weekly review', eventTime: '17:00' })
  ];

  return week;
};
