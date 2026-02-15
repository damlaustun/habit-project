import type { HabitPriority } from '../types/habit';

type PriorityIndicatorProps = {
  priority: HabitPriority;
};

const PriorityIndicator = ({ priority }: PriorityIndicatorProps) => {
  if (priority !== 'important') {
    return null;
  }

  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-100"
      aria-label="Important habit"
      title="Important"
    >
      !
    </span>
  );
};

export default PriorityIndicator;
