import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import AddTaskModal from './components/AddTaskModal';
import AuthForm from './components/AuthForm';
import BookDetailPage from './components/BookDetailPage';
import BooksPage from './components/BooksPage';
import BudgetDashboard from './components/BudgetDashboard';
import MediaCollection from './components/MediaCollection';
import ModuleLayoutWrapper from './components/ModuleLayoutWrapper';
import PointsHeader from './components/PointsHeader';
import SettingsPanel from './components/SettingsPanel';
import SidebarNavigation from './components/SidebarNavigation';
import StatsBar from './components/StatsBar';
import UserProfilePanel from './components/UserProfilePanel';
import WeekRangeHeader from './components/WeekRangeHeader';
import WeeklyBoard from './components/WeeklyBoard';
import WishListManager from './components/WishListManager';
import WorkoutPlanner from './components/WorkoutPlanner';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { getCloudStateWeekLabel, useHabitStore } from './store/useHabitStore';
import type { FontFamilyOption, UserProfile } from './types/habit';
import { getCurrentMonthKey, getCurrentWeekId, getTodayDayId } from './utils/date';
import { getCompletedPointsForDay, getTaskCounts, getTotalCompletedPoints } from './utils/stats';

const getFontStack = (font: FontFamilyOption): string => {
  switch (font) {
    case 'inter':
      return "'Inter', 'Segoe UI', sans-serif";
    case 'poppins':
      return "'Poppins', 'Segoe UI', sans-serif";
    case 'roboto':
      return "'Roboto', 'Segoe UI', sans-serif";
    default:
      return "system-ui, -apple-system, 'Segoe UI', sans-serif";
  }
};

