import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import PriorityBadge from './PriorityBadge';
import type { DayId, Task, TaskPriority } from '../types/habit';

type TaskCardProps = {
  day: DayId;
  task: Task;
  readOnly?: boolean;
  onToggle: (day: DayId, taskId: string) => void;
  onDelete: (day: DayId, taskId: string) => void;
  onUpdate: (
    day: DayId,
    taskId: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'points' | 'completed' | 'priority'>>
  ) => void;
};

const TaskCard = ({ day, task, readOnly, onToggle, onDelete, onUpdate }: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [points, setPoints] = useState(task.points);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPoints(task.points);
    setPriority(task.priority);
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
      priority
    });
    setEditing(false);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={clsx(
        'animate-popIn rounded-xl border bg-white p-3 shadow-sm transition-all duration-200 dark:bg-slate-900/70',
        task.priority === 'important'
          ? 'border-amber-400/70 ring-1 ring-amber-300/60 dark:border-amber-600'
          : 'border-slate-200 dark:border-slate-700',
        task.completed && 'bg-slate-50 opacity-60 dark:bg-slate-800/40',
        isDragging && 'rotate-[0.8deg] shadow-lg'
      )}
    >
      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <input
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <div className="flex gap-3 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={priority === 'normal'}
                onChange={() => setPriority('normal')}
              />
              Normal
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={priority === 'important'}
                onChange={() => setPriority('important')}
              />
              Important
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
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h4
                  className={clsx(
                    'text-sm font-semibold text-slate-800 transition-all dark:text-slate-100',
                    task.completed && 'line-through'
                  )}
                >
                  {task.title}
                </h4>
                <PriorityBadge priority={task.priority} />
              </div>

              {task.description ? (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
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
              className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300"
            >
              Drag
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={readOnly}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:text-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(day, task.id)}
                disabled={readOnly}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
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
