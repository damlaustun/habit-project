import ThemeCustomizer from './ThemeCustomizer';
import type { ThemeColors, ThemeMode } from '../types/habit';

type ThemeSelectorProps = {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const dummyColors: ThemeColors = {
  primaryColor: '#0f766e',
  secondaryColor: '#0ea5a3',
  backgroundColor: '#f6f7f9'
};

const ThemeSelector = ({ mode, onChange }: ThemeSelectorProps) => {
  return (
    <ThemeCustomizer
      mode={mode}
      colors={dummyColors}
      onModeChange={onChange}
      onColorChange={() => {
        // legacy wrapper for compatibility
      }}
    />
  );
};

export default ThemeSelector;
