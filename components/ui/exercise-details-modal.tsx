import { getExerciseImage, ItemData } from '@/components/ui/item-card';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ExerciseDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    item: ItemData | null;
}

export function ExerciseDetailsModal({
    visible,
    onClose,
    item,
}: ExerciseDetailsModalProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    if (!item) return null;

    const imageUrl = getExerciseImage(item);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    {/* Header Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            contentFit="cover"
                            transition={200}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.imageOverlay}
                        />
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Feather name="x" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Title & Badges */}
                        <View style={styles.headerSection}>
                            <Text style={[styles.title, { color: colors.text }]}>
                                {item.title}
                            </Text>

                            <View style={styles.badgesContainer}>
                                <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                                    <Text style={[styles.badgeText, { color: colors.primary }]}>
                                        {item.muscle?.replace(/_/g, ' ')}
                                    </Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: colors.accentBlue + '20' }]}>
                                    <Text style={[styles.badgeText, { color: colors.accentBlue }]}>
                                        {item.difficulty}
                                    </Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: colors.accentPurple + '20' }]}>
                                    <Text style={[styles.badgeText, { color: colors.accentPurple }]}>
                                        {item.type?.replace(/_/g, ' ')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Instructions */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Instructions
                            </Text>
                            <Text style={[styles.instructions, { color: colors.icon }]}>
                                {item.instructions}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '90%',
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    closeButton: {
        position: 'absolute',
        top: Spacing.xl,
        right: Spacing.lg,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    headerSection: {
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSizes.xxxl,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    badge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: 9999,
    },
    badgeText: {
        fontSize: FontSizes.sm,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
    },
    instructions: {
        fontSize: FontSizes.md,
        lineHeight: 24,
    },
});
