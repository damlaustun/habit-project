import { DAY_ORDER, type DayId, type HabitItem, type WeeklyPlan } from '../types/habit';
import DayContainer from './DayContainer';

type WeeklyBoardProps = {
  plan: WeeklyPlan;
  readOnly?: boolean;
  onAddHabitClick: (day: DayId) => void;
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
  onUpdateHabitDuration: (day: DayId, habitId: string, completedDurationMin: number) => void;
  onAddPlannerItem: (day: DayId, input: { title: string; description?: string; eventTime?: string }) => void;
  onTogglePlannerItem: (day: DayId, itemId: string) => void;
  onDeletePlannerItem: (day: DayId, itemId: string) => void;
};

const WeeklyBoard = ({
  plan,
  readOnly,
  onAddHabitClick,
  onToggleHabit,
  onDeleteHabit,
  onUpdateHabit,
  onUpdateHabitDuration,
  onAddPlannerItem,
  onTogglePlannerItem,
  onDeletePlannerItem
}: WeeklyBoardProps) => {
  return (
    <div className="space-y-3">
      {DAY_ORDER.map((day) => (
        <DayContainer
          key={day}
          weekId={plan.weekId}
          dayData={plan.days[day]}
          readOnly={readOnly}
          onAddHabit={onAddHabitClick}
          onToggleHabit={onToggleHabit}
          onDeleteHabit={onDeleteHabit}
          onUpdateHabit={onUpdateHabit}
          onUpdateDuration={onUpdateHabitDuration}
          onAddPlannerItem={onAddPlannerItem}
          onTogglePlannerItem={onTogglePlannerItem}
          onDeletePlannerItem={onDeletePlannerItem}
        />
      ))}
    </div>
  );
};

export default WeeklyBoard;