const App = () => {
  const [activeDayForModal, setActiveDayForModal] = useState<import('./types/habit').DayId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');

  const cloudHydratedRef = useRef(false);

  const {
    weeklyPlanner,
    habits,
    books,
    sports,
    shoppingLists,
    budget,
    mediaList,
    themeSettings,
    userProfile,
    userAuth,
    cloudRowId,

    setUserAuth,
    setCloudRowId,
    setUserProfile,
    exportCloudState,
    importCloudState,

    getCurrentWeek,
    isCurrentWeekReadOnly,
    setCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
    resetCurrentWeek,

    addHabit,
    updateHabit,
    toggleHabit,
    deleteHabit,
    updateHabitDuration,

    addPlannerItem,
    togglePlannerItem,
    deletePlannerItem,

    setThemeMode,
    setThemeColor,
    setFontFamily,
    setDailyGoal,
    setWeeklyGoal,
    setLockPastWeeks,

    addBook,
    logBookPages,
    updateBookNotes,
    addBookQuote,

    addWorkoutProgram,
    addWorkoutItem,
    toggleWorkoutItem,
    updateWorkoutItem,
    deleteWorkoutItem,
    clearWorkoutDay,

    addShoppingList,
    renameShoppingList,
    deleteShoppingList,
    addShoppingItem,
    toggleShoppingItem,

    setMonthlyIncome,
    addExpense,
    deleteExpense,

    addMediaItem,
    toggleMediaItem,
    deleteMediaItem
  } = useHabitStore();

  const currentWeek = useMemo(() => getCurrentWeek(), [getCurrentWeek, weeklyPlanner]);
  const totalPoints = useMemo(() => getTotalCompletedPoints(currentWeek), [currentWeek]);
  const taskCounts = useMemo(() => getTaskCounts(currentWeek), [currentWeek]);
  const dailyPoints = useMemo(() => getCompletedPointsForDay(currentWeek, getTodayDayId()), [currentWeek]);

  const isCurrentWeek = weeklyPlanner.currentWeekId === getCurrentWeekId();
  const readOnly = isCurrentWeekReadOnly();

  const currentBudgetMonth = budget.months[budget.currentMonthKey] ?? budget.months[getCurrentMonthKey()];
  const selectedBookId = currentPath.startsWith('/books/') ? decodeURIComponent(currentPath.slice('/books/'.length)) : null;
  const selectedBook = selectedBookId ? books.entries.find((book) => book.id === selectedBookId) : null;
  const displayPath =
    currentPath === '/' ||
    currentPath === '/books' ||
    currentPath === '/sports' ||
    currentPath === '/shopping' ||
    currentPath === '/budget' ||
    currentPath === '/media' ||
    currentPath.startsWith('/books/')
      ? currentPath
      : '/';

  const cloudStatePayload = useMemo(
    () => exportCloudState(),
    [exportCloudState, weeklyPlanner, habits, books, sports, shoppingLists, budget, mediaList, userProfile, themeSettings]
  );

  const navigate = (path: string) => {
    if (window.location.pathname === path) {
      setCurrentPath(path);
      return;
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (currentPath === '/wishlists') {
      navigate('/shopping');
    }
  }, [currentPath]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.colors.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.colors.secondaryColor);
    root.style.setProperty('--app-background', themeSettings.colors.backgroundColor);
    root.style.setProperty('--panel-color', themeSettings.colors.panelColor);
    root.style.setProperty('--card-color', themeSettings.colors.cardColor);
    root.style.setProperty('--app-font-family', getFontStack(themeSettings.fontFamily));

    if (themeSettings.mode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () => root.classList.toggle('dark', media.matches);
      apply();
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }

    root.classList.toggle('dark', themeSettings.mode === 'dark');
    return undefined;
  }, [themeSettings]);

  const hydrateForUser = async (user: User) => {
    setUserAuth({ status: 'signed_in', userId: user.id, email: user.email ?? null });

    const metadata = user.user_metadata ?? {};
    setUserProfile({
      name: typeof metadata.display_name === 'string' ? metadata.display_name : undefined,
      avatar:
        typeof metadata.avatar_url === 'string'
          ? metadata.avatar_url
          : typeof metadata.avatar === 'string'
            ? metadata.avatar
            : undefined
    });

    const sb = supabase;
    if (!sb) {
      cloudHydratedRef.current = true;
      return;
    }

    setSyncStatus('Loading cloud state...');

    const { data, error } = await sb
      .from('weekly_plans')
      .select('id, data')
      .eq('user_id', user.id)
      .eq('week_label', getCloudStateWeekLabel())
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      importCloudState({});
      setSyncStatus('Cloud read failed, local active');
      cloudHydratedRef.current = true;
      return;
    }

    setCloudRowId(data?.id ?? null);

    if (data?.data) {
      importCloudState(data.data as Partial<typeof cloudStatePayload>);
    } else {
      importCloudState({});
    }

    cloudHydratedRef.current = true;
    setSyncStatus('Cloud synced');
  };

  useEffect(() => {
    const sb = supabase;
    if (!isSupabaseConfigured || !sb) {
      setUserAuth({ status: 'signed_out', userId: null, email: null });
      setSyncStatus('Supabase not configured');
      return;
    }

    let cancelled = false;

    const init = async () => {
      setUserAuth({ status: 'loading', userId: null, email: null });
      const { data } = await sb.auth.getSession();

      if (cancelled) {
        return;
      }

      if (data.session?.user) {
        await hydrateForUser(data.session.user);
      } else {
        setUserAuth({ status: 'signed_out', userId: null, email: null });
        setSyncStatus('Signed out');
        importCloudState({});
        cloudHydratedRef.current = false;
      }
    };

    void init();

    const { data: listener } = sb.auth.onAuthStateChange((_, session) => {
      const user = session?.user;
      if (user) {
        void hydrateForUser(user);
      } else {
        setUserAuth({ status: 'signed_out', userId: null, email: null });
        setCloudRowId(null);
        importCloudState({});
        cloudHydratedRef.current = false;
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [importCloudState, setCloudRowId, setUserAuth, setUserProfile]);

  useEffect(() => {
    const sb = supabase;
    if (!sb || userAuth.status !== 'signed_in' || !userAuth.userId || !cloudHydratedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setSyncStatus('Saving...');

      if (cloudRowId) {
        const { error } = await sb
          .from('weekly_plans')
          .update({ data: cloudStatePayload, updated_at: new Date().toISOString() })
          .eq('id', cloudRowId);

        if (error) {
          setSyncStatus('Cloud save failed');
          return;
        }

        setSyncStatus('Saved');
        return;
      }

      const { data, error } = await sb
        .from('weekly_plans')
        .insert({
          user_id: userAuth.userId,
          week_label: getCloudStateWeekLabel(),
          data: cloudStatePayload
        })
        .select('id')
        .single();

      if (error) {
        setSyncStatus('Cloud save failed');
        return;
      }

      setCloudRowId(data.id);
      setSyncStatus('Saved');
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [cloudRowId, cloudStatePayload, setCloudRowId, userAuth.status, userAuth.userId]);

  const handleLogin = async (email: string, password: string) => {
    if (!supabase) {
      setAuthError('Supabase is not configured');
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setAuthNotice(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthNotice('Logged in');
    }
    setAuthBusy(false);
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    if (!supabase) {
      setAuthError('Supabase is not configured');
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setAuthNotice(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name || 'New User',
          avatar: '🙂'
        }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setAuthNotice('Account created. Check email if confirmation is enabled.');
    }

    setAuthBusy(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const handleProfileSave = async (patch: Partial<UserProfile>) => {
    setUserProfile(patch);

    if (!supabase || userAuth.status !== 'signed_in') {
      return;
    }

    await supabase.auth.updateUser({
      data: {
        display_name: patch.name,
        avatar: patch.avatar,
        avatar_url: patch.avatar
      }
    });
  };

  if (userAuth.status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-background)]">
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading...</p>
      </main>
    );
  }

  if (userAuth.status !== 'signed_in') {
    return (
      <AuthForm
        busy={authBusy}
        errorMessage={authError}
        noticeMessage={authNotice}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[var(--app-background)] px-4 py-6 text-slate-900 transition-all duration-500 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-4 lg:flex-row">
        <SidebarNavigation currentPath={displayPath} onNavigate={navigate} />

        <div className="min-w-0 flex-1 space-y-4">
          <PointsHeader
            totalPoints={totalPoints}
            dailyPoints={dailyPoints}
            dailyGoal={habits.dailyGoal}
            weeklyGoal={habits.weeklyGoal}
            weekLabel={weeklyPlanner.currentWeekLabel}
            readOnly={readOnly}
            userName={userProfile.name}
            userAvatar={userProfile.avatar}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenProfile={() => setProfileOpen(true)}
            onLogout={() => void handleLogout()}
          />

          {displayPath === '/' ? (
            <ModuleLayoutWrapper
              title="Dashboard"
              subtitle="Daily habits and weekly agenda, organized day by day"
              actions={<span className="text-xs text-slate-500">Sync: {syncStatus}</span>}
            >
              <div className="space-y-3">
                <WeekRangeHeader
                  weekId={weeklyPlanner.currentWeekId}
                  weekLabel={weeklyPlanner.currentWeekLabel}
                  isCurrentWeek={isCurrentWeek}
                  onPrevious={goToPreviousWeek}
                  onNext={goToNextWeek}
                  onWeekPick={setCurrentWeek}
                />

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Habit progress: {taskCounts.completed}/{taskCounts.total} ({taskCounts.percent}%)
                  </span>
                  <button
                    type="button"
                    onClick={resetCurrentWeek}
                    disabled={readOnly}
                    className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-600"
                  >
                    Reset Week
                  </button>
                </div>

                <StatsBar completed={taskCounts.completed} total={taskCounts.total} percent={taskCounts.percent} />

                <WeeklyBoard
                  plan={currentWeek}
                  readOnly={readOnly}
                  onAddHabitClick={setActiveDayForModal}
                  onToggleHabit={toggleHabit}
                  onDeleteHabit={deleteHabit}
                  onUpdateHabit={updateHabit}
                  onUpdateHabitDuration={updateHabitDuration}
                  onAddPlannerItem={addPlannerItem}
                  onTogglePlannerItem={togglePlannerItem}
                  onDeletePlannerItem={deletePlannerItem}
                />
              </div>
            </ModuleLayoutWrapper>
          ) : null}

          {displayPath === '/books' ? (
            <ModuleLayoutWrapper title="Books" subtitle="Reading plans and progress">
              <BooksPage
                books={books.entries}
                onAddBook={addBook}
                onOpenBook={(bookId) => navigate(`/books/${encodeURIComponent(bookId)}`)}
              />
            </ModuleLayoutWrapper>
          ) : null}

          {selectedBook ? (
            <ModuleLayoutWrapper title="Book Detail" subtitle="Progress, notes, quotes, and page logs">
              <BookDetailPage
                book={selectedBook}
                onBack={() => navigate('/books')}
                onLogPages={logBookPages}
                onUpdateNotes={updateBookNotes}
                onAddQuote={addBookQuote}
              />
            </ModuleLayoutWrapper>
          ) : displayPath.startsWith('/books/') ? (
            <ModuleLayoutWrapper title="Book Detail" subtitle="This book could not be found">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
              >
                Back to books
              </button>
            </ModuleLayoutWrapper>
          ) : null}

          {displayPath === '/sports' ? (
            <ModuleLayoutWrapper title="Sports" subtitle="Plan workout programs by day and track completion">
              <WorkoutPlanner
                programs={sports.programs}
                onAddProgram={addWorkoutProgram}
                onAddWorkoutItem={addWorkoutItem}
                onToggleWorkoutItem={toggleWorkoutItem}
                onUpdateWorkoutItem={updateWorkoutItem}
                onDeleteWorkoutItem={deleteWorkoutItem}
                onClearWorkoutDay={clearWorkoutDay}
              />
            </ModuleLayoutWrapper>
          ) : null}

          {displayPath === '/shopping' ? (
            <ModuleLayoutWrapper title="Shopping Lists" subtitle="Groceries and purchase tracking">
              <WishListManager
                lists={shoppingLists.lists}
                onAddList={addShoppingList}
                onRenameList={renameShoppingList}
                onDeleteList={deleteShoppingList}
                onAddItem={addShoppingItem}
                onToggleItem={toggleShoppingItem}
              />
            </ModuleLayoutWrapper>
          ) : null}

          {displayPath === '/budget' ? (
            <ModuleLayoutWrapper title="Budget" subtitle="Track income, expenses, and remaining balance">
              {currentBudgetMonth ? (
                <BudgetDashboard
                  month={currentBudgetMonth}
                  onSetIncome={setMonthlyIncome}
                  onAddExpense={addExpense}
                  onDeleteExpense={deleteExpense}
                />
              ) : null}
            </ModuleLayoutWrapper>
          ) : null}

          {displayPath === '/media' ? (
            <ModuleLayoutWrapper title="Watch / Read Later" subtitle="Movies, TV shows, and books to consume later">
              <MediaCollection
                items={mediaList.items}
                onAddItem={addMediaItem}
                onToggleItem={toggleMediaItem}
                onDeleteItem={deleteMediaItem}
              />
            </ModuleLayoutWrapper>
          ) : null}
        </div>
      </div>

      <AddTaskModal
        day={activeDayForModal}
        onClose={() => setActiveDayForModal(null)}
        onSubmit={addHabit}
        disabled={readOnly}
      />

      <SettingsPanel
        open={settingsOpen}
        themeMode={themeSettings.mode}
        themeColors={themeSettings.colors}
        fontFamily={themeSettings.fontFamily}
        dailyGoal={habits.dailyGoal}
        weeklyGoal={habits.weeklyGoal}
        lockPastWeeks={habits.lockPastWeeks}
        onClose={() => setSettingsOpen(false)}
        onThemeModeChange={setThemeMode}
        onThemeColorChange={setThemeColor}
        onFontFamilyChange={setFontFamily}
        onDailyGoalChange={setDailyGoal}
        onWeeklyGoalChange={setWeeklyGoal}
        onLockPastWeeksChange={setLockPastWeeks}
      />

      <UserProfilePanel
        open={profileOpen}
        email={userAuth.email}
        profile={userProfile}
        onClose={() => setProfileOpen(false)}
        onSave={handleProfileSave}
      />
    </main>
  );
};

export default App;
