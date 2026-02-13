import { TodoFilter, TodoStatusFilter } from '@/components/TodoFilter';
import { TodoInput } from '@/components/TodoInput';
import { TodoItem } from '@/components/TodoItem';
import { useTodosStorage } from '@/hooks/useTodosStorage';
import type { Todo } from '@/types/todo';
import React from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function makeId() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function HomeScreen() {
    const [text, setText] = React.useState('');
    const { todos, setTodos, isLoading } = useTodosStorage();
    const [query, setQuery] = React.useState('');
    const [status, setStatus] = React.useState<TodoStatusFilter>('all');

    const addTodo = React.useCallback(() => {
        const title = text.trim();
        if (!title) return;

        const newTodo: Todo = { id: makeId(), title, done: false };
        setTodos((prev) => [newTodo, ...prev]);
        setText('');
        Keyboard.dismiss();
    }, [text]);

    const handleToggleTodo = (id: string) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };
    const handleDeleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const filteredTodos = React.useMemo(() => {
        const q = query.trim().toLowerCase();

        return todos.filter((t) => {
            const byText = !q || t.title.toLowerCase().includes(q);

            const byStatus = status === 'all' ? true : status === 'done' ? t.done : !t.done;

            return byText && byStatus;
        });
    }, [todos, query, status]);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.title}>To-Do</Text>

                <TodoInput value={text} onChange={setText} onAdd={addTodo} />
                {isLoading ? (
                    <View style={{ paddingTop: 16 }}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <>
                        <TodoFilter query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />
                        <FlatList
                            style={styles.list}
                            data={filteredTodos}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TodoItem item={item} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
                            )}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                            ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first one 👇</Text>}
                            keyboardShouldPersistTaps='handled'
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, padding: 16, gap: 12 },
    title: { fontSize: 28, fontWeight: '700' },
    list: { marginTop: 8 },
    empty: { marginTop: 12, opacity: 0.6, fontSize: 16 }
});
