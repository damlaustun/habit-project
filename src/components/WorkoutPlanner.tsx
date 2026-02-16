import { useState } from 'react';
import { DAY_ORDER, type DayId, type WorkoutProgram } from '../types/habit';
import { getWorkoutProgress } from '../utils/stats';

type WorkoutPlannerProps = {
  programs: WorkoutProgram[];
  onAddProgram: (name: string) => void;
  onUpdateProgram: (programId: string, patch: { name?: string; description?: string }) => void;
  onDeleteProgram: (programId: string) => void;
  onAddWorkoutItem: (
    programId: string,
    day: DayId,
    input: { title: string; sets?: number; reps?: number; durationMin?: number }
  ) => void;
  onToggleWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  onUpdateWorkoutItem: (
    programId: string,
    day: DayId,
    itemId: string,
    patch: { title?: string; sets?: number; reps?: number; durationMin?: number }
  ) => void;
  onDeleteWorkoutItem: (programId: string, day: DayId, itemId: string) => void;
  onClearWorkoutDay: (programId: string, day: DayId) => void;
};

type ExerciseMode = 'set_reps' | 'duration';

type ExerciseDraft = {
  title: string;
  mode: ExerciseMode;
  sets: number;
  reps: number;
  durationMin: number;
};

const emptyDraft = (): ExerciseDraft => ({
  title: '',
  mode: 'set_reps',
  sets: 3,
  reps: 10,
  durationMin: 30
});

const dayKey = (programId: string, day: DayId): string => `${programId}:${day}`;
const itemKey = (programId: string, day: DayId, itemId: string): string => `${programId}:${day}:${itemId}`;

