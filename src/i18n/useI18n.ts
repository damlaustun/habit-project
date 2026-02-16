import type { LanguageOption } from '../types/habit';
import { translate } from './translations';

export const useI18n = () => {
  const language: LanguageOption = 'en';
  const t = (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
    translate(language, key, params);

  return { language, t };
};
