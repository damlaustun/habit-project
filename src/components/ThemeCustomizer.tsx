import clsx from 'clsx';
import type { ThemeColors, ThemeMode } from '../types/habit';

type ThemeCustomizerProps = {
  mode: ThemeMode;
  colors: ThemeColors;
  onModeChange: (mode: ThemeMode) => void;
  onColorChange: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
};

const modes: ThemeMode[] = ['light', 'dark', 'system'];

const ThemeCustomizer = ({ mode, colors, onModeChange, onColorChange }: ThemeCustomizerProps) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Mode</p>
        <div className="flex gap-2">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={clsx(
                'rounded-lg border px-3 py-1.5 text-sm capitalize transition',
                mode === item
                  ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white'
                  : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          Primary
          <input
            type="color"
            value={colors.primaryColor}
            onChange={(event) => onColorChange('primaryColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          Secondary
          <input
            type="color"
            value={colors.secondaryColor}
            onChange={(event) => onColorChange('secondaryColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          Background
          <input
            type="color"
            value={colors.backgroundColor}
            onChange={(event) => onColorChange('backgroundColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
