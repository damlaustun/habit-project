import type { TaskPriority } from '../types/habit';

type PriorityBadgeProps = {
  priority: TaskPriority;
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  if (priority === 'important') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
        <span aria-hidden>!</span> Important
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:text-slate-300">
      Normal
    </span>
  );
};

export default PriorityBadge;
