import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DAY_ORDER, type DayId, type Task, type WeeklyPlan } from '../types/habit';
import DayColumn from './DayColumn';

type WeeklyBoardProps = {
  plan: WeeklyPlan;
  readOnly?: boolean;
  onAddTaskClick: (day: DayId) => void;
  onToggleTask: (day: DayId, taskId: string) => void;
  onDeleteTask: (day: DayId, taskId: string) => void;
  onUpdateTask: (
    day: DayId,
    taskId: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'points' | 'completed' | 'priority'>>
  ) => void;
  onReorderTask: (from: { day: DayId; id: string }, to: { day: DayId; id: string }) => void;
  onMoveToColumnEnd: (from: { day: DayId; id: string }, toDay: DayId) => void;
};

const WeeklyBoard = ({
  plan,
  readOnly,
  onAddTaskClick,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onReorderTask,
  onMoveToColumnEnd
}: WeeklyBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) {
      return;
    }

    const { active, over } = event;
    if (!over) {
      return;
    }

    const sourceDay = active.data.current?.day as DayId | undefined;
    const targetType = over.data.current?.type as 'task' | 'column' | undefined;
    const targetDay = over.data.current?.day as DayId | undefined;

    if (!sourceDay || !targetDay) {
      return;
    }

    if (targetType === 'task') {
      onReorderTask({ day: sourceDay, id: String(active.id) }, { day: targetDay, id: String(over.id) });
      return;
    }

    onMoveToColumnEnd({ day: sourceDay, id: String(active.id) }, targetDay);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid min-w-[1200px] grid-cols-7 gap-3">
        {DAY_ORDER.map((day) => {
          const dayPlan = plan.days[day];
          return (
            <DayColumn
              key={day}
              day={day}
              label={dayPlan.label}
              tasks={dayPlan.tasks}
              readOnly={readOnly}
              onAddTask={onAddTaskClick}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default WeeklyBoard;
