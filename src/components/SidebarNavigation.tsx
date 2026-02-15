type SidebarNavigationProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

const items: Array<{ path: string; label: string }> = [
  { path: '/', label: 'Dashboard' },
  { path: '/books', label: 'Books' },
  { path: '/sports', label: 'Sports' },
  { path: '/shopping', label: 'Shopping Lists' },
  { path: '/budget', label: 'Budget' },
  { path: '/media', label: 'Watch/Read Later' }
];

const SidebarNavigation = ({ currentPath, onNavigate }: SidebarNavigationProps) => {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-soft backdrop-blur-sm lg:max-w-[250px] dark:border-slate-700 dark:bg-surface-darkCard/85">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Life OS</p>
      <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:block lg:space-y-1">
        {items.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => onNavigate(item.path)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition lg:text-left ${
              currentPath === item.path || (item.path === '/books' && currentPath.startsWith('/books/'))
                ? 'bg-[var(--secondary-color)] text-white'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
