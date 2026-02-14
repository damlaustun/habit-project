import WeeklyCalendar from './WeeklyCalendar';

type WeekNavigatorProps = {
  weekId: string;
  weekLabel: string;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPickWeek: (weekId: string) => void;
};

const WeekNavigator = ({
  weekId,
  weekLabel,
  isCurrentWeek,
  onPrevious,
  onNext,
  onPickWeek
}: WeekNavigatorProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-surface-darkCard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Previous week
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Next week
          </button>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{weekId}</span>
          <span className="mx-2">•</span>
          <span>{weekLabel}</span>
          {isCurrentWeek ? (
            <span className="ml-2 rounded-full bg-[var(--accent-color)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--primary-color)]">
              Current
            </span>
          ) : null}
        </div>

        <WeeklyCalendar currentWeekId={weekId} onWeekPick={onPickWeek} />
      </div>
    </section>
  );
};

export default WeekNavigator;
