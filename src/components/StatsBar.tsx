type StatsBarProps = {
  completed: number;
  total: number;
  percent: number;
};

const StatsBar = ({ completed, total, percent }: StatsBarProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-surface-darkCard">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>Weekly completion</span>
        <span>
          {completed}/{total} tasks ({percent}%)
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${percent}%`, backgroundColor: 'var(--primary-color)' }} />
      </div>
    </section>
  );
};

export default StatsBar;
