import clsx from 'clsx';
import type { ThemeMode } from '../types/habit';

type ThemeSelectorProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const modes: ThemeMode[] = ['light', 'dark', 'system'];

const ThemeSelector = ({ mode, onChange }: ThemeSelectorProps) => {
  return (
    <div className="flex gap-2">
      {modes.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={clsx(
            'rounded-lg border px-3 py-2 text-sm capitalize transition',
            mode === item
              ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white'
              : 'border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200'
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
