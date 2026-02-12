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

    return { todos, setTodos, isLoading };
}
