import { loadTodos, saveTodos } from '@/storage/todoStorage';
import { Todo } from '@/types/todo';
import { useEffect, useRef, useState } from 'react';

export function useTodosStorage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const hydratedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const stored = await loadTodos();
                if (!cancelled) setTodos(stored);
            } finally {
                if (!cancelled) {
                    hydratedRef.current = true;
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!hydratedRef.current) return;

        saveTodos(todos);
    }, [todos]);

    const getTodoById = (id: string) => todos.find((t) => t.id === id) ?? null;

    const updateTodo = (id: string, patch: Partial<Todo>) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    };

    return { todos, setTodos, isLoading, getTodoById, updateTodo };
}