const WorkoutPlanner = ({
  programs,
  onAddProgram,
  onUpdateProgram,
  onDeleteProgram,
  onAddWorkoutItem,
  onToggleWorkoutItem,
  onUpdateWorkoutItem,
  onDeleteWorkoutItem,
  onClearWorkoutDay
}: WorkoutPlannerProps) => {
  const [programName, setProgramName] = useState('');
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingProgramName, setEditingProgramName] = useState('');
  const [editingProgramDescription, setEditingProgramDescription] = useState('');

  const [openAddFormKey, setOpenAddFormKey] = useState<string | null>(null);
  const [addDraft, setAddDraft] = useState<ExerciseDraft>(emptyDraft());

  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ExerciseDraft>(emptyDraft());

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const normalized = programName.trim();
          if (!normalized) return;
          onAddProgram(normalized);
          setProgramName('');
        }}
      >
        <input
          value={programName}
          onChange={(event) => setProgramName(event.target.value)}
          placeholder="New workout program"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="submit"
          className="rounded-md px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
        >
          Add Program
        </button>
      </form>

      {programs.map((program) => {
        const progress = getWorkoutProgress(program);
        return (
          <article key={program.id} className="rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-800 dark:text-slate-100">{program.name}</h3>
                {program.description ? <p className="text-xs text-slate-500">{program.description}</p> : null}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {progress.completed}/{progress.total} done
                </span>
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600">
                    Edit
                  </summary>
                  <div className="absolute right-0 z-20 mt-1 w-44 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProgramId(program.id);
                        setEditingProgramName(program.name);
                        setEditingProgramDescription(program.description ?? '');
                      }}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Edit program
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProgram(program.id)}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Delete program
                    </button>
                  </div>
                </details>
              </div>
            </div>

            {editingProgramId === program.id ? (
              <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <input
                  value={editingProgramName}
                  onChange={(event) => setEditingProgramName(event.target.value)}
                  placeholder="Program name"
                  className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <input
                  value={editingProgramDescription}
                  onChange={(event) => setEditingProgramDescription(event.target.value)}
                  placeholder="Program description"
                  className="rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProgramId(null)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProgram(program.id, {
                        name: editingProgramName,
                        description: editingProgramDescription
                      });
                      setEditingProgramId(null);
                    }}
                    className="rounded px-2 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : null}

            <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded"
                style={{ width: `${progress.percent}%`, backgroundColor: 'var(--secondary-color)' }}
              />
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {DAY_ORDER.map((day) => (
                <div key={day} className="rounded-md border border-slate-200 p-2 dark:border-slate-700">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</p>
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600">
                        Edit
                      </summary>
                      <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => onClearWorkoutDay(program.id, day)}
                          className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Clear day
                        </button>
                      </div>
                    </details>
                  </div>

                  <div className="space-y-1">
                    {program.days[day].map((item) => {
                      const currentItemKey = itemKey(program.id, day, item.id);
                      const isEditingItem = editingItemKey === currentItemKey;
                      const hasSetRep = Number(item.sets) > 0 && Number(item.reps) > 0;

                      return (
                        <div key={item.id} className="rounded border border-slate-200 p-1.5 text-xs dark:border-slate-700">
                          {isEditingItem ? (
                            <div className="space-y-1.5">
                              <input
                                value={editDraft.title}
                                onChange={(event) => setEditDraft((prev) => ({ ...prev, title: event.target.value }))}
                                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                              />
                              <select
                                value={editDraft.mode}
                                onChange={(event) =>
                                  setEditDraft((prev) => ({ ...prev, mode: event.target.value as ExerciseMode }))
                                }
                                className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                              >
                                <option value="set_reps">Hareket + set + tekrar</option>
                                <option value="duration">Hareket + duration</option>
                              </select>
                              {editDraft.mode === 'set_reps' ? (
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input
                                    type="number"
                                    min={1}
                                    value={editDraft.sets}
                                    onChange={(event) =>
                                      setEditDraft((prev) => ({ ...prev, sets: Number(event.target.value) }))
                                    }
                                    placeholder="Set"
                                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                                  />
                                  <input
                                    type="number"
                                    min={1}
                                    value={editDraft.reps}
                                    onChange={(event) =>
                                      setEditDraft((prev) => ({ ...prev, reps: Number(event.target.value) }))
                                    }
                                    placeholder="Tekrar"
                                    className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min={1}
                                  value={editDraft.durationMin}
                                  onChange={(event) =>
                                    setEditDraft((prev) => ({ ...prev, durationMin: Number(event.target.value) }))
                                  }
                                  placeholder="Duration (dk)"
                                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                                />
                              )}
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingItemKey(null)}
                                  className="rounded border border-slate-300 px-2 py-0.5 text-[11px] dark:border-slate-600"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateWorkoutItem(program.id, day, item.id, {
                                      title: editDraft.title,
                                      sets: editDraft.mode === 'set_reps' ? editDraft.sets : undefined,
                                      reps: editDraft.mode === 'set_reps' ? editDraft.reps : undefined,
                                      durationMin: editDraft.mode === 'duration' ? editDraft.durationMin : undefined
                                    });
                                    setEditingItemKey(null);
                                  }}
                                  className="rounded px-2 py-0.5 text-[11px] font-semibold text-white"
                                  style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2">
                              <label className="flex min-w-0 items-start gap-2">
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={() => onToggleWorkoutItem(program.id, day, item.id)}
                                />
                                <span className={item.completed ? 'line-through opacity-60' : ''}>
                                  {item.title}
                                  {hasSetRep ? ` • ${item.sets} set x ${item.reps} tekrar` : ''}
                                  {!hasSetRep && item.durationMin ? ` • ${item.durationMin} dk` : ''}
                                </span>
                              </label>

                              <details className="relative">
                                <summary className="cursor-pointer list-none rounded border border-slate-300 px-2 py-0.5 text-[11px] dark:border-slate-600">
                                  Edit
                                </summary>
                                <div className="absolute right-0 z-20 mt-1 w-32 rounded border border-slate-200 bg-[var(--card-color)] p-1 shadow-lg dark:border-slate-700">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItemKey(currentItemKey);
                                      setEditDraft({
                                        title: item.title,
                                        mode: hasSetRep ? 'set_reps' : 'duration',
                                        sets: item.sets ?? 3,
                                        reps: item.reps ?? 10,
                                        durationMin: item.durationMin ?? 30
                                      });
                                    }}
                                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    Edit item
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteWorkoutItem(program.id, day, item.id)}
                                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    Delete item
                                  </button>
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {openAddFormKey === dayKey(program.id, day) ? (
                    <div className="mt-2 space-y-1.5 rounded border border-slate-200 p-2 dark:border-slate-700">
                      <input
                        value={addDraft.title}
                        onChange={(event) => setAddDraft((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="Hareket"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                      />
                      <select
                        value={addDraft.mode}
                        onChange={(event) => setAddDraft((prev) => ({ ...prev, mode: event.target.value as ExerciseMode }))}
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                      >
                        <option value="set_reps">Hareket + set + tekrar</option>
                        <option value="duration">Hareket + duration</option>
                      </select>
                      {addDraft.mode === 'set_reps' ? (
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="number"
                            min={1}
                            value={addDraft.sets}
                            onChange={(event) => setAddDraft((prev) => ({ ...prev, sets: Number(event.target.value) }))}
                            placeholder="Set"
                            className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                          />
                          <input
                            type="number"
                            min={1}
                            value={addDraft.reps}
                            onChange={(event) => setAddDraft((prev) => ({ ...prev, reps: Number(event.target.value) }))}
                            placeholder="Tekrar"
                            className="rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                          />
                        </div>
                      ) : (
                        <input
                          type="number"
                          min={1}
                          value={addDraft.durationMin}
                          onChange={(event) =>
                            setAddDraft((prev) => ({ ...prev, durationMin: Number(event.target.value) }))
                          }
                          placeholder="Duration (dk)"
                          className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                        />
                      )}
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setOpenAddFormKey(null)}
                          className="rounded border border-slate-300 px-2 py-0.5 text-[11px] dark:border-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const normalizedTitle = addDraft.title.trim();
                            if (!normalizedTitle) return;
                            onAddWorkoutItem(program.id, day, {
                              title: normalizedTitle,
                              sets: addDraft.mode === 'set_reps' ? addDraft.sets : undefined,
                              reps: addDraft.mode === 'set_reps' ? addDraft.reps : undefined,
                              durationMin: addDraft.mode === 'duration' ? addDraft.durationMin : undefined
                            });
                            setAddDraft(emptyDraft());
                            setOpenAddFormKey(null);
                          }}
                          className="rounded px-2 py-0.5 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--on-secondary-color)' }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenAddFormKey(dayKey(program.id, day));
                        setAddDraft(emptyDraft());
                      }}
                      className="mt-2 rounded border border-slate-300 px-2 py-1 text-[11px] dark:border-slate-600"
                    >
                      + Add Exercise
                    </button>
                  )}
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
