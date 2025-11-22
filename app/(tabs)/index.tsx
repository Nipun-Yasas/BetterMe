import { ExerciseDetailsModal } from '@/components/ui/exercise-details-modal';
import { ItemCard, ItemData } from '@/components/ui/item-card';
import { SelectionModal } from '@/components/ui/selection-modal';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Exercise, exerciseService } from '@/services/api';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Filter options
const MUSCLE_GROUPS = [
  { label: 'All Muscles', value: '' },
  { label: 'Abdominals', value: 'abdominals' },
  { label: 'Abductors', value: 'abductors' },
  { label: 'Adductors', value: 'adductors' },
  { label: 'Biceps', value: 'biceps' },
  { label: 'Calves', value: 'calves' },
  { label: 'Chest', value: 'chest' },
  { label: 'Forearms', value: 'forearms' },
  { label: 'Glutes', value: 'glutes' },
  { label: 'Hamstrings', value: 'hamstrings' },
  { label: 'Lats', value: 'lats' },
  { label: 'Lower Back', value: 'lower_back' },
  { label: 'Middle Back', value: 'middle_back' },
  { label: 'Neck', value: 'neck' },
  { label: 'Quadriceps', value: 'quadriceps' },
  { label: 'Traps', value: 'traps' },
  { label: 'Triceps', value: 'triceps' },
];

const DIFFICULTY_LEVELS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
];

// Helper function to convert Exercise to ItemData
function exerciseToItemData(exercise: Exercise): ItemData {
  return {
    id: exercise.name, // Use name as ID since API doesn't provide one
    title: exercise.name,
    description: exercise.instructions.substring(0, 150) + (exercise.instructions.length > 150 ? '...' : ''),
    difficulty: exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1),
    category: exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1),
    type: exercise.type,
    muscle: exercise.muscle,
    equipment: exercise.equipment,
    instructions: exercise.instructions,
  };
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter states
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ItemData | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Dropdown modal state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<'muscle' | 'difficulty' | null>(null);

  const openDropdown = (type: 'muscle' | 'difficulty') => {
    setDropdownType(type);
    setDropdownVisible(true);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
    setDropdownType(null);
  };

  const getDropdownData = () => {
    switch (dropdownType) {
      case 'muscle':
        return MUSCLE_GROUPS;
      case 'difficulty':
        return DIFFICULTY_LEVELS;
      default:
        return [];
    }
  };

  const handleDropdownSelect = (value: string) => {
    switch (dropdownType) {
      case 'muscle':
        setSelectedMuscle(value);
        break;
      case 'difficulty':
        setSelectedDifficulty(value);
        break;
    }
    closeDropdown();
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchExercises();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedMuscle, selectedDifficulty]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const exercises = await exerciseService.fetchExercises({
        name: searchQuery || undefined,
        muscle: selectedMuscle || undefined,
        difficulty: selectedDifficulty || undefined,
      });
      const itemsData = exercises.map(exerciseToItemData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (item: ItemData) => {
    dispatch(toggleFavorite(item));
  };

  const handleSelectItem = (item: ItemData) => {
    setSelectedExercise(item);
    setDetailsModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundAlt }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              {/* Top Bar with Logo and Notifications */}
              <Animated.View entering={FadeInDown.delay(50).duration(600)} style={styles.headerTopBar}>
                <View style={styles.logoContainer}>
                  <View style={[styles.logoCircle, { backgroundColor: colorScheme === 'dark' ? colors.card : 'rgba(255,255,255,0.2)' }]}>
                    <Feather name="activity" size={24} color={colorScheme === 'dark' ? colors.primary : '#fff'} />
                  </View>
                  <Text style={[styles.appName, { color: colorScheme === 'dark' ? colors.text : '#fff' }]}>BetterMe</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.bellButton,
                    { backgroundColor: colorScheme === 'dark' ? colors.backgroundAlt : 'rgba(255,255,255,0.2)' },
                  ]}
                >
                  <Feather name="bell" size={20} color={colorScheme === 'dark' ? colors.icon : '#fff'} />
                  <View style={[styles.badge, { backgroundColor: colors.error, borderColor: colorScheme === 'dark' ? colors.card : colors.primary }]} />
                </TouchableOpacity>
              </Animated.View>

              {/* Greeting */}
              <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.greetingSection}>
                <Text style={[styles.greeting, { color: colorScheme === 'dark' ? colors.text : '#fff' }]}>
                  Hello, {user?.name?.split(' ')[0] || 'Guest'}!
                </Text>
                <Text style={[styles.subGreeting, { color: colorScheme === 'dark' ? colors.text : '#fff' }]}>
                  Let's crush your fitness goals today
                </Text>
              </Animated.View>

            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          {/* Quick Stats */}
          <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="trending-up" size={28} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.icon }]}>Streak</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>7 days</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="droplet" size={28} color={colors.accentBlue} />
              <Text style={[styles.statLabel, { color: colors.icon }]}>Water</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>7 cups</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Feather name="zap" size={28} color={colors.accentPurple} />
              <Text style={[styles.statLabel, { color: colors.icon }]}>Active</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>245 min</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color={colors.icon}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              placeholder="Search exercises..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.filtersContainer}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => openDropdown('muscle')}
            >
              <Feather name="target" size={16} color={colors.primary} />
              <Text style={[styles.filterButtonText, { color: colors.text }]}>
                {MUSCLE_GROUPS.find(m => m.value === selectedMuscle)?.label || 'All Muscles'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              onPress={() => openDropdown('difficulty')}
            >
              <Feather name="trending-up" size={16} color={colors.accentPurple} />
              <Text style={[styles.filterButtonText, { color: colors.text }]}>
                {DIFFICULTY_LEVELS.find(d => d.value === selectedDifficulty)?.label || 'All Levels'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.icon} />
            </TouchableOpacity>
          </Animated.View>

          {/* Loading State */}
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.icon }]}>Loading exercises...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
              <Feather name="alert-circle" size={48} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={fetchExercises}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Items Grid */}
          {!loading && !error && (
            <View style={styles.itemsGrid}>
              {items.length === 0 ? (
                <View style={styles.centerContainer}>
                  <Feather name="search" size={48} color={colors.icon} />
                  <Text style={[styles.emptyText, { color: colors.icon }]}>No exercises found</Text>
                </View>
              ) : (
                items.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInUp.delay(400 + index * 100).duration(600)}
                  >
                    <ItemCard
                      item={item}
                      isFavorited={favorites.some((fav) => fav.id === item.id)}
                      onToggleFavorite={() => handleToggleFavorite(item)}
                      onSelect={handleSelectItem}
                    />
                  </Animated.View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <SelectionModal
        visible={dropdownVisible}
        onClose={closeDropdown}
        title={dropdownType === 'muscle' ? 'Select Muscle Group' : 'Select Difficulty Level'}
        data={getDropdownData()}
        selectedValue={dropdownType === 'muscle' ? selectedMuscle : selectedDifficulty}
        onSelect={handleDropdownSelect}
      />
      <ExerciseDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        item={selectedExercise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    paddingBottom: Spacing.xxl,
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
    paddingTop: Spacing.lg,
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greetingContainer: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  bellButton: {
    padding: 10,
    borderRadius: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  searchInput: {
    height: 52,
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: Spacing.md,
    fontSize: FontSizes.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    padding: Spacing.lg,
    marginTop: -Spacing.md, // Pull content up slightly
  },
  statsGrid: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemsGrid: {
    gap: Spacing.lg,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    borderRadius: 16,
    marginVertical: Spacing.lg,
  },
  errorText: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filtersScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});