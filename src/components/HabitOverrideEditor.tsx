type HabitOverrideEditorProps = {
  isRecurring: boolean;
  isOverride: boolean;
};

const HabitOverrideEditor = ({ isRecurring, isOverride }: HabitOverrideEditorProps) => {
  if (!isRecurring) {
    return null;
  }

  return (
    <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      <span className="rounded border border-slate-300 px-1.5 py-0.5 dark:border-slate-600">Recurring</span>
      {isOverride ? (
        <span className="rounded border border-[var(--secondary-color)]/40 bg-[var(--secondary-color)]/15 px-1.5 py-0.5 text-[var(--primary-color)]">
          Day Override
        </span>
      ) : null}
    </div>
  );
};

export default HabitOverrideEditor;
