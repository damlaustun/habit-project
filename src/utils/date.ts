import type { DayId } from '../types/habit';

export const uid = (): string => {
  const partA = Math.random().toString(36).slice(2, 8);
  const partB = Date.now().toString(36).slice(-6);
  return `${partB}-${partA}`;
};

const toStartOfDay = (date: Date): Date => {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const getISOWeekData = (date: Date): { year: number; week: number } => {
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = (new Date(utcDate).getUTCDay() + 6) % 7; // 0=Mon ... 6=Sun
  const thursday = utcDate + (3 - weekday) * DAY_MS;

  const isoYear = new Date(thursday).getUTCFullYear();
  const jan4 = Date.UTC(isoYear, 0, 4);
  const jan4Weekday = (new Date(jan4).getUTCDay() + 6) % 7;
  const firstThursday = jan4 + (3 - jan4Weekday) * DAY_MS;

  const week = 1 + Math.round((thursday - firstThursday) / WEEK_MS);
  return { year: isoYear, week };
};

export const getWeekIdFromDate = (date: Date): string => {
  const { year, week } = getISOWeekData(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export const getCurrentWeekId = (): string => getWeekIdFromDate(new Date());

const parseWeekId = (weekId: string): { year: number; week: number } => {
  const match = weekId.match(/^(\d{4})-?W(\d{1,2})$/i);
  if (!match) {
    const current = getISOWeekData(new Date());
    return current;
  }

  const year = Number(match[1]);
  const week = Number(match[2]);

  if (!Number.isFinite(year) || !Number.isFinite(week) || week <= 0) {
    const current = getISOWeekData(new Date());
    return current;
  }

  return {
    year,
    week
  };
};

export const getDateFromWeekId = (weekId: string): Date => {
  const { year, week } = parseWeekId(weekId);
  const jan4 = Date.UTC(year, 0, 4);
  const jan4Weekday = (new Date(jan4).getUTCDay() + 6) % 7;
  const firstMonday = jan4 - jan4Weekday * DAY_MS;
  const mondayUtc = firstMonday + (week - 1) * WEEK_MS;
  const mondayDate = new Date(mondayUtc);

  return toStartOfDay(new Date(mondayDate.getUTCFullYear(), mondayDate.getUTCMonth(), mondayDate.getUTCDate()));
};

export const getWeekRangeFromId = (weekId: string): { monday: Date; sunday: Date } => {
  const monday = getDateFromWeekId(weekId);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};

export const getWeekLabelFromId = (weekId: string): string => {
  const { monday, sunday } = getWeekRangeFromId(weekId);
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  return `${formatter.format(monday)} - ${formatter.format(sunday)}`;
};

export const addWeeksToId = (weekId: string, delta: number): string => {
  const monday = getDateFromWeekId(weekId);
  monday.setDate(monday.getDate() + delta * 7);
  return getWeekIdFromDate(monday);
};

export const getWeekDistance = (fromWeekId: string, toWeekId: string): number => {
  const from = getDateFromWeekId(fromWeekId);
  const to = getDateFromWeekId(toWeekId);
  return Math.round((to.getTime() - from.getTime()) / 604800000);
};

export const compareWeekIds = (a: string, b: string): number => {
  const aw = parseWeekId(a);
  const bw = parseWeekId(b);

  if (aw.year !== bw.year) {
    return aw.year - bw.year;
  }

  return aw.week - bw.week;
};

export const getTodayDayId = (): DayId => {
  const day = new Date().getDay();
  const map: Record<number, DayId> = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
  };
  return map[day];
};

export const dayIdToIndex = (dayId: DayId): number => {
  const map: Record<DayId, number> = {
    mon: 0,
    tue: 1,
    wed: 2,
    thu: 3,
    fri: 4,
    sat: 5,
    sun: 6
  };

  return map[dayId];
};

export const getDateForWeekDay = (weekId: string, dayId: DayId): Date => {
  const monday = getDateFromWeekId(weekId);
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayIdToIndex(dayId));
  return date;
};

export const formatMonthDay = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
