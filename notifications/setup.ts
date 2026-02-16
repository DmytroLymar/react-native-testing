import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    })
});

export async function configureAndroidChannel() {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('todo', {
        name: 'Todo reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250]
    });
}

export async function ensureNotificationPermission() {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;

    const req = await Notifications.requestPermissionsAsync();
    return req.status === 'granted';
}
