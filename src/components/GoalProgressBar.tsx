type GoalProgressBarProps = {
  label: string;
  value: number;
  goal: number;
};

const GoalProgressBar = ({ label, value, goal }: GoalProgressBarProps) => {
  const percent = goal <= 0 ? 0 : Math.min(100, Math.round((value / goal) * 100));

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>
          {value}/{goal} pts
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-[var(--primary-color)] transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={`${label} progress`}
        />
      </div>
    </div>
  );
};

export default GoalProgressBar;
