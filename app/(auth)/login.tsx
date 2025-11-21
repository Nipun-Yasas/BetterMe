import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { loginSchema } from '../../utils/validationSchemas';

export default function LoginScreen() {
  const dispatch = useDispatch<any>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    setErrorMessage('');
    const result = await dispatch(loginUser(values.email, values.password));
    setSubmitting(false);
    if (result.success) {
      router.replace('/');
    } else {
      setErrorMessage(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerBox}>
          {/* Logo */}
          <View style={styles.logoBox}>
            <View style={[styles.logoCircle, { backgroundColor: colors.secondary }]}>
              <MaterialCommunityIcons name="run" size={32} color={colors.background} />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Sign in to continue your wellness journey
          </Text>

          {/* Login Form */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <>
                  {errorMessage ? (
                    <View style={styles.errorRow}>
                      <Feather name="alert-circle" size={16} color={colors.error} />
                      <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                    </View>
                  ) : null}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                    <View style={styles.inputIconRow}>
                      <Feather
                        name="mail"
                        size={20}
                        color={colors.icon}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.card,
                            borderColor: touched.email && errors.email ? colors.error : colors.cardBorder,
                            color: colors.text,
                          },
                        ]}
                        placeholder="your.email@example.com"
                        placeholderTextColor={colors.icon}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                    {touched.email && errors.email && (
                      <View style={styles.errorRow}>
                        <Feather name="alert-circle" size={14} color={colors.error} />
                        <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                    <View style={styles.inputIconRow}>
                      <Feather
                        name="lock"
                        size={20}
                        color={colors.icon}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.card,
                            borderColor: touched.password && errors.password ? colors.error : colors.cardBorder,
                            color: colors.text,
                          },
                        ]}
                        placeholder="••••••••"
                        placeholderTextColor={colors.icon}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password"
                      />
                    </View>
                    {touched.password && errors.password && (
                      <View style={styles.errorRow}>
                        <Feather name="alert-circle" size={14} color={colors.error} />
                        <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={[styles.forgotText, { color: colors.accent }]}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color={colors.background} />
                    ) : (
                      <Text style={[styles.buttonText, { color: colors.background }]}>Login</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.icon }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.link, { color: colors.accent }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  centerBox: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    borderRadius: 999,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: Spacing.md / 2,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    paddingLeft: Spacing.xl,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    marginLeft: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontSize: FontSizes.sm,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  forgotText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  button: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    fontSize: FontSizes.md,
  },
  link: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
});