import clsx from 'clsx';
import type { HabitType } from '../types/habit';

type RecurringHabitToggleProps = {
  value: HabitType;
  onChange: (value: HabitType) => void;
};

const options: Array<{ label: string; value: HabitType }> = [
  { label: 'Normal', value: 'normal' },
  { label: '!', value: 'important' },
  { label: 'Recurring', value: 'recurring' }
];

const RecurringHabitToggle = ({ value, onChange }: RecurringHabitToggleProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-sm transition',
            value === option.value
              ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white'
              : 'border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default RecurringHabitToggle;
