import type { BookEntry, BudgetMonth, DayId, HabitItem, WeeklyPlan, WorkoutProgram } from '../types/habit';

export const getAllHabits = (plan: WeeklyPlan): HabitItem[] => {
  return Object.values(plan.days).flatMap((day) => day.habits);
};

export const getTotalCompletedPoints = (plan: WeeklyPlan): number => {
  return getAllHabits(plan)
    .filter((habit) => habit.completed)
    .reduce((sum, habit) => sum + habit.points, 0);
};

export const getCompletedPointsForDay = (plan: WeeklyPlan, day: DayId): number => {
  return plan.days[day].habits
    .filter((habit) => habit.completed)
    .reduce((sum, habit) => sum + habit.points, 0);
};

export const getTaskCounts = (plan: WeeklyPlan) => {
  const allHabits = getAllHabits(plan);
  const completed = allHabits.filter((habit) => habit.completed).length;

  return {
    completed,
    total: allHabits.length,
    percent: allHabits.length === 0 ? 0 : Math.round((completed / allHabits.length) * 100)
  };
};

export const toProgressPercent = (value: number, goal: number): number => {
  if (goal <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / goal) * 100));
};

export const getBookPagesRead = (book: BookEntry): number => {
  return Object.values(book.pagesLog).reduce((sum, pages) => sum + pages, 0);
};

export const getBookProgress = (book: BookEntry) => {
  const pagesRead = getBookPagesRead(book);
  const total = Math.max(1, book.totalPages);
  const percent = Math.min(100, Math.round((pagesRead / total) * 100));
  const remaining = Math.max(0, total - pagesRead);

  const start = new Date(book.startDate);
  const targetFinish = new Date(book.targetFinishDate);
  const now = new Date();

  const elapsedDays = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / 86400000));
  const totalPlanDays = Math.max(1, Math.ceil((targetFinish.getTime() - start.getTime()) / 86400000));
  const expectedByTimeline = Math.round((Math.min(elapsedDays, totalPlanDays) / totalPlanDays) * total);
  const expectedByDailyGoal = elapsedDays * Math.max(0, book.dailyPageGoal);
  const expectedPages = Math.min(total, Math.max(expectedByTimeline, expectedByDailyGoal));
  const onTrack = pagesRead >= expectedPages;

  return { percent, remaining, onTrack, pagesRead };
};

export const getWorkoutProgress = (program: WorkoutProgram) => {
  const all = Object.values(program.days).flatMap((items) => items);
  const completed = all.filter((item) => item.completed).length;
  const total = all.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
};

export const getBudgetSummary = (month: BudgetMonth) => {
  const totalFixedExpenses = month.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExtraExpenses = month.extraExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = totalFixedExpenses + totalExtraExpenses;
  const remaining = month.income - totalExpenses;
  const savings = Math.max(0, remaining);

  return {
    income: month.income,
    totalFixedExpenses,
    totalExtraExpenses,
    totalExpenses,
    remaining,
    savings
  };
};

export const getWeekCompletionStats = (plan: WeeklyPlan) => {
  const habits = Object.values(plan.days).flatMap((day) => day.habits);
  const agenda = Object.values(plan.days).flatMap((day) => day.agenda);
  const total = habits.length + agenda.length;
  const completed = habits.filter((item) => item.completed).length + agenda.filter((item) => item.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
};

export const isWeekFullyCompleted = (plan: WeeklyPlan): boolean => {
  const stats = getWeekCompletionStats(plan);
  const total = stats.total;
  if (total === 0) {
    return false;
  }

  return stats.completed === stats.total;
};
