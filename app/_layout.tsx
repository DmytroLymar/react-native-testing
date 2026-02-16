import '@/notifications/setup';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

function RootStack() {
    const { theme, c } = useTheme();

    return (
        <>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: c.card },
                    headerTintColor: c.text,
                    contentStyle: { backgroundColor: c.bg }
                }}
            >
                <Stack.Screen name='index' options={{ title: 'To-Do' }} />
                <Stack.Screen name='todo/[id]' options={{ title: 'Todo' }} />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootStack />
        </ThemeProvider>
    );
}
