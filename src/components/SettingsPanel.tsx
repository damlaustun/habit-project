import ThemeSelector from './ThemeSelector';
import ColorPickerGroup from './ColorPickerGroup';
import type { AppSettings, ThemeMode } from '../types/habit';

type SettingsPanelProps = {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onThemeChange: (mode: ThemeMode) => void;
  onColorChange: (key: 'primaryColor' | 'accentColor' | 'backgroundColor', value: string) => void;
  onDailyGoalChange: (value: number) => void;
  onWeeklyGoalChange: (value: number) => void;
  onLockPastWeeksChange: (enabled: boolean) => void;
};

const SettingsPanel = ({
  open,
  settings,
  onClose,
  onThemeChange,
  onColorChange,
  onDailyGoalChange,
  onWeeklyGoalChange,
  onLockPastWeeksChange
}: SettingsPanelProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-popIn rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Theme mode</h3>
            <ThemeSelector mode={settings.themeSettings.mode} onChange={onThemeChange} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Colors</h3>
            <ColorPickerGroup colors={settings.colorSettings} onColorChange={onColorChange} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Point goals</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <span className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Daily goal</span>
                <input
                  type="number"
                  min={0}
                  value={settings.goals.dailyGoal}
                  onChange={(event) => onDailyGoalChange(Number(event.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
              <label className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <span className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Weekly goal</span>
                <input
                  type="number"
                  min={0}
                  value={settings.goals.weeklyGoal}
                  onChange={(event) => onWeeklyGoalChange(Number(event.target.value))}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-700 dark:text-slate-200">Read-only completed (past) weeks</span>
              <input
                type="checkbox"
                checked={settings.lockPastWeeks}
                onChange={(event) => onLockPastWeeksChange(event.target.checked)}
                className="h-4 w-4"
              />
            </label>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
