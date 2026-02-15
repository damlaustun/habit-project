import { useState } from 'react';
import { DAY_ORDER, type DayId, type WorkoutProgram } from '../types/habit';
import { getWorkoutProgress } from '../utils/stats';

type WorkoutPlannerProps = {
  programs: WorkoutProgram[];
  onAddProgram: (name: string) => void;
  onAddWorkoutItem: (programId: string, day: DayId, input: { title: string; reps?: string; durationMin?: number }) => void;
  onToggleWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  onUpdateWorkoutItem: (
    programId: string,
    day: DayId,
    itemId: string,
    patch: { title?: string; reps?: string; durationMin?: number }
  ) => void;
  onDeleteWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  onClearWorkoutDay: (programId: string, day: DayId) => void;
};

const WorkoutPlanner = ({
  programs,
  onAddProgram,
  onAddWorkoutItem,
  onToggleWorkoutItem,
  onUpdateWorkoutItem,
  onDeleteWorkoutItem,
  onClearWorkoutDay
}: WorkoutPlannerProps) => {
  const [programName, setProgramName] = useState('');

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!programName.trim()) {
            return;
          }
          onAddProgram(programName.trim());
          setProgramName('');
        }}
      >
        <input
          value={programName}
          onChange={(event) => setProgramName(event.target.value)}
          placeholder="New workout program"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button type="submit" className="rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
          Add Program
        </button>
      </form>

      {programs.map((program) => {
        const progress = getWorkoutProgress(program);
        return (
          <article key={program.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">{program.name}</h3>
              <span className="text-xs text-slate-500">{progress.completed}/{progress.total} done</span>
            </div>

            <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700">
              <div className="h-full rounded" style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }} />
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {DAY_ORDER.map((day) => (
                <div key={day} className="rounded-md border border-slate-200 p-2 dark:border-slate-700">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</p>
                    <button
                      type="button"
                      onClick={() => onClearWorkoutDay(program.id, day)}
                      className="text-[11px] text-rose-600"
                    >
                      Clear day
                    </button>
                  </div>

                  <div className="space-y-1">
                    {program.days[day].map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-2 text-xs">
                        <label className="flex min-w-0 items-start gap-2">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => onToggleWorkoutItem(program.id, day, item.id)}
                          />
                          <span className={item.completed ? 'line-through opacity-60' : ''}>
                            {item.title}
                            {item.reps ? ` • ${item.reps}` : ''}
                            {item.durationMin ? ` • ${item.durationMin}m` : ''}
                          </span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const title = window.prompt('Exercise name', item.title);
                              if (!title) return;
                              const reps = window.prompt('Reps (optional)', item.reps ?? '') ?? '';
                              const duration =
                                window.prompt(
                                  'Duration min (optional)',
                                  item.durationMin ? String(item.durationMin) : ''
                                ) ?? '';
                              onUpdateWorkoutItem(program.id, day, item.id, {
                                title,
                                reps: reps || undefined,
                                durationMin: duration ? Number(duration) : undefined
                              });
                            }}
                            className="text-[11px] text-slate-600 dark:text-slate-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteWorkoutItem(program.id, day, item.id)}
                            className="text-[11px] text-rose-600"
                            aria-label="Delete exercise"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const title = window.prompt('Exercise name');
                      if (!title) return;
                      const reps = window.prompt('Reps (optional)', '') || undefined;
                      const duration = window.prompt('Duration min (optional)', '');
                      onAddWorkoutItem(program.id, day, {
                        title,
                        reps,
                        durationMin: duration ? Number(duration) : undefined
                      });
                    }}
                    className="mt-2 rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600"
                  >
                    + Add Exercise
                  </button>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default WorkoutPlanner;
