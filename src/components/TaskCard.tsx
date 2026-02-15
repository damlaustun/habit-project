import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import DurationEditor from './DurationEditor';
import PriorityIndicator from './PriorityIndicator';
import type { DayId, HabitPriority, Task } from '../types/habit';

type TaskCardProps = {
  day: DayId;
  task: Task;
  readOnly?: boolean;
  onToggle: (day: DayId, taskId: string) => void;
  onDelete: (day: DayId, taskId: string) => void;
  onUpdate: (
    day: DayId,
    taskId: string,
    patch: Partial<
      Pick<
        Task,
        'title' | 'description' | 'points' | 'priority' | 'completed' | 'targetDurationMin' | 'completedDurationMin'
      >
    >
  ) => void;
  onUpdateDuration: (day: DayId, taskId: string, completedDurationMin: number) => void;
};

const TaskCard = ({
  day,
  task,
  readOnly,
  onToggle,
  onDelete,
  onUpdate,
  onUpdateDuration
}: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [points, setPoints] = useState(task.points);
  const [priority, setPriority] = useState<HabitPriority>(task.priority);
  const [targetDuration, setTargetDuration] = useState(task.targetDurationMin ?? 0);
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPoints(task.points);
    setPriority(task.priority);
    setTargetDuration(task.targetDurationMin ?? 0);
    setCompleted(task.completed);
  }, [task]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      day,
      type: 'task'
    },
    disabled: readOnly
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const saveEdit = () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    onUpdate(day, task.id, {
      title: normalizedTitle,
      description,
      points,
      priority,
      targetDurationMin: targetDuration,
      completed
    });
    setEditing(false);
  };

  const hasDuration = Boolean((task.targetDurationMin ?? 0) > 0 || task.completedDurationMin > 0);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={clsx(
        'animate-popIn rounded-xl border bg-[var(--card-color)] p-3 shadow-sm transition-all duration-200',
        task.priority === 'important'
          ? 'border-[var(--secondary-color)]/70 bg-[var(--secondary-color)]/10 dark:border-[var(--secondary-color)]/70'
          : 'border-slate-200 dark:border-slate-700',
        task.completed && 'opacity-60',
        isDragging && 'rotate-[0.8deg] shadow-lg'
      )}
    >
      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none ring-[var(--secondary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="h-20 w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none ring-[var(--secondary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={points}
              onChange={(event) => setPoints(Number(event.target.value))}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
            <input
              type="number"
              min={0}
              value={targetDuration}
              onChange={(event) => setTargetDuration(Number(event.target.value))}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Target min"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1">
              <input type="radio" checked={priority === 'normal'} onChange={() => setPriority('normal')} />
              Normal
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={priority === 'important'}
                onChange={() => setPriority('important')}
              />
              !
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={completed}
                onChange={(event) => setCompleted(event.target.checked)}
              />
              Completed
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-md px-2 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(day, task.id)}
              disabled={readOnly}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--secondary-color)] focus:ring-[var(--secondary-color)]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className={clsx('text-sm font-semibold text-slate-800 dark:text-slate-100', task.completed && 'line-through')}>
                  {task.title}
                </h4>
                <PriorityIndicator priority={task.priority} />
              </div>

              {task.description ? (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
              ) : null}

              {hasDuration ? (
                <DurationEditor
                  targetDurationMin={task.targetDurationMin}
                  completedDurationMin={task.completedDurationMin}
                  readOnly={readOnly}
                  onChange={(value) => onUpdateDuration(day, task.id, value)}
                />
              ) : null}

              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary-color)]">
                {task.points} pts
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              {...attributes}
              {...listeners}
              disabled={readOnly}
              className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 hover:border-slate-400 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
            >
              Drag
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={readOnly}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:text-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(day, task.id)}
                disabled={readOnly}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  );
};

export default TaskCard;
