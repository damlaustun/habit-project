import { useState } from 'react';
import type { DayId, PlannerItem } from '../types/habit';

type PlannerSectionProps = {
  day: DayId;
  agenda: PlannerItem[];
  readOnly?: boolean;
  onAddPlannerItem: (day: DayId, input: { title: string; description?: string; eventTime?: string }) => void;
  onTogglePlannerItem: (day: DayId, itemId: string) => void;
  onDeletePlannerItem: (day: DayId, itemId: string) => void;
};

const PlannerSection = ({
  day,
  agenda,
  readOnly,
  onAddPlannerItem,
  onTogglePlannerItem,
  onDeletePlannerItem
}: PlannerSectionProps) => {
  const [title, setTitle] = useState('');
  const [eventTime, setEventTime] = useState('');

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Weekly Planner / Agenda</h4>

      <form
        className="mb-3 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const value = title.trim();
          if (!value) {
            return;
          }
          onAddPlannerItem(day, { title: value, eventTime: eventTime || undefined });
          setTitle('');
          setEventTime('');
        }}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add agenda item"
          disabled={readOnly}
          className="min-w-[180px] flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <input
          type="time"
          value={eventTime}
          onChange={(event) => setEventTime(event.target.value)}
          disabled={readOnly}
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={readOnly}
          className="rounded-md px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--secondary-color)' }}
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {agenda.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-slate-200 px-2 py-2 text-sm dark:border-slate-700"
          >
            <div className="flex items-start justify-between gap-2">
              <label className="flex min-w-0 items-start gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onTogglePlannerItem(day, item.id)}
                  disabled={readOnly}
                />
                <span className={item.completed ? 'line-through opacity-60' : ''}>{item.title}</span>
              </label>

              <div className="flex items-center gap-2">
                {item.eventTime ? (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.eventTime}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDeletePlannerItem(day, item.id)}
                  disabled={readOnly}
                  className="text-xs text-rose-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {agenda.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
            No agenda items yet.
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default PlannerSection;
