import ThemeCustomizer from './ThemeCustomizer';
import type { FontFamilyOption, ThemeColors, ThemeMode } from '../types/habit';

type ThemeSelectorProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const dummyColors: ThemeColors = {
  primaryColor: '#ffffff',
  secondaryColor: '#7e73aa',
  backgroundColor: '#f7f4fb',
  cardColor: '#efeaf8'
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
