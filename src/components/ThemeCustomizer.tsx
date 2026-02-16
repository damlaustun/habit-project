import clsx from 'clsx';
import type { FontFamilyOption, ThemeColors, ThemeMode } from '../types/habit';
import { useI18n } from '../i18n/useI18n';

type ThemeCustomizerProps = {
  mode: ThemeMode;
  colors: ThemeColors;
  fontFamily: FontFamilyOption;
  onModeChange: (mode: ThemeMode) => void;
  onColorChange: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
  onFontFamilyChange: (value: FontFamilyOption) => void;
};

const modes: ThemeMode[] = ['light', 'dark', 'system'];

const ThemeCustomizer = ({
  mode,
  colors,
  fontFamily,
  onModeChange,
  onColorChange,
  onFontFamilyChange
}: ThemeCustomizerProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('mode')}</p>
        <div className="flex gap-2">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={clsx(
                'rounded-lg border px-3 py-1.5 text-sm capitalize transition',
                mode === item
                  ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] text-[var(--on-secondary-color)]'
                  : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          {t('primaryAccent')}
          <input
            type="color"
            value={colors.primaryColor}
            onChange={(event) => onColorChange('primaryColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          {t('secondaryButtons')}
          <input
            type="color"
            value={colors.secondaryColor}
            onChange={(event) => onColorChange('secondaryColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          {t('background')}
          <input
            type="color"
            value={colors.backgroundColor}
            onChange={(event) => onColorChange('backgroundColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          {t('panelColor')}
          <input
            type="color"
            value={colors.panelColor}
            onChange={(event) => onColorChange('panelColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>

        <label className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
          {t('innerPanels')}
          <input
            type="color"
            value={colors.cardColor}
            onChange={(event) => onColorChange('cardColor', event.target.value)}
            className="mt-1 block h-8 w-full"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('font')}</p>
        <select
          value={fontFamily}
          onChange={(event) => onFontFamilyChange(event.target.value as FontFamilyOption)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="system">System Default</option>
          <option value="inter">Inter</option>
          <option value="poppins">Poppins</option>
          <option value="roboto">Roboto</option>
          <option value="manrope">Manrope</option>
          <option value="nunito">Nunito</option>
          <option value="lora">Lora</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
