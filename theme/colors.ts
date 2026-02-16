export const colors = {
    light: {
        bg: '#ffffff',
        card: '#ffffff',
        text: '#111111',
        muted: '#6b7280',
        border: '#e5e7eb',
        danger: '#ef4444',
        inputBg: '#ffffff'
    },
    dark: {
        bg: '#0b0f19',
        card: '#121829',
        text: '#f9fafb',
        muted: '#9ca3af',
        border: '#243041',
        danger: '#f87171',
        inputBg: '#0f172a'
    }
} as const;

export type AppTheme = keyof typeof colors;
export type ThemeColors = (typeof colors)['light'];
