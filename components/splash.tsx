import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

interface SplashProps {
  onComplete?: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  // Loading dots animation
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.stagger(150, [
        Animated.sequence([
          Animated.timing(bounce1, { toValue: -8, duration: 350, useNativeDriver: true }),
          Animated.timing(bounce1, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(bounce2, { toValue: -8, duration: 350, useNativeDriver: true }),
          Animated.timing(bounce2, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(bounce3, { toValue: -8, duration: 350, useNativeDriver: true }),
          Animated.timing(bounce3, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
      ])
    ).start();

    if (onComplete) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.secondary, Colors.light.accentBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.center}>
        {/* Logo */}
        <View>
          <View style={styles.logoCircle}>
            <Feather name="activity" size={48} color={Colors.light.primary} />
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.title}>BetterMe</Text>
        <Text style={styles.subtitle}>Your Wellness Journey</Text>

        {/* Feature Icons */}
        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <View style={styles.featureCircle}>
              <Feather name="activity" size={24} color={Colors.light.background} />
            </View>
            <Text style={styles.featureText}>Exercise</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureCircle}>
              <Feather name="droplet" size={24} color={Colors.light.background} />
            </View>
            <Text style={styles.featureText}>Hydration</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureCircle}>
              <Feather name="heart" size={24} color={Colors.light.background} />
            </View>
            <Text style={styles.featureText}>Wellness</Text>
          </View>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingRow}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: bounce3 }] }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    width: '100%',
  },
  logoShadow: {
    shadowColor: Colors.light.background,
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 32,
  },
  logoCircle: {
    backgroundColor: Colors.light.background,
    borderRadius: 999,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: Colors.light.background,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.light.background,
    opacity: 0.9,
    marginBottom: 32,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 32,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureCircle: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    padding: 12,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: Colors.light.background,
    opacity: 0.8,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.background,
    marginHorizontal: 2,
  },
});