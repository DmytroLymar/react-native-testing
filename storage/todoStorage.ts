import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const KEY = 'todos';

export async function saveTodos(todos: Todo[]) {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(todos));
    } catch (e) {
        console.log('Save error', e);
    }
}

export async function loadTodos(): Promise<Todo[]> {
    try {
        const data = await AsyncStorage.getItem(KEY);

        if (!data) return [];

        return JSON.parse(data);
    } catch (e) {
        console.log('Load error', e);
        return [];
    }
}
