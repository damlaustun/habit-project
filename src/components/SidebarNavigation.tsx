import { useI18n } from '../i18n/useI18n';
import type { I18nKey } from '../i18n/translations';

type SidebarNavigationProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

const items: Array<{ path: string; labelKey: I18nKey }> = [
  { path: '/', labelKey: 'dashboard' },
  { path: '/books', labelKey: 'bookJournal' },
  { path: '/sports', labelKey: 'workoutPlanner' },
  { path: '/shopping', labelKey: 'shoppingLists' },
  { path: '/budget', labelKey: 'budgetPlanner' },
  { path: '/media', labelKey: 'watchReadLater' },
  { path: '/notes', labelKey: 'notes' }
];

const SidebarNavigation = ({ currentPath, onNavigate }: SidebarNavigationProps) => {
  const { t } = useI18n();

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-[var(--panel-color)] p-3 shadow-soft lg:max-w-[250px] dark:border-slate-700">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t('lifeOs')}</p>
      <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:block lg:space-y-1">
        {items.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => onNavigate(item.path)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition lg:text-left ${
              currentPath === item.path || (item.path === '/books' && currentPath.startsWith('/books/'))
                ? 'bg-[var(--secondary-color)] text-[var(--on-secondary-color)]'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
