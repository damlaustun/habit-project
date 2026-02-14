import { useEffect, useMemo, useState } from 'react';
import AddTaskModal from './components/AddTaskModal';
import PointsHeader from './components/PointsHeader';
import SettingsPanel from './components/SettingsPanel';
import StatsBar from './components/StatsBar';
import WeekNavigator from './components/WeekNavigator';
import WeeklyBoard from './components/WeeklyBoard';
import { useHabitStore, isPastWeekComparedToCurrent } from './store/useHabitStore';
import type { DayId } from './types/habit';
import { getTodayDayId, getCurrentWeekId } from './utils/date';
import { getCompletedPointsForDay, getTaskCounts, getTotalCompletedPoints } from './utils/stats';

const App = () => {
  const [activeDayForModal, setActiveDayForModal] = useState<DayId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    currentWeekId,
    weeks,
    settings,
    getCurrentPlan,
    setCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
    resetCurrentWeek,
    setThemeMode,
    setColorSetting,
    setDailyGoal,
    setWeeklyGoal,
    setLockPastWeeks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTask,
    moveTaskToDayEnd
  } = useHabitStore();

  const currentPlan = useMemo(() => getCurrentPlan(), [getCurrentPlan, currentWeekId, weeks]);
  const totalPoints = useMemo(() => getTotalCompletedPoints(currentPlan), [currentPlan]);
  const taskCounts = useMemo(() => getTaskCounts(currentPlan), [currentPlan]);
  const dailyPoints = useMemo(
    () => getCompletedPointsForDay(currentPlan, getTodayDayId()),
    [currentPlan]
  );

  const isCurrentWeek = currentWeekId === getCurrentWeekId();
  const readOnly = settings.lockPastWeeks && isPastWeekComparedToCurrent(currentWeekId);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.colorSettings.primaryColor);
    root.style.setProperty('--accent-color', settings.colorSettings.accentColor);
    root.style.setProperty('--app-background', settings.colorSettings.backgroundColor);

    if (settings.themeSettings.mode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        root.classList.toggle('dark', media.matches);
      };

      applySystemTheme();
      media.addEventListener('change', applySystemTheme);
      return () => media.removeEventListener('change', applySystemTheme);
    }

    root.classList.toggle('dark', settings.themeSettings.mode === 'dark');
    return undefined;
  }, [settings]);

  return (
    <main className="min-h-screen bg-[var(--app-background)] px-4 py-6 text-slate-900 transition-all duration-500 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4">
        <PointsHeader
          totalPoints={totalPoints}
          dailyPoints={dailyPoints}
          dailyGoal={settings.goals.dailyGoal}
          weeklyGoal={settings.goals.weeklyGoal}
          weekLabel={currentPlan.weekLabel}
          onResetWeek={resetCurrentWeek}
          onOpenSettings={() => setSettingsOpen(true)}
          readOnly={readOnly}
        />

        <WeekNavigator
          weekId={currentWeekId}
          weekLabel={currentPlan.weekLabel}
          isCurrentWeek={isCurrentWeek}
          onPrevious={goToPreviousWeek}
          onNext={goToNextWeek}
          onPickWeek={setCurrentWeek}
        />

        <StatsBar completed={taskCounts.completed} total={taskCounts.total} percent={taskCounts.percent} />

        <section className="animate-slideIn overflow-x-auto rounded-2xl border border-slate-200 bg-surface-light/50 p-3 dark:border-slate-700 dark:bg-slate-900/20">
          <WeeklyBoard
            key={currentWeekId}
            plan={currentPlan}
            readOnly={readOnly}
            onAddTaskClick={setActiveDayForModal}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
            onReorderTask={reorderTask}
            onMoveToColumnEnd={moveTaskToDayEnd}
          />
        </section>
      </div>

      <AddTaskModal
        day={activeDayForModal}
        onClose={() => setActiveDayForModal(null)}
        onSubmit={addTask}
        disabled={readOnly}
      />

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onThemeChange={setThemeMode}
        onColorChange={setColorSetting}
        onDailyGoalChange={setDailyGoal}
        onWeeklyGoalChange={setWeeklyGoal}
        onLockPastWeeksChange={setLockPastWeeks}
      />
    </main>
  );
};

export default App;
