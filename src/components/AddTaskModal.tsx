import { useEffect, useState, type FormEvent } from 'react';
import type { DayId, HabitType, RecurrenceMode, TaskInput } from '../types/habit';

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
  const [habitType, setHabitType] = useState<HabitType>('normal');
  const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>('this_week');
  const [repeatWeeks, setRepeatWeeks] = useState(4);
  const [targetDurationMin, setTargetDurationMin] = useState(0);

  useEffect(() => {
    if (!day) {
      setTitle('');
      setDescription('');
      setPoints(5);
      setHabitType('normal');
      setRecurrenceMode('this_week');
      setRepeatWeeks(4);
      setTargetDurationMin(0);
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

    const recurrence =
      recurrenceMode === 'this_week'
        ? { mode: 'this_week' as const }
        : recurrenceMode === 'weeks'
          ? { mode: 'weeks' as const, weeks: Math.max(1, Math.round(repeatWeeks)) }
          : { mode: 'forever' as const };

    onSubmit(day, {
      title: normalizedTitle,
      description,
      points,
      habitType,
      targetDurationMin,
      recurrence
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-popIn rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-surface-darkCard">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add habit</h2>
        <p className="mt-1 text-sm text-slate-500">Day: {day.toUpperCase()}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Title</span>
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--secondary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-900"
              placeholder="Habit title"
              disabled={disabled}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--secondary-color)] focus:ring-2 dark:border-slate-600 dark:bg-slate-900"
              placeholder="Optional details"
              disabled={disabled}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Points</span>
              <input
                type="number"
                min={0}
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                disabled={disabled}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Target Duration (min)
              </span>
              <input
                type="number"
                min={0}
                value={targetDurationMin}
                onChange={(event) => setTargetDurationMin(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                disabled={disabled}
              />
            </label>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Priority</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setHabitType('normal')}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  habitType === 'normal'
                    ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white'
                    : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setHabitType('important')}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  habitType === 'important'
                    ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white'
                    : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'
                }`}
              >
                !
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Recurrence</span>
              <select
                value={recurrenceMode}
                onChange={(event) => setRecurrenceMode(event.target.value as RecurrenceMode)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              >
                <option value="this_week">This week only</option>
                <option value="weeks">Repeat for X weeks</option>
                <option value="forever">Repeat indefinitely</option>
              </select>
            </label>

            {recurrenceMode === 'weeks' ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Weeks</span>
                <input
                  type="number"
                  min={1}
                  value={repeatWeeks}
                  onChange={(event) => setRepeatWeeks(Number(event.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
              </label>
            ) : (
              <div />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
