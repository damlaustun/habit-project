import type { ColorSettings } from '../types/habit';

type ColorPickerGroupProps = {
  colors: ColorSettings;
  onColorChange: <K extends keyof ColorSettings>(key: K, value: ColorSettings[K]) => void;
};

const ColorPickerGroup = ({ colors, onColorChange }: ColorPickerGroupProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Primary</span>
        <input
          type="color"
          value={colors.primaryColor}
          onChange={(event) => onColorChange('primaryColor', event.target.value)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
        <span className="text-sm text-slate-700 dark:text-slate-200">Accent</span>
        <input
          type="color"
          value={colors.accentColor}
          onChange={(event) => onColorChange('accentColor', event.target.value)}
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
    </div>
  );
};

export default ColorPickerGroup;
