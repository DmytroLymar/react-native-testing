import '@/notifications/setup'; // якщо винесеш handler в окремий файл
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Todos' }} />
            <Stack.Screen name='todo/[id]' options={{ title: 'Todo' }} />
        </Stack>
    );
}
