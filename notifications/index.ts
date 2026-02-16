import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ensureNotificationPermission, configureAndroidChannel } from '@/notifications/setup';

export async function scheduleTodoNotification(args: { title: string; body?: string; when: Date }) {
    const diff = args.when.getTime() - Date.now();
    if (diff <= 0) return null;

    const ok = await ensureNotificationPermission();
    if (!ok) return null;

    await configureAndroidChannel();

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: args.title,
            body: args.body ?? 'Planned time is due',
            sound: 'default',
            ...(Platform.OS === 'android' ? { channelId: 'todo' } : {})
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: args.when
        }
    });

    return id;
}

export async function cancelTodoNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}
