import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import TaskCard from './TaskCard';
import type { DayId, Task } from '../types/habit';

type DayColumnProps = {
  day: DayId;
  label: string;
  tasks: Task[];
  readOnly?: boolean;
  onAddTask: (day: DayId) => void;
  onToggleTask: (day: DayId, taskId: string) => void;
  onDeleteTask: (day: DayId, taskId: string) => void;
  onUpdateTask: (
    day: DayId,
    taskId: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'points' | 'completed' | 'priority'>>
  ) => void;
};

const DayColumn = ({
  day,
  label,
  tasks,
  readOnly,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${day}`,
    data: { day, type: 'column' }
  });

  return (
    <section
      ref={setNodeRef}
      className={clsx(
        'rounded-xl border border-slate-200 bg-surface-card p-3 transition dark:border-slate-700 dark:bg-surface-darkCard',
        isOver && 'border-[var(--primary-color)]/60 bg-[var(--accent-color)]/15'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          {label}
        </h3>
        <button
          type="button"
          onClick={() => onAddTask(day)}
          disabled={readOnly}
          className="rounded-md px-2 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          + Add
        </button>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              day={day}
              task={task}
              readOnly={readOnly}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
            />
          ))}

          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
              No tasks yet
            </div>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
};

export default DayColumn;
