export const uid = (): string => {
  const partA = Math.random().toString(36).slice(2, 8);
  const partB = Date.now().toString(36).slice(-6);
  return `${partB}-${partA}`;
};

const getISOWeekData = (date: Date): { year: number; week: number } => {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));

  const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
  return { year: target.getFullYear(), week };
};

export const getWeekIdFromDate = (date: Date): string => {
  const { year, week } = getISOWeekData(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export const getCurrentWeekId = (): string => getWeekIdFromDate(new Date());

const parseWeekId = (weekId: string): { year: number; week: number } => {
  const [yearPart, weekPartRaw] = weekId.split('-W');
  return {
    year: Number(yearPart),
    week: Number(weekPartRaw)
  };
};

const getDateFromWeekId = (weekId: string): Date => {
  const { year, week } = parseWeekId(weekId);

  const simple = new Date(year, 0, 4 + (week - 1) * 7);
  const dow = simple.getDay() || 7;
  if (dow <= 4) {
    simple.setDate(simple.getDate() - dow + 1);
  } else {
    simple.setDate(simple.getDate() + 8 - dow);
  }

  simple.setHours(0, 0, 0, 0);
  return simple;
};

export const getWeekLabelFromId = (weekId: string): string => {
  const monday = getDateFromWeekId(weekId);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  return `${formatter.format(monday)} - ${formatter.format(sunday)}`;
};

export const addWeeksToId = (weekId: string, delta: number): string => {
  const monday = getDateFromWeekId(weekId);
  monday.setDate(monday.getDate() + delta * 7);
  return getWeekIdFromDate(monday);
};

export const compareWeekIds = (a: string, b: string): number => {
  const aw = parseWeekId(a);
  const bw = parseWeekId(b);
  if (aw.year !== bw.year) {
    return aw.year - bw.year;
  }
  return aw.week - bw.week;
};

export const getTodayDayId = (): import('../types/habit').DayId => {
  const day = new Date().getDay();
  const map: Record<number, import('../types/habit').DayId> = {
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
