import ThemeCustomizer from './ThemeCustomizer';
import type { FontFamilyOption, LanguageOption, ThemeColors, ThemeMode } from '../types/habit';

type ThemeSelectorProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const dummyColors: ThemeColors = {
  primaryColor: '#ffffff',
  secondaryColor: '#7e73aa',
  backgroundColor: '#f7f4fb',
  panelColor: '#ffffff',
  cardColor: '#efeaf8'
};
const dummyFont: FontFamilyOption = 'system';
const dummyLanguage: LanguageOption = 'en';

const ThemeSelector = ({ mode, onChange }: ThemeSelectorProps) => {
  return (
    <ThemeCustomizer
      mode={mode}
      language={dummyLanguage}
      colors={dummyColors}
      fontFamily={dummyFont}
      onModeChange={onChange}
      onLanguageChange={() => {
        // legacy wrapper for compatibility
      }}
      onColorChange={() => {
        // legacy wrapper for compatibility
      }}
      onFontFamilyChange={() => {
        // legacy wrapper for compatibility
      }}
    />
  );
};

export default ThemeSelector;
