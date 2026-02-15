import HabitSection from './HabitSection';
import PlannerSection from './PlannerSection';
import type { DayContainerData, DayId, HabitItem } from '../types/habit';
import { formatMonthDay, getDateForWeekDay } from '../utils/date';

type DayContainerProps = {
  weekId: string;
  dayData: DayContainerData;
  readOnly?: boolean;
  onAddHabit: (day: DayId) => void;
  onToggleHabit: (day: DayId, habitId: string) => void;
  onDeleteHabit: (day: DayId, habitId: string) => void;
  onUpdateHabit: (
    day: DayId,
    habitId: string,
    patch: Partial<
      Pick<
        HabitItem,
        'title' | 'description' | 'points' | 'priority' | 'completed' | 'targetDurationMin' | 'completedDurationMin'
      >
    >
  ) => void;
  onUpdateDuration: (day: DayId, habitId: string, completedDurationMin: number) => void;
  onAddPlannerItem: (day: DayId, input: { title: string; description?: string; eventTime?: string }) => void;
  onTogglePlannerItem: (day: DayId, itemId: string) => void;
  onDeletePlannerItem: (day: DayId, itemId: string) => void;
};

const DayContainer = ({
  weekId,
  dayData,
  readOnly,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit,
  onUpdateHabit,
  onUpdateDuration,
  onAddPlannerItem,
  onTogglePlannerItem,
  onDeletePlannerItem
}: DayContainerProps) => {
  const dayLabel = `${dayData.label} — ${formatMonthDay(getDateForWeekDay(weekId, dayData.day))}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-[var(--card-color)]/95 p-4 shadow-soft backdrop-blur-sm dark:border-slate-700">
      <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{dayLabel}</h3>

      <div className="grid gap-3 lg:grid-cols-2">
        <HabitSection
          day={dayData.day}
          habits={dayData.habits}
          readOnly={readOnly}
          onAddHabit={onAddHabit}
          onToggleHabit={onToggleHabit}
          onDeleteHabit={onDeleteHabit}
          onUpdateHabit={onUpdateHabit}
          onUpdateDuration={onUpdateDuration}
        />

        <PlannerSection
          day={dayData.day}
          agenda={dayData.agenda}
          readOnly={readOnly}
          onAddPlannerItem={onAddPlannerItem}
          onTogglePlannerItem={onTogglePlannerItem}
          onDeletePlannerItem={onDeletePlannerItem}
        />
      </div>
    </article>
  );
};

export default DayContainer;
