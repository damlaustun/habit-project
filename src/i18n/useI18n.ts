import { useHabitStore } from '../store/useHabitStore';
import { translate } from './translations';

export const useI18n = () => {
  const language = useHabitStore((state) => state.themeSettings.language);
  const t = (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
    translate(language, key, params);

  return { language, t };
};

