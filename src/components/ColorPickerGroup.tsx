import type { ThemeColors } from '../types/habit';

type ColorPickerGroupProps = {
  colors: ThemeColors;
  onColorChange: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
};

const ColorPickerGroup = ({ colors, onColorChange }: ColorPickerGroupProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Primary</span>
        <input
          type="color"
          value={colors.primaryColor}
          onChange={(event) => onColorChange('primaryColor', event.target.value)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Secondary</span>
        <input
          type="color"
          value={colors.secondaryColor}
          onChange={(event) => onColorChange('secondaryColor', event.target.value)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Background</span>
        <input
          type="color"
          value={colors.backgroundColor}
          onChange={(event) => onColorChange('backgroundColor', event.target.value)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Panel</span>
        <input
          type="color"
          value={colors.panelColor}
          onChange={(event) => onColorChange('panelColor', event.target.value)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Card</span>
        <input
          type="color"
          value={colors.cardColor}
          onChange={(event) => onColorChange('cardColor', event.target.value)}
        />
      </label>
    </div>
  );
};

export default ColorPickerGroup;
