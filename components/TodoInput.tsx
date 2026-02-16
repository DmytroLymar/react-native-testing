import { useTheme } from '@/theme/ThemeProvider';
import { t } from '@/theme/tokens';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onAdd: () => void;
};

export function TodoInput({ value, onChange, onAdd }: Props) {
    const { c } = useTheme();
    const styles = React.useMemo(() => makeStyles(c), [c]);
    const disabled = !value.trim();
    return (
        <View style={styles.row}>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder='Add a task...'
                placeholderTextColor={c.muted}
                style={styles.input}
                returnKeyType='done'
                onSubmitEditing={disabled ? undefined : onAdd}
            />

            <Pressable
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={disabled ? undefined : onAdd}
            >
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>Add</Text>
            </Pressable>
        </View>
    );
}

const makeStyles = (c: ReturnType<typeof useTheme>['c']) =>
    StyleSheet.create({
        row: { flexDirection: 'row', gap: t.space.xs, paddingHorizontal: t.space.md },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.inputBg,
            borderRadius: t.radius.md,
            paddingHorizontal: t.space.md,
            paddingVertical: t.space.sm,
            fontSize: t.font.lg,
            color: c.text
        },
        button: {
            minWidth: 72,
            paddingHorizontal: t.space.md,
            justifyContent: 'center',
            borderRadius: t.radius.md,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.card
        },
        buttonDisabled: { opacity: 0.5 },
        buttonText: { fontSize: t.font.lg, fontWeight: '700', color: c.text, textAlign: 'center' },
        buttonTextDisabled: { color: c.muted }
    });
