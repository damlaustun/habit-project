import { useEffect, useState, type FormEvent } from 'react';
import type { DayId, TaskInput, TaskPriority } from '../types/habit';

type AddTaskModalProps = {
  day: DayId | null;
  onClose: () => void;
  onSubmit: (day: DayId, input: TaskInput) => void;
  disabled?: boolean;
};

const AddTaskModal = ({ day, onClose, onSubmit, disabled }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(5);
  const [priority, setPriority] = useState<TaskPriority>('normal');

  useEffect(() => {
    if (!day) {
      setTitle('');
      setDescription('');
      setPoints(5);
      setPriority('normal');
    }
  }, [day]);

  if (!day) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    onSubmit(day, {
      title: normalizedTitle,
      description,
      points,
      priority
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-popIn rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add task</h2>
        <p className="mt-1 text-sm text-slate-500">Day: {day.toUpperCase()}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-900"
              placeholder="Task title"
              disabled={disabled}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Description (optional)
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-900"
              placeholder="Add extra context"
              disabled={disabled}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Points</span>
            <input
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--primary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-900"
              disabled={disabled}
            />
          </label>

          <fieldset className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</legend>
            <div className="mt-1 flex gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  disabled={disabled}
                />
                Normal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={priority === 'important'}
                  onChange={() => setPriority('important')}
                  disabled={disabled}
                />
                Important (!)
              </label>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
