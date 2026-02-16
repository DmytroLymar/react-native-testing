export type Todo = {
    id: string;
    title: string;
    done: boolean;
    createdAt: string;
    description: string;
    plannedAt: string | null;
    notificationId?: string | null;
};
