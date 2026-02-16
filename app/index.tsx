import { TodoFilter, TodoStatusFilter } from '@/components/TodoFilter';
import { TodoInput } from '@/components/TodoInput';
import { TodoItem } from '@/components/TodoItem';
import { useTodosStorage } from '@/hooks/useTodosStorage';
import { cancelTodoNotification, scheduleTodoNotification } from '@/notifications';
import { useTheme } from '@/theme/ThemeProvider';
import { t } from '@/theme/tokens';
import type { Todo } from '@/types/todo';
import React from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function makeId() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function HomeScreen() {
    const { c } = useTheme();
    const styles = React.useMemo(() => makeStyles(c), [c]);

    const [text, setText] = React.useState('');
    const { todos, setTodos, isLoading } = useTodosStorage();

    const [query, setQuery] = React.useState('');
    const [status, setStatus] = React.useState<TodoStatusFilter>('all');

    const addTodo = React.useCallback(() => {
        const title = text.trim();
        if (!title) return;

        const newTodo: Todo = {
            id: makeId(),
            title,
            done: false,
            createdAt: new Date().toISOString(),
            description: '',
            plannedAt: null,
            notificationId: null
        };

        setTodos((prev) => [newTodo, ...prev]);
        setText('');
        Keyboard.dismiss();
    }, [text, setTodos]);

    const handleToggleTodo = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        const nextDone = !todo.done;

        if (nextDone && todo.notificationId) {
            await cancelTodoNotification(todo.notificationId);
        }

        let newNotificationId = todo.notificationId ?? null;

        if (nextDone) {
            newNotificationId = null;
        } else if (todo.plannedAt) {
            const when = new Date(todo.plannedAt);
            newNotificationId = await scheduleTodoNotification({
                title: `Todo: ${todo.title}`,
                body: todo.description?.trim() || 'Time to do it',
                when
            });
        }

        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: nextDone, notificationId: newNotificationId } : t))
        );
    };

    const handleDeleteTodo = async (id: string) => {
        const todo = todos.find((t) => t.id === id);

        if (todo?.notificationId) {
            await cancelTodoNotification(todo.notificationId);
        }

        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const filteredTodos = React.useMemo(() => {
        const q = query.trim().toLowerCase();

        return todos.filter((todo) => {
            const byText =
                !q || todo.title.toLowerCase().includes(q) || (todo.description ?? '').toLowerCase().includes(q);

            const byStatus = status === 'all' ? true : status === 'done' ? todo.done : !todo.done;

            return byText && byStatus;
        });
    }, [todos, query, status]);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <TodoInput value={text} onChange={setText} onAdd={addTodo} />

                {isLoading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <>
                        <TodoFilter query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />

                        <FlatList
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            data={filteredTodos}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TodoItem item={item} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first one 👇</Text>}
                            keyboardShouldPersistTaps='handled'
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const makeStyles = (c: ReturnType<typeof useTheme>['c']) =>
    StyleSheet.create({
        safe: { flex: 1, backgroundColor: c.bg },
        container: { flex: 1, padding: t.space.lg, gap: t.space.md, backgroundColor: c.bg },

        loaderWrap: { paddingTop: t.space.lg },

        list: { marginTop: t.space.sm },
        listContent: { paddingBottom: t.space.lg },

        separator: { height: t.space.sm },

        empty: { marginTop: t.space.md, color: c.muted, fontSize: t.font.lg }
    });
