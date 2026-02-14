import { DAY_ORDER, type DayId, type DayPlan, type WeeklyPlan } from '../types/habit';
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

const createDay = (day: DayId): DayPlan => ({
  day,
  label: labels[day],
  tasks: []
});

export const createEmptyWeek = (weekId: string): WeeklyPlan => ({
  id: uid(),
  weekId,
  weekLabel: getWeekLabelFromId(weekId),
  createdAt: new Date().toISOString(),
  days: DAY_ORDER.reduce((acc, day) => {
    acc[day] = createDay(day);
    return acc;
  }, {} as Record<DayId, DayPlan>)
});

export const createMockWeek = (weekId = getCurrentWeekId()): WeeklyPlan => {
  const week = createEmptyWeek(weekId);

  week.days.mon.tasks = [
    {
      id: uid(),
      title: 'Morning workout',
      description: '30 min full-body routine',
      points: 8,
      completed: true,
      priority: 'important',
      createdAt: new Date().toISOString()
    },
    {
      id: uid(),
      title: 'Plan top 3 goals',
      description: 'Define focus for the week',
      points: 5,
      completed: false,
      priority: 'normal',
      createdAt: new Date().toISOString()
    }
  ];

  week.days.wed.tasks = [
    {
      id: uid(),
      title: 'Deep work session',
      description: 'Two hours with no notifications',
      points: 12,
      completed: false,
      priority: 'important',
      createdAt: new Date().toISOString()
    }
  ];

  week.days.fri.tasks = [
    {
      id: uid(),
      title: 'Weekly review',
      description: 'Reflect and prep next week',
      points: 10,
      completed: false,
      priority: 'normal',
      createdAt: new Date().toISOString()
    }
  ];

  return week;
};
