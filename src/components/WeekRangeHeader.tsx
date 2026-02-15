type WeekRangeHeaderProps = {
  weekId: string;
  weekLabel: string;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onWeekPick: (weekId: string) => void;
};

const WeekRangeHeader = ({
  weekId,
  weekLabel,
  isCurrentWeek,
  onPrevious,
  onNext,
  onWeekPick
}: WeekRangeHeaderProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-surface-darkCard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="relative z-10 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Previous Week
          </button>
          <button
            type="button"
            onClick={onNext}
            className="relative z-10 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Next Week
          </button>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{weekLabel}</p>
          {isCurrentWeek ? (
            <p className="text-xs font-medium text-[var(--primary-color)]">Current Week</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span>Jump</span>
          <input
            type="week"
            value={weekId}
            onChange={(event) => onWeekPick(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
        </label>
      </div>
    </section>
  );
};

export default WeekRangeHeader;
