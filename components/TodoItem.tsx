import { useTheme } from '@/theme/ThemeProvider';
import { t } from '@/theme/tokens';
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
    const { c } = useTheme();
    const styles = React.useMemo(() => makeStyles(c), [c]);

    return (
        <View style={styles.item}>
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

            <View style={styles.actions}>
                <Switch value={item.done} onValueChange={() => onToggle(item.id)} />

                <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
}

const makeStyles = (c: ReturnType<typeof useTheme>['c']) =>
    StyleSheet.create({
        item: {
            flexDirection: 'row',
            alignItems: 'stretch',
            paddingVertical: t.space.md,
            paddingHorizontal: t.space.md,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: t.radius.md,
            gap: t.space.md,
            backgroundColor: c.card
        },
        content: {
            flex: 1,
            minWidth: 0,
            justifyContent: 'center'
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: t.space.sm
        },
        title: {
            flex: 1,
            minWidth: 0,
            fontSize: t.font.lg,
            fontWeight: '700',
            color: c.text
        },
        titleDone: { opacity: 0.5, textDecorationLine: 'line-through' },
        planned: {
            maxWidth: '45%',
            fontSize: t.font.sm,
            color: c.muted
        },
        description: {
            marginTop: 4,
            fontSize: t.font.md,
            color: c.muted
        },
        actions: {
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: t.space.xs
        },
        deleteButton: {
            height: 32,
            minWidth: 76,
            paddingHorizontal: t.space.sm,
            justifyContent: 'center',
            borderRadius: t.radius.sm,
            borderWidth: 1,
            borderColor: c.border,
            backgroundColor: c.inputBg
        },
        deleteButtonText: {
            textAlign: 'center',
            color: c.danger,
            fontWeight: '700'
        }
    });
