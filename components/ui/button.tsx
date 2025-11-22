import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';

// Define variant types
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    label?: string;
    loading?: boolean;
    icon?: React.ReactNode;
    textStyle?: TextStyle;
}

export function Button({
    variant = 'default',
    size = 'default',
    label,
    loading = false,
    icon,
    style,
    textStyle,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Helper to get base styles based on variant
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'destructive':
                return {
                    backgroundColor: colors.error,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                };
            case 'secondary':
                return {
                    backgroundColor: colors.secondary,
                    borderWidth: 0,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                };
            case 'link':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    paddingHorizontal: 0,
                };
            case 'default':
            default:
                return {
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                };
        }
    };

    // Helper to get text styles based on variant
    const getVariantTextStyle = (): TextStyle => {
        switch (variant) {
            case 'destructive':
                return { color: '#ffffff' };
            case 'outline':
                return { color: colors.text };
            case 'secondary':
                return { color: '#ffffff' }; // Assuming secondary text is white
            case 'ghost':
                return { color: colors.text };
            case 'link':
                return {
                    color: colors.primary,
                    textDecorationLine: 'underline',
                };
            case 'default':
            default:
                return { color: '#ffffff' };
        }
    };

    // Helper to get size styles
    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm':
                return {
                    height: 32,
                    paddingHorizontal: Spacing.sm,
                    borderRadius: BorderRadius.md,
                };
            case 'lg':
                return {
                    height: 48,
                    paddingHorizontal: Spacing.lg,
                    borderRadius: BorderRadius.md,
                };
            case 'icon':
                return {
                    height: 36,
                    width: 36,
                    paddingHorizontal: 0,
                    borderRadius: BorderRadius.md,
                };
            case 'default':
            default:
                return {
                    height: 40,
                    paddingHorizontal: Spacing.md,
                    borderRadius: BorderRadius.md,
                };
        }
    };

    const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled || loading ? 0.5 : 1,
        gap: Spacing.xs,
    };

    const baseTextStyle: TextStyle = {
        fontSize: FontSizes.sm,
        fontWeight: '500',
    };

    return (
        <TouchableOpacity
            style={[
                baseStyle,
                getSizeStyle(),
                getVariantStyle(),
                style,
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#ffffff'}
                />
            ) : (
                <>
                    {icon}
                    {label ? (
                        <Text style={[baseTextStyle, getVariantTextStyle(), textStyle]}>
                            {label}
                        </Text>
                    ) : (
                        children
                    )}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Styles are generated dynamically based on props and theme
});
