import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectionOption {
    label: string;
    value: string;
}

interface SelectionModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    data: SelectionOption[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
}

export function SelectionModal({
    visible,
    onClose,
    title,
    data,
    selectedValue,
    onSelect,
}: SelectionModalProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.dropdownContainer, { backgroundColor: colors.card }]}>
                    <View style={styles.dropdownHeader}>
                        <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={colors.icon} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => {
                            const isSelected = item.value === selectedValue;

                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        { borderBottomColor: colors.cardBorder },
                                        isSelected && { backgroundColor: colors.backgroundAlt },
                                    ]}
                                    onPress={() => onSelect(item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            { color: colors.text },
                                            isSelected && { color: colors.primary, fontWeight: '600' },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {isSelected && (
                                        <Feather name="check" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        style={styles.dropdownList}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    dropdownContainer: {
        width: '100%',
        maxWidth: 400,
        maxHeight: '70%',
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    dropdownTitle: {
        fontSize: FontSizes.lg,
        fontWeight: '600',
    },
    dropdownList: {
        maxHeight: 400,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: FontSizes.md,
    },
});
