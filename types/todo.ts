export type Todo = {
    id: string;
    title: string;
    done: boolean;
    createdAt: string; // ISO string
    description: string; // текст
    plannedAt: string | null; // ISO або null
};
