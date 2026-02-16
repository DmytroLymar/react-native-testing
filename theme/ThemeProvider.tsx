import React from 'react';
import { useColorScheme } from 'react-native';
import { colors, type AppTheme, type ThemeColors } from './colors';

type ThemeContextValue = {
    theme: AppTheme;
    c: ThemeColors;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const scheme = useColorScheme();
    const theme: AppTheme = scheme === 'dark' ? 'dark' : 'light';

    const value = React.useMemo(() => ({ theme, c: colors[theme] as ThemeColors }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = React.useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
}
