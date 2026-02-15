export type AppTab =
  | 'dashboard'
  | 'books'
  | 'sports'
  | 'wishlists'
  | 'budget'
  | 'media'
  | 'settings';

type SidebarNavigationProps = {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
};

const items: Array<{ id: AppTab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'books', label: 'Books' },
  { id: 'sports', label: 'Sports' },
  { id: 'wishlists', label: 'Wish List' },
  { id: 'budget', label: 'Budget' },
  { id: 'media', label: 'Watch/Read Later' },
  { id: 'settings', label: 'Settings' }
];

const SidebarNavigation = ({ activeTab, onChangeTab }: SidebarNavigationProps) => {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-soft backdrop-blur-sm lg:max-w-[250px] dark:border-slate-700 dark:bg-surface-darkCard/85">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Life OS</p>
      <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:block lg:space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChangeTab(item.id)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition lg:text-left ${
              item.id === activeTab
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
