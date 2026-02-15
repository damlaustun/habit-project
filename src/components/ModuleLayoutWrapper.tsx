import type { ReactNode } from 'react';

type ModuleLayoutWrapperProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const ModuleLayoutWrapper = ({ title, subtitle, actions, children }: ModuleLayoutWrapperProps) => {
  return (
    <section className="animate-slideIn rounded-2xl border border-slate-200 bg-[var(--card-color)]/90 p-4 shadow-soft backdrop-blur-sm dark:border-slate-700">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        {actions}
      </div>

      {children}
    </section>
  );
};

export default ModuleLayoutWrapper;
