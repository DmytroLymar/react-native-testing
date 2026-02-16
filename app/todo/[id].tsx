import { useTodosStorage } from '@/hooks/useTodosStorage';
import { cancelTodoNotification, scheduleTodoNotification } from '@/notifications';
import { useTheme } from '@/theme/ThemeProvider';
import { t } from '@/theme/tokens';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

function formatDateTime(d: Date) {
    return d.toLocaleString();
}

export default function TodoDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const todoId = String(id ?? '');

    const { c } = useTheme();
    const styles = React.useMemo(() => makeStyles(c), [c]);

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

    if (isLoading) return <Text style={styles.centerText}>Loading...</Text>;
    if (!todo) return <Text style={styles.centerText}>Todo not found</Text>;

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

        router.back();
    };

    const onClearPlanned = async () => {
        if (todo.notificationId) {
            await cancelTodoNotification(todo.notificationId);
        }

        setPlannedDate(null);
        updateTodo(todoId, { plannedAt: null, notificationId: null });
    };

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
        setShowDate(true);
    };

    const saveDisabled = !title.trim();

    return (
        <View style={styles.container}>
            <Text style={styles.meta}>Created: {new Date(todo.createdAt).toLocaleString()}</Text>

            <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholder='Title'
                placeholderTextColor={c.muted}
            />

            <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textarea]}
                placeholder='Description'
                placeholderTextColor={c.muted}
                multiline
            />

            <View style={styles.plannedRow}>
                <Text style={styles.plannedLabel}>Planned:</Text>

                <Pressable style={styles.plannedButton} onPress={openPicker}>
                    <Text style={styles.plannedText}>
                        {plannedDate ? formatDateTime(plannedDate) : 'Set date & time'}
                    </Text>
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
                    onChange={(_e, d) => {
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
                <Button title='Save' onPress={onSave} disabled={saveDisabled} />
            </View>
        </View>
    );
}

const makeStyles = (c: ReturnType<typeof useTheme>['c']) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: t.space.lg,
            gap: t.space.md,
            backgroundColor: c.bg
        },
        centerText: { padding: t.space.lg, color: c.text },

        meta: { fontSize: t.font.sm, color: c.muted },

        input: {
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.inputBg,
            borderRadius: t.radius.md,
            paddingHorizontal: t.space.md,
            paddingVertical: t.space.sm,
            fontSize: t.font.lg,
            color: c.text
        },
        textarea: { minHeight: 110, textAlignVertical: 'top' },

        plannedRow: { flexDirection: 'row', alignItems: 'center', gap: t.space.sm },
        plannedLabel: { width: 72, color: c.muted },

        plannedButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.inputBg,
            borderRadius: t.radius.md,
            paddingHorizontal: t.space.md,
            paddingVertical: t.space.sm
        },
        plannedText: { color: c.text },

        clearBtn: { paddingHorizontal: t.space.sm, paddingVertical: 8 },
        clearText: { color: c.danger, fontWeight: '700' },

        actions: { flexDirection: 'row', justifyContent: 'space-between', gap: t.space.md }
    });
