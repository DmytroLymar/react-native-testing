import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onAdd: () => void;
};

export function TodoInput({ value, onChange, onAdd }: Props) {
    return (
        <View style={styles.row}>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder='Add a task...'
                style={styles.input}
                returnKeyType='done'
                onSubmitEditing={onAdd}
            />
            <Pressable style={styles.button} onPress={onAdd}>
                <Text style={styles.buttonText}>Add</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 8 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    },
    button: {
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    buttonText: { fontSize: 16, fontWeight: '600' }
});
