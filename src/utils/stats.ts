import type { DayId, WeeklyPlan } from '../types/habit';

export const getTotalCompletedPoints = (plan: WeeklyPlan): number => {
  return Object.values(plan.days)
    .flatMap((day) => day.tasks)
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);
};

export const getCompletedPointsForDay = (plan: WeeklyPlan, day: DayId): number => {
  return plan.days[day].tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);
};

export const getTaskCounts = (plan: WeeklyPlan) => {
  const allTasks = Object.values(plan.days).flatMap((day) => day.tasks);
  const completed = allTasks.filter((task) => task.completed).length;

  return {
    completed,
    total: allTasks.length,
    percent: allTasks.length === 0 ? 0 : Math.round((completed / allTasks.length) * 100)
  };
};

export const toProgressPercent = (value: number, goal: number): number => {
  if (goal <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((value / goal) * 100));
};
