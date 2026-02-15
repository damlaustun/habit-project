import ThemeCustomizer from './ThemeCustomizer';
import type { FontFamilyOption, ThemeColors, ThemeMode } from '../types/habit';

type ThemeSelectorProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const dummyColors: ThemeColors = {
  primaryColor: '#0f766e',
  secondaryColor: '#0ea5a3',
  backgroundColor: '#f6f7f9',
  cardColor: '#ffffff'
};
const dummyFont: FontFamilyOption = 'system';

const ThemeSelector = ({ mode, onChange }: ThemeSelectorProps) => {
  return (
    <ThemeCustomizer
      mode={mode}
      colors={dummyColors}
      fontFamily={dummyFont}
      onModeChange={onChange}
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
