import { ExerciseDetailsModal } from '@/components/ui/exercise-details-modal';
import { ItemCard, ItemData } from '@/components/ui/item-card';
import { Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const favorites = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();
  const [selectedExercise, setSelectedExercise] = React.useState<ItemData | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = React.useState(false);

  const handleToggleFavorite = (item: ItemData) => {
    dispatch(toggleFavorite(item));
  };

  const handleSelectItem = (item: ItemData) => {
    setSelectedExercise(item);
    setDetailsModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundAlt }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: '#fff' }]}>Favorites</Text>
              <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                Your personal collection
              </Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Feather name="heart" size={80} color="rgba(255,255,255,0.15)" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.iconCircle, { backgroundColor: colors.card }]}>
              <Feather name="heart" size={48} color={colors.icon} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              Mark exercises as favorites to see them here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(600)}
              >
                <ItemCard
                  item={item}
                  isFavorited={true}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                  onSelect={handleSelectItem}
                />
              </Animated.View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <ExerciseDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        item={selectedExercise}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden', // Clip the large icon if needed
  },
  headerTextContainer: {
    flex: 1,
    zIndex: 1,
  },
  headerIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl + 80, // Add extra padding for tab bar
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

