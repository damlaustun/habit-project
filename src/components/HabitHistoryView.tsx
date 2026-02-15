import type { HabitHistoryItem } from '../types/habit';

type HabitHistoryViewProps = {
  events: HabitHistoryItem[];
};

const HabitHistoryView = ({ events }: HabitHistoryViewProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-surface-darkCard">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Habit History</h3>
      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
        {events.slice(0, 30).map((event) => (
          <div key={event.id} className="rounded-md border border-slate-200 p-2 text-xs dark:border-slate-700">
            <p className="font-medium text-slate-700 dark:text-slate-200">{event.titleSnapshot}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {event.eventType.replace('_', ' ')} • {event.day.toUpperCase()} • {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

        {events.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No history yet.</p>
        ) : null}
      </div>
    </section>
  );
};

export default HabitHistoryView;
