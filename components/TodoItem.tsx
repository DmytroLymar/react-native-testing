import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { Todo } from '../types/todo';

type Props = {
    item: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

function formatPlanned(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

export function TodoItem({ item, onToggle, onDelete }: Props) {
    const router = useRouter();

    return (
        <View style={styles.item}>
            {/* Left: content */}
            <Pressable
                style={styles.content}
                onPress={() => router.push({ pathname: '/todo/[id]', params: { id: item.id } })}
                android_ripple={{ color: '#00000010' }}
            >
                <View style={styles.titleRow}>
                    <Text style={[styles.title, item.done && styles.titleDone]} numberOfLines={1} ellipsizeMode='tail'>
                        {item.title}
                    </Text>

                    {item.plannedAt ? (
                        <Text style={styles.planned} numberOfLines={1} ellipsizeMode='tail'>
                            ⏰ {formatPlanned(item.plannedAt)}
                        </Text>
                    ) : null}
                </View>

                {!!item.description && (
                    <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>
                        {item.description}
                    </Text>
                )}
            </Pressable>

            {/* Right: actions */}
            <View style={styles.actions}>
                <Switch value={item.done} onValueChange={() => onToggle(item.id)} />
                <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        gap: 12
    },

    content: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center'
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10
    },

    title: {
        flex: 1,
        minWidth: 0,
        fontSize: 16,
        fontWeight: '600'
    },
    titleDone: {
        opacity: 0.5,
        textDecorationLine: 'line-through'
    },

    planned: {
        maxWidth: '45%',
        fontSize: 12,
        opacity: 0.75
    },

    description: {
        marginTop: 4,
        fontSize: 14,
        opacity: 0.75
    },

    actions: {
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },

    deleteButton: {
        height: 32,
        minWidth: 70,
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: '#eeeeee',
        borderRadius: 10
    },
    deleteButtonText: {
        textAlign: 'center',
        color: '#ff0000',
        fontWeight: '600'
    }
});
