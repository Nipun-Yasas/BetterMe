import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Map muscle groups to relevant Unsplash images
const MUSCLE_IMAGES: Record<string, string[]> = {
    // Chest
    chest: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', // Bench press
        'https://images.unsplash.com/photo-1598971639058-9f1c6062c927?w=800&q=80', // Pushups
    ],
    // Back
    lats: [
        'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80', // Pullups
        'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&q=80', // Rows
    ],
    middle_back: [
        'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&q=80', // Rows
    ],
    lower_back: [
        'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800&q=80', // Deadlift style
    ],
    // Legs
    quadriceps: [
        'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80', // Lunges
    ],
    hamstrings: [
        'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800&q=80', // Deadlift style
    ],
    calves: [
        'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80', // Lunges/Legs
    ],
    glutes: [
        'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=800&q=80', // Squat
    ],
    abductors: [
        'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=800&q=80', // Squat/Legs
    ],
    adductors: [
        'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=800&q=80', // Squat/Legs
    ],
    // Arms
    biceps: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80', // Biceps
    ],
    triceps: [
        'https://images.unsplash.com/photo-1532029837206-abbe2b7a4bdd?w=800&q=80', // Triceps
    ],
    forearms: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80', // Arms general
    ],
    // Shoulders
    traps: [
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80', // Overhead press
    ],
    neck: [
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80', // Shoulders/Neck
    ],
    // Core
    abdominals: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // Abs
    ],
    // Default
    default: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', // Gym general
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', // Gym general
    ]
};

// Helper to get a deterministic image based on exercise details
// Helper to get a deterministic image based on exercise details
export const getExerciseImage = (item: ItemData) => {
    if (item.image) return item.image;

    // Normalize category/muscle to find matching images
    const category = (item.muscle || item.category || '').toLowerCase().replace(' ', '_');

    // Direct lookup or fallback to default
    const pool = MUSCLE_IMAGES[category] || MUSCLE_IMAGES.default;

    // Deterministic selection based on ID string
    const charCodeSum = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = charCodeSum % pool.length;

    return pool[index];
};

export interface ItemData {
    id: string;
    title: string; // maps to exercise.name
    description: string; // maps to exercise.instructions
    difficulty: string;
    category: string; // maps to exercise.muscle or exercise.type
    image?: string; // optional image URL
    type?: string;
    muscle?: string;
    equipment?: string;
    instructions: string;
}

interface ItemCardProps {
    item: ItemData;
    isFavorited: boolean;
    onToggleFavorite: (id: string) => void;
    onSelect: (item: ItemData) => void;
}

export function ItemCard({ item, isFavorited, onToggleFavorite, onSelect }: ItemCardProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const displayImage = getExerciseImage(item);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSelect(item)}
            style={[styles.card, { backgroundColor: colors.card }]}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: displayImage }} style={styles.image} resizeMode="cover" />

                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                    }}
                    style={styles.favoriteButton}
                >
                    <Feather
                        name="heart"
                        size={20}
                        color={isFavorited ? colors.favorite : colors.icon}
                    />
                </TouchableOpacity>

                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                        {item.category.replace(/_/g, ' ')}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={[styles.description, { color: colors.icon }]} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.metaRow}>
                    {item.equipment && (
                        <View style={styles.metaItem}>
                            <Feather name="tool" size={16} color={colors.icon} />
                            <Text style={[styles.metaText, { color: colors.icon }]}>{item.equipment}</Text>
                        </View>
                    )}
                    <View style={styles.metaItem}>
                        <Feather name="activity" size={16} color={colors.icon} />
                        <Text style={[styles.metaText, { color: colors.icon }]}>{item.difficulty}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: Spacing.md,
    },
    imageContainer: {
        height: 192, // h-48 = 12rem = 192px
        position: 'relative',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: '#10b981', // emerald-500
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    categoryText: {
        color: '#ffffff',
        fontSize: FontSizes.xs,
        fontWeight: '600',
    },
    content: {
        padding: Spacing.md,
    },
    title: {
        fontSize: FontSizes.lg,
        fontWeight: 'bold',
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: FontSizes.sm,
        marginBottom: Spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: FontSizes.sm,
    },
    placeholderImage: {
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
