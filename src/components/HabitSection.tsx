import TaskCard from './TaskCard';
import type { DayId, HabitItem } from '../types/habit';

type HabitSectionProps = {
  day: DayId;
  habits: HabitItem[];
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
};

const HabitSection = ({
  day,
  habits,
  readOnly,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit,
  onUpdateHabit,
  onUpdateDuration
}: HabitSectionProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Daily Habits</h4>
        <button
          type="button"
          onClick={() => onAddHabit(day)}
          disabled={readOnly}
          className="rounded-md px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--secondary-color)' }}
        >
          + Habit
        </button>
      </div>

      <div className="space-y-2">
        {habits.map((habit) => (
          <TaskCard
            key={habit.id}
            day={day}
            task={habit}
            readOnly={readOnly}
            onToggle={onToggleHabit}
            onDelete={onDeleteHabit}
            onUpdate={onUpdateHabit}
            onUpdateDuration={onUpdateDuration}
          />
        ))}

        {habits.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
            No habits for this day.
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default HabitSection;
