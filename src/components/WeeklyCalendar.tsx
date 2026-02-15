type WeeklyCalendarProps = {
  currentWeekId: string;
  onWeekPick: (weekId: string) => void;
};

const WeeklyCalendar = ({ currentWeekId, onWeekPick }: WeeklyCalendarProps) => {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <span>Jump</span>
      <input
        type="week"
        value={currentWeekId}
        onChange={(event) => onWeekPick(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
      />
    </label>
  );
};

export default WeeklyCalendar;
