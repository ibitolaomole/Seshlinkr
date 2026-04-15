import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  useColorScheme,
} from 'react-native';
import { RootStackParamList } from './types';
export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [dobError, setDobError] = useState('');
  const [nameError, setNameError] = useState(''); // Add a new state for name error
  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showDobError, setShowDobError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // Add state for date picker visibility
  // Track user interaction with day/month/year (for iOS spinner)
  const [dateInteraction, setDateInteraction] = useState({ day: false, month: false, year: false, complete: false });
  const [lastPickerDate, setLastPickerDate] = useState<Date | null>(null);
  const nameErrorAnim = useRef(new Animated.Value(0)).current;
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const dobErrorAnim = useRef(new Animated.Value(0)).current;
  const datePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const datePickerSlideAnim = useRef(new Animated.Value(20)).current;

  // Animation for fade/slide-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const colorScheme = useColorScheme(); // <-- add this line

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

  const handleNext = () => {
    if (isFormValid) {
      navigation.navigate('signUp2', { email });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Reusable validation functions
  const validateUsername = (username: string) => {
    const USERNAME_REGEX = /^(?![._-])(?!.*[._-]{2})[a-zA-Z0-9._-]{3,30}(?<![._-])$/;
    const isTaken = username.toLowerCase() === 'admin' || username.toLowerCase() === 'test';
    const hasRepeatedChars = /(.)\1{2,}/.test(username);
    if (username.length === 0) return 'Oops! You forgot to add a username.';
    if (username.length < 3 || username.length > 20) return 'Usernames must be between 3 and 20 characters.';
    if (/[^a-zA-Z0-9._-]/.test(username)) return 'Keep it simple—only letters, numbers, _ or . allowed.';
    if (/^[._-]|[._-]$/.test(username)) return 'Usernames can’t start or end with a symbol.';
    if (isTaken) return 'That username’s already in use—try adding a number or a twist.';
    if (hasRepeatedChars) return 'Try a username without repeated characters.';
    if (!USERNAME_REGEX.test(username)) return 'Invalid username format.';
    return '';
  };

  const validateEmail = (email: string) => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) return '';
    if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [dd, mm, yyyy] = dateString.split('/');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dd} ${monthNames[parseInt(mm) - 1]} ${yyyy}`;
  };

  const validateDob = (dob: string) => {
    if (dob.length !== 10) return '';
    const [dd, mm, yyyy] = dob.split('/').map(Number);
    const currentYear = new Date().getFullYear();
    const today = new Date();

    // format + consistency
    const isValidDate = dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yyyy >= 1900 && yyyy <= currentYear;
    const constructedDate = new Date(`${yyyy}-${mm}-${dd}`);
    const isConsistent =
      constructedDate.getFullYear() === yyyy &&
      constructedDate.getMonth() + 1 === mm &&
      constructedDate.getDate() === dd;

    // future check
    const isFuture = constructedDate > today;

    // 16+ requirement
    const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const isOldEnough = constructedDate <= minAgeDate;

    if (!isValidDate || !isConsistent) return 'Enter a valid date in DD/MM/YYYY format.';
    if (isFuture) return 'Date of birth cannot be in the future.';
    if (!isOldEnough) return 'You must be at least 16 years old to use the platform.';
    return '';
  };

  const handleNameChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
    setName(cleaned);
    const error = validateUsername(cleaned);
    setNameError(error);
    setShowNameError(!!error);
  };

  const handleEmailChange = (text: string) => {
    const lowercaseEmail = text.toLowerCase();
    setEmail(lowercaseEmail);
    const error = validateEmail(lowercaseEmail);
    setShowEmailError(!!error);
  };

  // Toggle open/close on press
  const handleDatePickerPress = () => {
    if (showDatePicker) {
      Animated.parallel([
        Animated.timing(datePickerFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(datePickerSlideAnim, { toValue: 20, duration: 250, useNativeDriver: true }),
      ]).start(() => setShowDatePicker(false));
      return;
    }

    setShowDatePicker(true);
    const initial = dob ? new Date(dob.split('/').reverse().join('-')) : new Date();
    setLastPickerDate(initial);
    setDateInteraction({ day: false, month: false, year: false, complete: false });
    setDobError('');
    setShowDobError(false);

    Animated.parallel([
      Animated.timing(datePickerFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(datePickerSlideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleDobChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event?.type === 'set' && selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-GB');
        setDob(formattedDate);
        const error = validateDob(formattedDate);
        setDobError(error);
        setShowDobError(!!error);

        Animated.parallel([
          Animated.timing(datePickerFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(datePickerSlideAnim, { toValue: 20, duration: 250, useNativeDriver: true }),
        ]).start(() => setShowDatePicker(false));
      } else if (event?.type === 'dismissed') {
        Animated.parallel([
          Animated.timing(datePickerFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(datePickerSlideAnim, { toValue: 20, duration: 250, useNativeDriver: true }),
        ]).start(() => setShowDatePicker(false));
      }
      return;
    }

    // iOS spinner behavior
    if (selectedDate) {
      const prev = lastPickerDate || selectedDate;
      const changedDay = dateInteraction.day || prev.getDate() !== selectedDate.getDate();
      const changedMonth = dateInteraction.month || prev.getMonth() !== selectedDate.getMonth();
      const changedYear = dateInteraction.year || prev.getFullYear() !== selectedDate.getFullYear();
      const complete = changedDay && changedMonth && changedYear;

      setLastPickerDate(selectedDate);
      setDateInteraction({ day: changedDay, month: changedMonth, year: changedYear, complete });

      const formattedDate = selectedDate.toLocaleDateString('en-GB');
      setDob(formattedDate);

      if (complete) {
        const error = validateDob(formattedDate);
        setDobError(error);
        setShowDobError(!!error);

        if (!error) {
          Animated.parallel([
            Animated.timing(datePickerFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(datePickerSlideAnim, { toValue: 20, duration: 250, useNativeDriver: true }),
          ]).start(() => setShowDatePicker(false));
        }
      } else {
        setDobError('');
        setShowDobError(false);
      }
    }
  };

  const handleDatePickerDismiss = () => {
    Animated.parallel([
      Animated.timing(datePickerFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(datePickerSlideAnim, { toValue: 20, duration: 250, useNativeDriver: true }),
    ]).start(() => setShowDatePicker(false));
  };

  const isNameValid = (() => {
    // Username rules: 3-30 chars, no consecutive special chars, no special char at start/end
    const usernameRegex = /^(?![._-])(?!.*[._-]{2})[a-zA-Z0-9._-]{3,30}(?<![._-])$/;
    return usernameRegex.test(name) && !usernameTaken && name.length > 0;
  })();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  // Compute DOB validity from validator so Continue button reflects correctness
  // const isDobValid = dob.length === 10 && dobError === '';
  const isDobValid = dob.length === 10 && validateDob(dob) === '';
  const isFormValid = isNameValid && isEmailValid && isDobValid;

  const getInputStyle = (field: 'name' | 'email' | 'dob') => {
    const isFocused = focusedInput === field;
    let isValid = false;

    if (field === 'name') isValid = isNameValid;
    if (field === 'email') isValid = isEmailValid;
    if (field === 'dob') isValid = isDobValid;

    if (isFocused) return [styles.input, styles.inputFocused];
    else if (isValid) return [styles.input, styles.inputValid];
    else return styles.input;
  };

  useEffect(() => {
    const hasNameError = name.length > 0 && !/^(?![._-])(?!.*[._-]{2})[a-zA-Z0-9._-]{3,30}(?<![._-])$/.test(name) || (name.length > 0 && usernameTaken);
    setShowNameError(hasNameError);
    Animated.timing(nameErrorAnim, {
      toValue: hasNameError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [name, usernameTaken]);

  useEffect(() => {
    const hasEmailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length > 0;
    setShowEmailError(hasEmailError);
    Animated.timing(emailErrorAnim, {
      toValue: hasEmailError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [email]);

  useEffect(() => {
    const hasDobError = !!dobError;
    setShowDobError(hasDobError);
    Animated.timing(dobErrorAnim, {
      toValue: hasDobError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [dobError]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.container,
        colorScheme === 'dark' && { backgroundColor: '#081426' }
      ]}
    >
      <TouchableOpacity
        style={[
          {
            position: 'absolute',
            top: Platform.OS === 'ios' ? 70 : 50,
            left: 20,
            padding: 10,
            backgroundColor: colorScheme === 'dark' ? '#192040' : '#ffffff',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            marginTop: 10,
          },
        ]}
        onPress={handleCancel}
        accessibilityRole="button"  // added
      >
        <Text
          style={[
            { color: colorScheme === 'dark' ? '#F1F1EF' : '#0B1B35', fontSize: 16, fontWeight: '600', textAlign: 'center' },
          ]}
        >
          Back
        </Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={[
        styles.header,
        colorScheme === 'dark' && { color: '#5B57BC' } // purple accent in dark
      ]}>
        Hey, welcome to Sesh
        <Text style={[
          styles.linkrText,
          colorScheme === 'dark' && { color: '#F1F1EF' } // white for "linkr" in dark
        ]}>linkr</Text>!
      </Text>

      <Text style={[
        styles.subHeader,
        colorScheme === 'dark' && { color: '#ffffff' } // soft gray in dark
      ]}>
        Let's get started. Enter your details to join the Seshlinkr community.
      </Text>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* CARD WRAPPER AROUND INPUTS */}
        <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
          {/* Name (username) input */}
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={[
                getInputStyle('name'), // was styles.input
                colorScheme === 'dark' && {
                  backgroundColor: '#192040',
                  borderColor: '#A9A6FF',
                  color: '#F1F1EF',
                },
              ]}
              placeholder="Username" // was "Name"
              placeholderTextColor={colorScheme === 'dark' ? '#A9A6FF' : '#5B57BC'}
              value={name}
              onChangeText={handleNameChange}
              autoCapitalize="none"    // added
              autoCorrect={false}      // added
              textContentType="username" // added
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              selectionColor="#5B57BC"
              accessibilityLabel="Username input"
              accessibilityHint="Enter your desired username"
            />
            {showNameError && (
              <Animated.View style={{ opacity: nameErrorAnim }}>
                <Text style={[styles.errorText, colorScheme === 'dark' && styles.errorTextDark]}>{nameError}</Text>
              </Animated.View>
            )}
          </View>

          {/* Email input */}
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={[
                getInputStyle('email'), // was styles.input
                colorScheme === 'dark' && {
                  backgroundColor: '#192040',
                  color: '#F1F1EF',
                  borderColor: '#A9A6FF',
                },
              ]}
              placeholder="Email Address"
              placeholderTextColor={colorScheme === 'dark' ? '#A9A6FF' : '#5B57BC'}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"      // added
              autoCorrect={false}        // added
              textContentType="emailAddress" // added
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              selectionColor="#5B57BC"
              accessibilityLabel="Email input"
              accessibilityHint="Enter your email address"
            />
            {showEmailError && (
              <Animated.View style={{ opacity: emailErrorAnim }}>
                <Text style={[styles.errorText, colorScheme === 'dark' && styles.errorTextDark]}>
                  Please enter a valid email address.
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Date of Birth input */}
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity
              style={[
                styles.dobInput,
                colorScheme === 'dark' && {
                  backgroundColor: '#192040',
                  borderColor: '#A9A6FF',
                }
              ]}
              onPress={handleDatePickerPress}
              activeOpacity={0.7}
              accessibilityLabel="Date of Birth input"
              accessibilityHint="Select your date of birth"
              accessibilityState={{ expanded: showDatePicker }}
            >
              <Text
                style={{
                  color: dob ? (colorScheme === 'dark' ? '#F1F1EF' : '#0B1B35') : (colorScheme === 'dark' ? '#A9A6FF' : '#5B57BC'),
                  fontSize: 16,
                  flex: 1
                }}
              >
                {dob ? formatDateToDisplay(dob) : 'Date of Birth'}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colorScheme === 'dark' ? '#A9A6FF' : '#5B57BC'}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>

            {showDobError && (
              <Animated.View style={{ opacity: dobErrorAnim }}>
                <Text style={[styles.errorText, colorScheme === 'dark' && styles.errorTextDark]}>
                  {dobError}
                </Text>
              </Animated.View>
            )}

            {showDatePicker && (
              <Animated.View
                style={{
                  opacity: datePickerFadeAnim,
                  transform: [{ translateY: datePickerSlideAnim }],
                  marginTop: 10,
                }}
              >
                <DateTimePicker
                  value={dob ? new Date(dob.split('/').reverse().join('-')) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDobChange}
                  maximumDate={new Date()}
                />
              </Animated.View>
            )}
          </View>

          <Text style={[
            styles.subHeader,
            { marginTop: 6, marginBottom: 0, textAlign: 'left', fontSize: 14 },
            colorScheme === 'dark' && { color: '#AAB2C8' }
          ]}>
            Make sure this matches your legal age.
          </Text>
        </View>
        {/* END CARD */}
      </Animated.View>

      {/* Full-width Continue button for SignUp only */}
      <TouchableOpacity
        style={[
          styles.nextButtonFull,
          !isFormValid && styles.nextButtonDisabled,
          colorScheme === 'dark' && isFormValid && {
            backgroundColor: '#5B57BC',
            borderColor: '#AAB2C8',
          }
        ]}
        onPress={handleNext}
        disabled={!isFormValid}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Continue button"
        accessibilityHint="Proceed to the next step"
      >
        <Text style={[
          styles.nextButtonText,
          (!isFormValid) && { color: colorScheme === 'dark' ? '#6B7280' : '#9CA3AF' },
          colorScheme === 'dark' && isFormValid && { color: '#F1F1EF' }
        ]}>
          Continue
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    backgroundColor: '#F5F5F7', // Updated light mode background color
    justifyContent: 'flex-start',
  },
  lightModeColor: {
    color: '#0B1B35', // Define color for light mode
  },
  darkModeColor: {
    color: '#F1F1EF', // Define color for dark mode
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
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 15,
    marginTop: 50,
  },
  header: {
    fontSize: 25,
    fontFamily: 'Usual-Bold',
    textAlign: 'left',
    marginLeft: 10,
    marginTop: -25,
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
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
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
  inputValid: {
    borderColor: '#0B1B35',
  },
  errorText: {
    fontSize: 14,
    color: '#e2264fff', // Default color, override in component if dark mode
    marginBottom: -10,
    marginTop: 10,
    marginLeft: 10,
  },
  errorTextDark: {
    color: '#f86383ff', // brighter error color for dark mode
  },
  nextButton: {
    position: 'absolute',
    bottom: 45,
    right: 20,
    backgroundColor: '#0B1B35',
    paddingVertical: 13,
    paddingHorizontal: 33,
    borderRadius: 23,
    elevation: 2,
    borderWidth: 2,
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Usual-Medium',
    fontSize: 16,
  },
  dobInput: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0B1B35',
    borderColor: '#5B57BC',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Modern card styles
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

  // Full-width primary button (used only by SignUpScreen)
  nextButtonFull: {
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
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
});

export function SignInScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const colorScheme = useColorScheme();

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

  const handleSignIn = () => {
    if (isFormValid) {
      navigation.navigate('homescreen');
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const getInputStyle = (field: 'email' | 'password') => {
    const isFocused = focusedInput === field;
    let isValid = false;

    if (field === 'email') isValid = isEmailValid;
    if (field === 'password') isValid = isPasswordValid;

    if (isFocused) return [styles.input, styles.inputFocused];
    else if (isValid) return [styles.input, styles.inputValid];
    else return styles.input;
  };

  useEffect(() => {
    const hasEmailError = !isEmailValid && email.length > 0;
    setShowEmailError(hasEmailError);
    Animated.timing(emailErrorAnim, {
      toValue: hasEmailError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [email]);

  useEffect(() => {
    const hasPasswordError = !isPasswordValid && password.length > 0;
    setShowPasswordError(hasPasswordError);
    Animated.timing(passwordErrorAnim, {
      toValue: hasPasswordError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[
        styles.container,
        colorScheme === 'dark' && { backgroundColor: '#0B1B35' }
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={[
        styles.header,
        colorScheme === 'dark' && { color: '#5B57BC' }
      ]}>
        Welcome back to Sesh
        <Text style={[
          styles.linkrText,
          colorScheme === 'dark' && { color: '#F1F1EF' }
        ]}>linkr</Text>!
      </Text>

      <Text style={[
        styles.subHeader,
        colorScheme === 'dark' && { color: '#ffffff' }
      ]}>
        Sign in to continue.
      </Text>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Email input */}
        <View style={{ position: 'relative', marginBottom: 10 }}>
          <Text
            style={{
              position: 'absolute',
              left: 20,
              top: -6,
              fontSize: 12,
              color: colorScheme === 'dark' ? '#ffffff' : '#5B57BC',
              fontFamily: 'Usual-Regular',
              zIndex: 2,
              backgroundColor: 'transparent',
              pointerEvents: 'none',
            }}
          >
            Email address
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                getInputStyle('email'),
                colorScheme === 'dark' && {
                  backgroundColor: '#192040',
                  color: '#F1F1EF',
                  borderColor: '#192040',
                }
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor={colorScheme === 'dark' ? '#ffffff' : '#5B57BC'}
            />
          </View>
        </View>
        <Animated.View style={{ opacity: emailErrorAnim }}>
          <Text style={[
            styles.errorText,
            colorScheme === 'dark' && styles.errorTextDark
          ]}>
            {!isEmailValid && email.length > 0 ? 'Please enter a valid email address.' : ' '}
          </Text>
        </Animated.View>

        {/* Password input */}
        <View style={{ position: 'relative', marginBottom: 10 }}>
          <Text
            style={{
              position: 'absolute',
              left: 20,
              top: -6,
              fontSize: 12,
              color: colorScheme === 'dark' ? '#ffffff' : '#5B57BC',
              fontFamily: 'Usual-Regular',
              zIndex: 2,
              backgroundColor: 'transparent',
              pointerEvents: 'none',
            }}
          >
            Password
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                getInputStyle('password'),
                colorScheme === 'dark' && {
                  backgroundColor: '#192040',
                  color: '#F1F1EF',
                  borderColor: '#192040',
                }
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor={colorScheme === 'dark' ? '#ffffff' : '#5B57BC'}
            />
          </View>
        </View>
        <Animated.View style={{ opacity: passwordErrorAnim }}>
          <Text style={[
            styles.errorText,
            colorScheme === 'dark' && styles.errorTextDark
          ]}>
            {!isPasswordValid && password.length > 0 ? 'Password must be at least 6 characters.' : ' '}
          </Text>
        </Animated.View>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !isFormValid && { opacity: 0.5 },
          colorScheme === 'dark' && {
            backgroundColor: '#5B57BC',
            borderColor: '#ffffff',
          }
        ]}
        onPress={handleSignIn}
        disabled={!isFormValid}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Sign In button"
        accessibilityHint="Sign in to your account"
      >
        <Text style={[
          styles.nextButtonText,
          colorScheme === 'dark' && { color: '#F1F1EF' }
        ]}>Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}