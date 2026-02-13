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
    return (
        <View style={styles.container}>
            <TextInput
                value={query}
                onChangeText={onQueryChange}
                placeholder='Search todo...'
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

const styles = StyleSheet.create({
    container: { gap: 10, paddingHorizontal: 12, paddingTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    },
    tabs: { flexDirection: 'row', gap: 8 },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 999
    },
    tabActive: {
        borderColor: '#111'
    },
    tabText: { fontSize: 14 },
    tabTextActive: { fontWeight: '600' }
});
