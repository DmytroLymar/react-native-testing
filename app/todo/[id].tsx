import { useTodosStorage } from '@/hooks/useTodosStorage';
import { cancelTodoNotification, scheduleTodoNotification } from '@/notifications';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

function formatDateTime(d: Date) {
    return d.toLocaleString(); // можеш замінити на більш строгий формат
}

export default function TodoDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const todoId = String(id ?? '');

    const { isLoading, getTodoById, updateTodo } = useTodosStorage();
    const todo = getTodoById(todoId);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [plannedDate, setPlannedDate] = React.useState<Date | null>(null);

    const [showDate, setShowDate] = React.useState(false);
    const [showTime, setShowTime] = React.useState(false);

    React.useEffect(() => {
        if (!todo) return;
        setTitle(todo.title);
        setDescription(todo.description ?? '');
        setPlannedDate(todo.plannedAt ? new Date(todo.plannedAt) : null);
    }, [todo?.id]);

    if (isLoading) return <Text>Loading...</Text>;
    if (!todo) return <Text>Todo not found</Text>;

    const onSave = async () => {
        const nextTitle = title.trim();
        if (!nextTitle) return;

        if (todo.notificationId) {
            await cancelTodoNotification(todo.notificationId);
        }

        let newNotificationId: string | null = null;

        if (plannedDate && !todo.done && plannedDate.getTime() > Date.now()) {
            newNotificationId = await scheduleTodoNotification({
                title: `Todo: ${nextTitle}`,
                body: description.trim() || 'Time to do it',
                when: plannedDate
            });
        }

        updateTodo(todoId, {
            title: nextTitle,
            description: description.trim(),
            plannedAt: plannedDate ? plannedDate.toISOString() : null,
            notificationId: newNotificationId
        });

        router.replace('/');
    };

    const onClearPlanned = () => setPlannedDate(null);

    const onChangeDate = (_event: DateTimePickerEvent, selected?: Date) => {
        if (Platform.OS === 'android') setShowDate(false);

        if (!selected) return;

        const base = plannedDate ?? new Date();
        const next = new Date(base);
        next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
        setPlannedDate(next);

        if (Platform.OS === 'android') setShowTime(true);
    };

    const onChangeTime = (_event: DateTimePickerEvent, selected?: Date) => {
        if (Platform.OS === 'android') setShowTime(false);

        if (!selected) return;

        const base = plannedDate ?? new Date();
        const next = new Date(base);
        next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
        setPlannedDate(next);
    };

    const openPicker = () => {
        if (!plannedDate) setPlannedDate(new Date());

        if (Platform.OS === 'ios') {
            setShowDate(true);
        } else {
            setShowDate(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.meta}>Created: {new Date(todo.createdAt).toLocaleString()}</Text>

            <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder='Title' />

            <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textarea]}
                placeholder='Description'
                multiline
            />

            <View style={styles.plannedRow}>
                <Text style={styles.plannedLabel}>Planned:</Text>

                <Pressable style={styles.plannedButton} onPress={openPicker}>
                    <Text>{plannedDate ? formatDateTime(plannedDate) : 'Set date & time'}</Text>
                </Pressable>

                <Pressable style={styles.clearBtn} onPress={onClearPlanned}>
                    <Text style={styles.clearText}>Clear</Text>
                </Pressable>
            </View>

            {Platform.OS === 'ios' && showDate && (
                <DateTimePicker
                    value={plannedDate ?? new Date()}
                    mode='datetime'
                    display='spinner'
                    onChange={(e, d) => {
                        if (d) setPlannedDate(d);
                    }}
                />
            )}

            {Platform.OS === 'android' && showDate && (
                <DateTimePicker
                    value={plannedDate ?? new Date()}
                    mode='date'
                    display='default'
                    onChange={onChangeDate}
                />
            )}

            {Platform.OS === 'android' && showTime && (
                <DateTimePicker
                    value={plannedDate ?? new Date()}
                    mode='time'
                    display='default'
                    onChange={onChangeTime}
                />
            )}

            <View style={styles.actions}>
                <Button title='Cancel' onPress={() => router.back()} />
                <Button title='Save' onPress={onSave} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
    meta: { fontSize: 12, opacity: 0.7 },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16
    },
    textarea: { minHeight: 100, textAlignVertical: 'top' },

    plannedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    plannedLabel: { width: 70, opacity: 0.8 },
    plannedButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12
    },
    clearBtn: { paddingHorizontal: 10, paddingVertical: 8 },
    clearText: { color: '#d00' },

    actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }
});
