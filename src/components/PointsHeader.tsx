import GoalProgressBar from './GoalProgressBar';

type PointsHeaderProps = {
  totalPoints: number;
  dailyPoints: number;
  dailyGoal: number;
  weeklyGoal: number;
  weekLabel: string;
  readOnly: boolean;
  userName: string;
  userAvatar: string;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
};

const PointsHeader = ({
  totalPoints,
  dailyPoints,
  dailyGoal,
  weeklyGoal,
  weekLabel,
  readOnly,
  userName,
  userAvatar,
  onOpenSettings,
  onOpenProfile,
  onLogout
}: PointsHeaderProps) => {
  const isAvatarImage = userAvatar.startsWith('data:image') || userAvatar.startsWith('http');

  return (
    <header className="animate-popIn rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-surface-darkCard/90">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Weekly Planner
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{weekLabel}</h1>
          {readOnly ? (
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-300">
              This past week is read-only.
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Settings
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-50 text-sm dark:border-slate-600 dark:bg-slate-800">
              {isAvatarImage ? (
                <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
              ) : (
                userAvatar
              )}
            </span>
            <span>{userName}</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-700 dark:text-rose-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--secondary-color)]/25 bg-[var(--secondary-color)]/15 p-4">
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
