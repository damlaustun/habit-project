import ThemeCustomizer from './ThemeCustomizer';
import type { FontFamilyOption, LanguageOption, ThemeColors, ThemeMode } from '../types/habit';
import { useI18n } from '../i18n/useI18n';

type SettingsPanelProps = {
  open: boolean;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  fontFamily: FontFamilyOption;
  language: LanguageOption;
  dailyGoal: number;
  lockPastWeeks: boolean;
  onClose: () => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorChange: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void;
  onFontFamilyChange: (value: FontFamilyOption) => void;
  onLanguageChange: (value: LanguageOption) => void;
  onDailyGoalChange: (value: number) => void;
  onLockPastWeeksChange: (value: boolean) => void;
  onResetApp: () => void;
};

const SettingsPanel = ({
  open,
  themeMode,
  themeColors,
  fontFamily,
  language,
  dailyGoal,
  lockPastWeeks,
  onClose,
  onThemeModeChange,
  onThemeColorChange,
  onFontFamilyChange,
  onLanguageChange,
  onDailyGoalChange,
  onLockPastWeeksChange,
  onResetApp
}: SettingsPanelProps) => {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-popIn rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('settings')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
          >
            {t('close')}
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('themeAndColors')}</h3>
            <ThemeCustomizer
              mode={themeMode}
              language={language}
              colors={themeColors}
              fontFamily={fontFamily}
              onModeChange={onThemeModeChange}
              onLanguageChange={onLanguageChange}
              onColorChange={onThemeColorChange}
              onFontFamilyChange={onFontFamilyChange}
            />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('dailyGoal')}</h3>
            <div className="grid gap-3 sm:grid-cols-1">
              <label className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <span className="mb-1 block text-sm text-slate-700 dark:text-slate-200">{t('dailyGoal')}</span>
                <input
                  type="number"
                  min={0}
                  value={dailyGoal}
                  onChange={(event) => onDailyGoalChange(Number(event.target.value))}
                  className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <label className="flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200">
              <span>{t('setPastReadOnly')}</span>
              <input
                type="checkbox"
                checked={lockPastWeeks}
                onChange={(event) => onLockPastWeeksChange(event.target.checked)}
              />
            </label>
          </section>

          <section className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{t('resetApp')}</p>
                <p className="text-xs text-rose-600/90 dark:text-rose-300/80">
                  {t('resetAppDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={onResetApp}
                className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/40"
              >
                {t('resetApp')}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
