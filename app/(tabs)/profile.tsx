import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const colors = Colors[theme];

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);

  const handleToggleDarkMode = (checked: boolean) => {
    toggleTheme();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMenuItem = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    showChevron = true,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Feather name={icon} size={20} color={colors.text} />
        <Text style={[styles.menuItemLabel, { color: colors.text }]}>{label}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : showChevron ? (
        <Feather name="chevron-right" size={20} color={colors.icon} />
      ) : null}
    </TouchableOpacity>
  );

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
              <Text style={[styles.headerTitle, { color: '#fff' }]}>
                Profile
              </Text>
              <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                Manage your account
              </Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Feather name="user" size={80} color="rgba(255,255,255,0.15)" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.userInfo}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.avatar}
            >
              <Feather name="user" size={32} color="#fff" />
            </LinearGradient>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.icon }]}>
                {user?.email || 'guest@example.com'}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={[styles.statsContainer, { borderColor: colors.cardBorder }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>7</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{favorites.length}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            Settings
          </Text>

          {renderMenuItem(
            isDark ? 'moon' : 'sun',
            'Dark Mode',
            false,
            <Switch checked={isDark} onCheckedChange={handleToggleDarkMode} />
          )}

          {renderMenuItem('bell', 'Notifications')}
          {renderMenuItem('activity', 'Activity Settings')}
          {renderMenuItem('settings', 'Account Settings')}
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            Support
          </Text>

          {renderMenuItem('help-circle', 'Help Center')}
          {renderMenuItem('lock', 'Privacy Policy')}
          {renderMenuItem('file-text', 'Terms of Service')}
        </View>

        {/* Logout Button */}
        <Button
          label="Logout"
          variant="outline"
          icon={<Feather name="log-out" size={20} color={colors.error} />}
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: colors.error + '40', backgroundColor: colors.error + '10' }]}
          textStyle={{ color: colors.error }}
        />

        <Text style={[styles.version, { color: colors.icon }]}>
          BetterMe v1.0.0
        </Text>
      </ScrollView>
    </View>
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
    zIndex: 1,
  },
  headerContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
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
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FontSizes.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
  },
  section: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSizes.sm,
  },
});

