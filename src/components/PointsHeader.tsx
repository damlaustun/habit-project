import GoalProgressBar from './GoalProgressBar';

type PointsHeaderProps = {
  totalPoints: number;
  dailyPoints: number;
  dailyGoal: number;
  weeklyGoal: number;
  weekLabel: string;
  onResetWeek: () => void;
  onOpenSettings: () => void;
  readOnly: boolean;
};

const PointsHeader = ({
  totalPoints,
  dailyPoints,
  dailyGoal,
  weeklyGoal,
  weekLabel,
  onResetWeek,
  onOpenSettings,
  readOnly
}: PointsHeaderProps) => {
  return (
    <header className="animate-popIn rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-surface-darkCard/90">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Weekly Planner
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Habit Tracker <span className="text-base font-medium text-slate-500">{weekLabel}</span>
          </h1>
          {readOnly ? (
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-300">
              Past week is read-only in current settings
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={onResetWeek}
            disabled={readOnly}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Weekly reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--accent-color)]/25 bg-[var(--accent-color)]/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-color)]">Total Points</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{totalPoints}</p>
        </div>

        <GoalProgressBar label="Daily Goal Progress" value={dailyPoints} goal={dailyGoal} />
        <GoalProgressBar label="Weekly Goal Progress" value={totalPoints} goal={weeklyGoal} />
      </div>
    </header>
  );
};

export default PointsHeader;
