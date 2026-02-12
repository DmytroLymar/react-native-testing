import { useTodosStorage } from '@/hooks/useTodosStorage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TodoDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const todoId = String(id ?? '');

    const { isLoading, getTodoById, updateTodo } = useTodosStorage();

    const todo = getTodoById(todoId);

    const [title, setTitle] = React.useState('');

    React.useEffect(() => {
        if (todo) setTitle(todo.title);
    }, [todo?.id, todo?.title]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!todo) {
        return (
            <View style={styles.center}>
                <Text>Todo not found</Text>
            </View>
        );
    }

    const onSave = () => {
        const next = title.trim();
        if (!next) return; // можеш тут показати alert/toast
        updateTodo(todoId, { title: next });
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit todo</Text>

            <TextInput value={title} onChangeText={setTitle} placeholder='Todo title' style={styles.input} autoFocus />

            <View style={styles.actions}>
                <Button title='Cancel' onPress={() => router.push('/')} />
                <Button title='Save' onPress={onSave} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, padding: 16, gap: 12 },
    label: { fontSize: 18, fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    },
    actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }
});
