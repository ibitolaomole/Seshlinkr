import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
  useColorScheme, // Correctly added import
  View
} from 'react-native';
import api from '../../api'; // Ensure you have an API utility for making requests
import { RootStackParamList } from './types';

export default function VerifyEmailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'signUp2'>>();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [cooldown, setCooldown] = useState(0); // Cooldown for resending code

  const handleEmailLowercase = (email: string) => email.toLowerCase(); // Convert email to lowercase
  const email = handleEmailLowercase(route.params.email); // Apply lowercase conversion

  const colorScheme = useColorScheme(); // Ensure this line is present

  // Animation for fade/slide-in
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

  // Immediately redirect to signUp3 on mount
  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace('signUp3', { email });
    }, 0);
    return () => clearTimeout(id);
  }, [navigation, email]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(code)) return setError('Please enter a valid 6-digit code.');
    try {
      setIsSubmitting(true);
      setError('');
      const response = await api.post('/auth/verify-email', { email, code }); // Verify endpoint
      if (response.status === 200) {
        navigation.navigate('signUp3', { email }); // Ensure email is passed correctly
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (e: any) {
      if (e?.response?.status === 400) {
        setError(e?.response?.data?.message || 'Invalid or expired code.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await api.post('/auth/resend-email-code', { email }); // Resend endpoint
      setCooldown(30);
      const id = setInterval(() => setCooldown(c => (c <= 1 ? (clearInterval(id), 0) : c - 1)), 1000);
    } catch {
      setError('Could not resend code. Try again shortly.');
    }
  };

  const handleInputChange = async (text: string) => {
    const numericOnly = text.replace(/\D/g, '').slice(0, 6);
    setCode(numericOnly);

    if (numericOnly.length === 6) {
      setError(''); // Clear any existing error
      await handleVerify(); // Ensure handleVerify is called correctly
    }
  };

  const getInputStyle = () => {
    if (error) return [styles.input, styles.inputError];
    if (code.length === 6) return [styles.input, styles.inputValid];
    if (isFocused) return [styles.input, styles.inputFocused];
    return [styles.input]; // ✅ default: white border
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
      <TouchableOpacity style={[
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
        }
      ]} onPress={() => navigation.goBack()}>
        <Text style={[
          { color: colorScheme === 'dark' ? '#F1F1EF' : '#0B1B35', fontSize: 16, fontWeight: '600', textAlign: 'center' }
        ]}>Back</Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Seshlinkr logo"
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={[
          styles.header,
          colorScheme === 'dark' && { color: '#5B57BC' }
        ]}>Verify your email.</Text>
        <Text style={[
          styles.subHeader,
          colorScheme === 'dark' && { color: '#ffffff' }
        ]}>
          Enter the 6-digit code we sent to: <Text style={[
            styles.emailText,
            colorScheme === 'dark' && { color: '#A9A6FF' }
          ]}>{email}</Text>
        </Text>

        {/* Modern card wrapper */}
        <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
          <TextInput
            style={[
              styles.input,
              {
                borderRadius: 20, // Match the border radius from signUp1
                paddingVertical: 14, // Adjust padding to match signUp1
                paddingHorizontal: 16, // Adjust padding to match signUp1
                fontSize: 16, // Match font size from signUp1
                borderWidth: 1.5, // Match border width from signUp1
                borderColor: error
                  ? (colorScheme === 'dark' ? '#FF6B8A' : '#e2264fff') // Correctly apply error color based on mode
                  : colorScheme === 'dark'
                  ? '#A8A6FF' // Dark mode border color
                  : '#5B57BC', // Light mode border color
                backgroundColor: colorScheme === 'dark' ? '#182040' : '#FFFFFF', // Updated dark mode background color
                color: colorScheme === 'dark' ? '#F1F1EF' : '#0B1B35', // Match text color from signUp1
              },
            ]}
            placeholder="Verification code"
            placeholderTextColor={colorScheme === 'dark' ? '#A8A6FF' : '#5B57BC'}
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode" // Autofill
            autoComplete="one-time-code" // Autofill
            inputMode="numeric" // Numeric input
            value={code}
            onChangeText={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor="#5B57BC"
            accessible
            accessibilityLabel="Verification Code Input"
            autoFocus
          />

          {error ? (
            <Text style={[
              styles.inputErrorText,
              colorScheme === 'dark'
                ? styles.inputErrorTextDark
                : { color: '#e2264fff' } // Light mode error text color
            ]} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}

          <Text style={[
            styles.resendText,
            colorScheme === 'dark' && { color: '#ffffff' }
          ]}>
            Didn't get a code?{' '}
            <TouchableOpacity onPress={handleResend} disabled={cooldown > 0}>
              <Text style={[
                styles.resendLink,
                colorScheme === 'dark' && { color: '#A9A6FF' }
              ]}>
                Resend. {cooldown > 0 ? `(${cooldown}s)` : ''}
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
        {/* End card */}
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (code.length !== 6 || isSubmitting) && styles.continueButtonDisabled,
          colorScheme === 'dark' && {
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
          },
          colorScheme !== 'dark' && { backgroundColor: '#182040' }
        ]}
        onPress={handleVerify}
        disabled={code.length !== 6 || isSubmitting}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Next button"
        accessibilityHint="Proceed to the next step"
        accessibilityState={{ disabled: code.length !== 6 || isSubmitting }}
      >
        <Text
          style={[
            styles.continueButtonText,
            // When disabled, dim text; when enabled in dark mode, use dark text
            (code.length !== 6 || isSubmitting)
              ? { color: colorScheme === 'dark' ? '#AAB2C8' : '#9CA3AF' }
              : (colorScheme === 'dark' ? { color: '#0B1B35' } : null),
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  cancelButton: {
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
  header: {
    fontSize: 25,
    fontFamily: 'Usual-Bold',
    color: '#5B57BC',
    marginTop: -10,
    marginBottom: 8,
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 65,
  },
  subHeader: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35',
    marginTop: 5,
    marginBottom: 30,
    marginLeft: 5,
  },
  emailText: {
    fontSize: 15,
    color: '#5B57BC',
    fontFamily: 'Usual-Medium',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: 'Usual-Regular',
    borderWidth: 2,
    borderColor: '#ffffff', // ✅ default unclicked border is white
    color: '#0B1B35',
    marginBottom: 10,
    marginTop: -20,
  },
  inputFocused: {
    borderColor: '#5B57BC',
  },
  inputError: {
    borderColor: '#FF6B8A',
  },
  inputValid: {
    borderColor: '#0B1B35',
  },
  inputErrorText: {
    color: '#FF6B8A',
    fontSize: 14, // Change this value to adjust the font size
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: 'Usual-Medium',
    minHeight: 16,
  },
  inputErrorTextDark: {
    color: '#FF6B8A', // brighter error color for dark mode
  },
  resendText: {
    fontSize: 14,
    color: '#0B1B35',
    textAlign: 'left',
    marginBottom: 30,
    marginLeft: 5,
    fontFamily: 'Usual-Regular',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resendLink: {
    color: '#5B57BC',
    fontFamily: 'Usual-Bold',
    marginBottom: -4,
  },
  continueButton: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    backgroundColor: '#0B1B35',
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
    elevation: 0, // flatten when disabled
  },
  // Modern card
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
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
});