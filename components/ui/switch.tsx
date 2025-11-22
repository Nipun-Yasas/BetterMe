import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    style?: ViewStyle;
}

export function Switch({
    checked,
    onCheckedChange,
    disabled = false,
    style,
}: SwitchProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Animation values
    const translateX = useRef(new Animated.Value(checked ? 18 : 2)).current;
    const backgroundColor = useRef(new Animated.Value(checked ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: checked ? 18 : 2,
                duration: 200,
                useNativeDriver: false, // layout properties don't support native driver
            }),
            Animated.timing(backgroundColor, {
                toValue: checked ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [checked]);

    const interpolatedBackgroundColor = backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.cardBorder, colors.primary],
    });

    return (
        <Pressable
            onPress={() => !disabled && onCheckedChange(!checked)}
            disabled={disabled}
            style={[
                styles.container,
                disabled && styles.disabled,
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.track,
                    { backgroundColor: interpolatedBackgroundColor },
                ]}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            transform: [{ translateX }],
                            backgroundColor: colors.card,
                        },
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    track: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 2,
    },
    disabled: {
        opacity: 0.5,
    },
});
