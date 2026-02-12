import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { Todo } from '../types/todo';

type Props = {
    item: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export function TodoItem({ item, onToggle, onDelete }: Props) {
    return (
        <View style={styles.item}>
            <Text style={styles.text}>{item.title}</Text>
            <Switch value={item.done} onValueChange={() => onToggle(item.id)} />
            <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12
    },
    text: {
        fontSize: 16,
        flex: 1
    },
    deleteButton: {
        height: 30,
        width: 60,
        backgroundColor: '#eeeeee',
        borderRadius: 10
    },
    deleteButtonText: {
        textAlign: 'center',
        lineHeight: 30,
        color: '#ff0000'
    }
});
