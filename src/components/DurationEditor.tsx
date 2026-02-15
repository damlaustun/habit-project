import { useEffect, useState } from 'react';

type DurationEditorProps = {
  targetDurationMin?: number;
  completedDurationMin: number;
  readOnly?: boolean;
  onChange: (value: number) => void;
};

const DurationEditor = ({
  targetDurationMin,
  completedDurationMin,
  readOnly,
  onChange
}: DurationEditorProps) => {
  const [value, setValue] = useState(completedDurationMin);

  useEffect(() => {
    setValue(completedDurationMin);
  }, [completedDurationMin]);

  if ((targetDurationMin ?? 0) <= 0 && completedDurationMin <= 0) {
    return null;
  }

  const target = targetDurationMin ?? 0;
  const progress = target > 0 ? Math.min(100, Math.round((completedDurationMin / target) * 100)) : 0;

  return (
    <div className="mt-2 rounded-md border border-slate-200 p-2 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Duration: {completedDurationMin} / {target > 0 ? target : '-'} min
        </span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          onBlur={() => onChange(Math.max(0, Math.round(value)))}
          disabled={readOnly}
          className="w-16 rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-600 dark:bg-slate-900"
        />
      </div>
      {target > 0 ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded transition-all"
            style={{ width: `${progress}%`, backgroundColor: 'var(--secondary-color)' }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DurationEditor;
