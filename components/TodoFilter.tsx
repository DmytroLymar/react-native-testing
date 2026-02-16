import { useTheme } from '@/theme/ThemeProvider';
import { t } from '@/theme/tokens';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type TodoStatusFilter = 'all' | 'active' | 'done';

type Props = {
    query: string;
    onQueryChange: (value: string) => void;
    status: TodoStatusFilter;
    onStatusChange: (value: TodoStatusFilter) => void;
};

const STATUS_ITEMS: { key: TodoStatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'done', label: 'Done' }
];

export function TodoFilter({ query, onQueryChange, status, onStatusChange }: Props) {
    const { c } = useTheme();
    const styles = React.useMemo(() => makeStyles(c), [c]);
    return (
        <View style={styles.container}>
            <TextInput
                value={query}
                onChangeText={onQueryChange}
                placeholder='Search todo...'
                placeholderTextColor={c.muted}
                style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
                clearButtonMode='while-editing'
            />

            <View style={styles.tabs}>
                {STATUS_ITEMS.map((item) => {
                    const isActive = item.key === status;

                    return (
                        <Pressable
                            key={item.key}
                            onPress={() => onStatusChange(item.key)}
                            style={[styles.tab, isActive && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const makeStyles = (c: ReturnType<typeof useTheme>['c']) =>
    StyleSheet.create({
        container: {
            gap: t.space.sm,
            paddingHorizontal: t.space.md,
            paddingTop: t.space.md,
            paddingBottom: t.space.sm,
            backgroundColor: c.bg
        },
        input: {
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.inputBg,
            borderRadius: t.radius.md,
            paddingHorizontal: t.space.md,
            paddingVertical: t.space.sm,
            fontSize: t.font.lg,
            color: c.text
        },
        tabs: { flexDirection: 'row', gap: t.space.xs },
        tab: {
            paddingHorizontal: t.space.md,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: t.radius.pill,
            backgroundColor: c.inputBg
        },
        tabActive: {
            borderColor: c.text
        },
        tabText: { fontSize: t.font.md, color: c.muted },
        tabTextActive: { color: c.text, fontWeight: '700' }
    });
