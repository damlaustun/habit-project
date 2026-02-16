import { useState } from 'react';
import GoalProgressBar from './GoalProgressBar';
import { useI18n } from '../i18n/useI18n';

type PointsHeaderProps = {
  totalPoints: number;
  dailyPoints: number;
  dailyGoal: number;
  level: number;
  levelProgress: {
    value: number;
    goal: number;
  };
  levelDetails: {
    taskCompleted: number;
    taskTotal: number;
    points: number;
    pointGoal: number;
    combinedPercent: number;
  };
  weekLabel: string;
  readOnly: boolean;
  userName: string;
  userAvatar: string;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
};

const PointsHeader = ({
  totalPoints,
  dailyPoints,
  dailyGoal,
  level,
  levelProgress,
  levelDetails,
  weekLabel,
  readOnly,
  userName,
  userAvatar,
  onOpenSettings,
  onOpenProfile,
  onLogout
}: PointsHeaderProps) => {
  const { t } = useI18n();
  const [levelOpen, setLevelOpen] = useState(false);
  const isAvatarImage = userAvatar.startsWith('data:image') || userAvatar.startsWith('http');

  return (
    <header className="animate-popIn rounded-2xl border border-slate-200 bg-[var(--panel-color)] p-5 shadow-soft dark:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {t('weeklyPlanner')}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{weekLabel}</h1>
          {readOnly ? (
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-300">
              {t('readOnlyWeek')}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            {t('settings')}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-50 text-sm dark:border-slate-600 dark:bg-slate-800">
              {isAvatarImage ? (
                <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
              ) : (
                userAvatar
              )}
            </span>
            <span>{userName}</span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLevelOpen((prev) => !prev);
              }}
              className="rounded-full border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Lv {level}
            </button>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-700 dark:text-rose-300"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {levelOpen ? (
        <section className="mt-3 rounded-xl border border-slate-200 bg-[var(--card-color)] p-3 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('levelMission')}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{t('levelMissionHint')}</p>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
              <div className="mb-1 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>{t('weekTaskProgress')}</span>
                <span>
                  {levelDetails.taskCompleted}/{levelDetails.taskTotal}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${levelDetails.taskTotal <= 0 ? 0 : Math.round((levelDetails.taskCompleted / levelDetails.taskTotal) * 100)}%`,
                    backgroundColor: 'var(--secondary-color)'
                  }}
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700">
              <div className="mb-1 flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>{t('weekPointProgress')}</span>
                <span>
                  {levelDetails.points}/{levelDetails.pointGoal}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${levelDetails.pointGoal <= 0 ? 0 : Math.min(100, Math.round((levelDetails.points / levelDetails.pointGoal) * 100))}%`,
                    backgroundColor: 'var(--secondary-color)'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--secondary-color)]/25 bg-[var(--secondary-color)]/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-color)]">{t('totalPoints')}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{totalPoints}</p>
        </div>

        <GoalProgressBar label={t('dailyGoalProgress')} value={dailyPoints} goal={dailyGoal} />
        <GoalProgressBar label={t('levelProgress')} value={levelProgress.value} goal={levelProgress.goal} unit="%" />
      </div>
    </header>
  );
};

export default PointsHeader;
