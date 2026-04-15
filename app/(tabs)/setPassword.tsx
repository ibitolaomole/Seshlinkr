// (no changes to import section)
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { RootStackParamList } from './types';

export default function SetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmError, setShowConfirmError] = useState(false);
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;
  const confirmErrorAnim = useRef(new Animated.Value(0)).current;
  // --- Eye feature state ---
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  // --- Eye icon margin control ---
  const eyeIconMarginTop = -5; // Change this value to control both eye icon vertical alignment

  // --- Fade/slide-in animation ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const isPasswordValid = password.length >= 8;
  const isConfirmValid = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && isConfirmValid;
  const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = useColorScheme(); // added for the requested style snippet

  // Modern password strength evaluation
  const evaluatePasswordStrength = (pwd: string) => {
    const rules = [
      pwd.length >= 8,
      /[a-z]/.test(pwd),
      /[A-Z]/.test(pwd),
      /\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd),
    ];
    const score = rules.reduce((acc, ok) => acc + (ok ? 1 : 0), 0); // 0..4
    const map = [
      { label: 'Too weak', color: '#EF4444' },
      { label: 'Weak', color: '#F59E0B' },
      { label: 'Okay', color: '#10B981' },
      { label: 'Strong', color: '#5B57BC' },
      { label: 'Strong', color: '#5B57BC' },
    ];
    return { score, ...map[score] };
  };
  const strength = React.useMemo(() => evaluatePasswordStrength(password), [password]);

  React.useEffect(() => {
    setShowPasswordError(password.length > 0 && !isPasswordValid);
    Animated.timing(passwordErrorAnim, {
      toValue: password.length > 0 && !isPasswordValid ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [password]);

  React.useEffect(() => {
    setShowConfirmError(confirmPassword.length > 0 && !isConfirmValid);
    Animated.timing(confirmErrorAnim, {
      toValue: confirmPassword.length > 0 && !isConfirmValid ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [confirmPassword, password]);

  const getInputStyle = (field: 'password' | 'confirm') => {
    const isFocused = focusedInput === field;
    let isValid = false;
    let value = '';
    let showError = false;
    if (field === 'password') {
      isValid = isPasswordValid;
      value = password;
      showError = showPasswordError;
    } else {
      isValid = isConfirmValid;
      value = confirmPassword;
      showError = showConfirmError;
    }
    if (showError) return [styles.input, styles.inputError];
    if (isFocused) return [styles.input, isDarkMode ? styles.inputFocusedDark : styles.inputFocused];
    if (value.length > 0 && isValid) return [styles.input, isDarkMode ? styles.inputValidDark : styles.inputValid];
    return styles.input;
  };

  const handleNext = () => {
    if (isFormValid) {
      navigation.navigate('homescreen');
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.container,
          colorScheme === 'dark' && { backgroundColor: '#081426' },
          colorScheme !== 'dark' && { backgroundColor: '#F5F5F7' } // updated light mode color
        ]}
    >
      <TouchableOpacity
        style={[
          styles.cancelButton,
          {
            backgroundColor: colorScheme === 'dark' ? '#182040' : '#ffffff',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 30,
            shadowColor: '#000', // Added shadow properties
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5, // For Android shadow
          },
        ]}
        onPress={handleBack}
      >
        <Text
          style={[
            { color: isDarkMode ? '#F1F1EF' : '#0B1B35', fontSize: 16, fontWeight: '600', textAlign: 'center' }
          ]}
        >
          Back
        </Text>
      </TouchableOpacity>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={[
          styles.header,
          isDarkMode && { color: '#5B57BC' }
        ]}>Set a <Text style={{color: '#5B57BC'}}>Password.</Text></Text>
        <Text style={[
          styles.subHeader,
          isDarkMode && { color: '#AAB2C8' }
        ]}>
          Choose a secure and memorable password{`\n`}for your account.
        </Text>

        {/* Modern card around inputs */}
        <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
          {/* Password input (signUp1-like) */}
          <View style={{ position: 'relative', marginBottom: 10 }}>
            {/* removed floating label */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  getInputStyle('password'),
                  { flex: 1, paddingRight: 44 }, // leave room for eye icon
                  isDarkMode && {
                    backgroundColor: '#192040',
                    color: '#F1F1EF',
                    borderColor: showPasswordError ? '#D6001C' : '#A9A6FF',
                  }
                ]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                placeholder="Password"
                placeholderTextColor={isDarkMode ? '#A9A6FF' : '#5B57BC'}
                selectionColor="#5B57BC"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible((v) => !v)}
                style={{ position: 'absolute', right: 10, height: '100%', justifyContent: 'center', padding: 8, zIndex: 3 }}
                accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
              >
                <Image
                  source={passwordVisible
                    ? require('../../assets/images/Seshlinkr_eye_blue_cross.png')
                    : require('../../assets/images/Seshlinkr_eye_blue.png')}
                  style={{
                    width: 24,
                    height: 24,
                    marginTop: 0,
                    tintColor: showPasswordError
                      ? '#D6001C'
                      : (isDarkMode
                        ? (password.length >= 8 && focusedInput !== 'password' ? '#E0E0E0' : '#AAB2C8')
                        : (password.length >= 8 && focusedInput !== 'password' ? '#0B1B35' : '#5B57BC')),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password strength meter */}
          <View style={styles.strengthWrapper} accessibilityLabel="Password strength">
            <View style={[styles.strengthBarBackground, isDarkMode && { backgroundColor: '#22304F' }]}>
              <View
                style={[
                  styles.strengthBarFill,
                  { width: `${(strength.score / 4) * 100}%`, backgroundColor: strength.color },
                ]}
              />
            </View>
            <Text style={[styles.strengthLabel, isDarkMode && { color: '#E5E7EB' }]}>
              {password.length === 0 ? 'Enter a password' : strength.label}
            </Text>
          </View>

          <Animated.View style={{ opacity: passwordErrorAnim }}>
            <Text style={[
              styles.errorText,
              isDarkMode ? styles.errorTextDark : styles.errorTextLight
            ]}>
              {showPasswordError ? 'Password must be at least 8 characters.' : ' '}
            </Text>
          </Animated.View>

          {/* Confirm Password input (signUp1-like) */}
          <View style={{ position: 'relative', marginBottom: 10 }}>
            {/* removed floating label */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  getInputStyle('confirm'),
                  { flex: 1, paddingRight: 44 },
                  isDarkMode && {
                    backgroundColor: '#192040',
                    color: '#F1F1EF',
                    borderColor: showConfirmError ? '#D6001C' : '#A9A6FF',
                  }
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                placeholder="Confirm Password"
                placeholderTextColor={isDarkMode ? '#A9A6FF' : '#5B57BC'}
                selectionColor="#5B57BC"
              />
              <TouchableOpacity
                onPress={() => setConfirmPasswordVisible((v) => !v)}
                style={{ position: 'absolute', right: 10, height: '100%', justifyContent: 'center', padding: 8, zIndex: 3 }}
                accessibilityLabel={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
              >
                <Image
                  source={confirmPasswordVisible
                    ? require('../../assets/images/Seshlinkr_eye_blue_cross.png')
                    : require('../../assets/images/Seshlinkr_eye_blue.png')}
                  style={{
                    width: 24,
                    height: 24,
                    marginTop: 0,
                    tintColor: showConfirmError
                      ? '#D6001C'
                      : (isDarkMode
                        ? (confirmPassword.length >= 8 && focusedInput !== 'confirm' ? '#E0E0E0' : '#AAB2C8')
                        : (confirmPassword.length >= 8 && focusedInput !== 'confirm' ? '#0B1B35' : '#5B57BC')),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Animated.View style={{ opacity: confirmErrorAnim }}>
            <Text style={[
              styles.errorText,
              isDarkMode ? styles.errorTextDark : styles.errorTextLight
            ]}>
              {showConfirmError ? 'Passwords do not match.' : ' '}
            </Text>
          </Animated.View>

          {/* Helper text */}
          <Text
            style={[
              styles.helperText,
              isDarkMode && { color: '#AAB2C8' }
            ]}
          >
            Use at least 8 characters. Add numbers, symbols, and mix case for a stronger password.
          </Text>
        </View>

        {/* Full-width primary button (match signUp1) */}
        <TouchableOpacity
          style={[
            styles.nextButtonFull,
            !isFormValid && styles.nextButtonDisabled,
            isDarkMode && isFormValid && { backgroundColor: '#5B57BC', borderColor: '#AAB2C8' }
          ]}
          onPress={handleNext}
          disabled={!isFormValid}
          accessibilityRole="button"
          accessibilityLabel="Next"
          accessibilityHint="Finish password setup"
        >
          <Text style={[
            styles.nextButtonText,
            (!isFormValid) && { color: isDarkMode ? '#6B7280' : '#9CA3AF' },
            isDarkMode && isFormValid && { color: '#F1F1EF' },
            !isDarkMode && isFormValid && { color: '#FFFFFF' } // ensure white in light mode
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    backgroundColor: '#F1F1EF',
    justifyContent: 'flex-start',
  },
  cancelButton:
  {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  cancelText: {
    color: '#5B57BC',
    fontWeight: '600',
    fontSize: 16,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  image: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 25,
    fontFamily: 'Usual-Bold',
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 5,
    color: '#5B57BC',  // changed base header color to dark blue
  },
  linkrText: {
    color: '#0B1B35', // purple colour for "linkr"
  },
  subHeader: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 23,
  },
  // Update input to match signUp1
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0B1B35',
    borderColor: '#5B57BC',
    borderWidth: 1.5,
  },
  inputFocused: {
    borderColor: '#5B57BC',
  },
  inputFocusedDark: {
    borderColor: '#A9A6FF',
  },
  inputValid: {
    borderColor: '#0B1B35',
  },
  inputValidDark: {
    borderColor: '#AAB2C8',
  },
  inputError: {
    borderColor: '#D6001C',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 12,
    marginLeft: 15,
    fontFamily: 'Usual-Regular',
    minHeight: 16,
  },
  errorTextLight: {
    color: '#D6001C',
  },
  errorTextDark: {
    color: '#FF6B8A',
  },
  // Modern card styles
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: -10,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: '#22304F',
  },
  // Strength meter
  strengthWrapper: {
    marginTop: 6,
    marginBottom: 10,
  },
  strengthBarBackground: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: 6,
    borderRadius: 999,
    width: '0%',
    backgroundColor: '#EF4444',
  },
  strengthLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Usual-Regular',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 50,
    fontFamily: 'Usual-Regular',
  },
  // Full-width button (already aligned with signUp1)
  nextButtonFull: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: '#0B1B35',
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});