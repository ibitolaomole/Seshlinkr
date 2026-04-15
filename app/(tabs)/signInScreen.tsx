import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Import Expo Location API
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function SignInScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const [postcode, setPostcode] = useState('');
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null); // State for location
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false); // State for permission denial
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [passwordInputHeight, setPasswordInputHeight] = useState(0); // State to track input height
  const [usernameTouched, setUsernameTouched] = useState(false); // Track if username input was touched
  const [passwordTouched, setPasswordTouched] = useState(false); // Track if password input was touched

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } else {
        setLocationPermissionDenied(true);
      }
    };

    requestLocationPermission();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('signUp1' as never); // Explicitly cast to 'never' to match type
  };

  const handleSignIn = () => {
    navigation.navigate('homescreen' as never); // Navigate to home screen
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordInputLayout = (event: any) => {
    setPasswordInputHeight(event.nativeEvent.layout.height); // Capture the height of the input
  };

  const validateUsername = async (username: string): Promise<string | null> => {
    const regex = /^(?!.*[_.]{2})[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9_.]*[a-zA-Z0-9]$/;
    const offensiveWords = ['badword1', 'badword2']; // Replace with actual offensive words
    const lowerUsername = username.toLowerCase();

    if (!regex.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and periods, and must not start or end with _ or .';
    }

    if (offensiveWords.some((word) => lowerUsername.includes(word))) {
      return 'Username contains inappropriate content.';
    }

    // Simulate a uniqueness check (replace with actual API/database call)
    const isUnique = await checkUsernameUniqueness(lowerUsername);
    if (!isUnique) {
      return 'Username is already taken.';
    }

    return null;
  };

  const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
    // Replace with actual API/database call
    const existingUsernames = ['ibitola', 'john_doe']; // Example existing usernames
    return !existingUsernames.includes(username);
  };

  const handleUsernameChange = async (text: string) => {
    setUsername(text);
    if (text.length >= 3) {
      const validationError = await validateUsername(text);
      if (validationError) {
        console.log(validationError); // Replace with UI feedback
      }
    }
  };

  const styles = getStyles(isDarkMode, passwordInputHeight);

  // Minimal validity for button state
  const isFormValid = username.trim().length > 0 && emailOrPhone.length >= 6;
  const showPasswordError =
    passwordTouched && emailOrPhone.length > 0 && emailOrPhone.length < 6;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Image
            source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
            style={styles.logo}
          />
          <Text style={styles.header}>
            <Text style={styles.linkUpText}>Link Up.</Text>{' '}
            <Text style={styles.forRealText}>For Real.</Text>
          </Text>
          <Text style={styles.subHeader}>See what's happening near you.</Text>

          {/* Modern card wrapper for inputs */}
          <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
            {locationPermissionDenied && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Postcode (optional)"
                  placeholderTextColor={styles.placeholderText.color}
                  value={postcode}
                  onChangeText={setPostcode}
                  keyboardType="default"
                  autoCapitalize="none"
                  selectionColor="#5B57BC"
                />
                <Text style={styles.hintText}>
                  Postcode helps us show local content if GPS is unavailable.
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email, phone number, or username"
                placeholderTextColor={styles.placeholderText.color}
                value={username}
                onChangeText={handleUsernameChange}
                onBlur={() => setUsernameTouched(true)}
                keyboardType="default"
                autoCapitalize="none"
                selectionColor="#5B57BC"
              />
              {usernameTouched && username.length > 0 && username.length < 3 && (
                <Text style={styles.hintText}>
                  Username must be at least 3 characters long.
                </Text>
              )}
            </View>

            <View style={[styles.inputContainer, showPasswordError && styles.inputContainerTight]}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={styles.placeholderText.color}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={!passwordVisible}
                onLayout={handlePasswordInputLayout}
                onBlur={() => setPasswordTouched(true)}
                selectionColor="#5B57BC"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
                accessibilityLabel="Toggle password visibility"
              >
                <Image
                  source={
                    passwordVisible
                      ? require('../../assets/images/Seshlinkr_eye_blue_cross.png')
                      : require('../../assets/images/Seshlinkr_eye_blue.png')
                  }
                  style={[
                    styles.eyeIconImage,
                    isDarkMode ? { tintColor: '#A9A6FF' } : { tintColor: '#5B57BC' },
                  ]}
                />
              </TouchableOpacity>
              {showPasswordError && (
                <Text style={styles.hintText}>
                  Password must be at least 6 characters long.
                </Text>
              )}
            </View>

            {/* NEW: divider between inputs and actions */}
            <View style={styles.orDividerContainer}>
              <View style={styles.orDividerLine} />
              <Text style={styles.orDividerText}>or</Text>
              <View style={styles.orDividerLine} />
            </View>
            {/* Keep helper actions grouped near inputs */}
            <Pressable
              style={styles.forgotPasswordButton}
              onPress={() => console.log('Forgot password pressed')}
              accessibilityLabel="Forgot your password"
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </Pressable>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                New to <Text style={styles.seshText}>Sesh</Text>
                <Text style={styles.linkrText}>linkr</Text>?{' '}
                <Text
                  style={styles.signUpLink}
                  onPress={handleSignUpNavigation}
                >
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
          {/* End card */}

          {/* Footer remains */}
          <Text style={styles.footerText}>Be part of something real. © 2026 Seshlinkr.</Text>
        </ScrollView>

        {/* Full-width sticky Sign in button */}
        <Pressable
          style={[
            styles.signInButtonFull,
            !isFormValid && styles.signInButtonDisabled,
          ]}
          onPress={handleSignIn}
          disabled={!isFormValid}
          accessibilityLabel="Sign in"
          accessibilityState={{ disabled: !isFormValid }}
        >
          <Text
            style={[
              styles.signInButtonText,
              !isFormValid && styles.signInButtonTextDisabled,
            ]}
          >
            Sign in
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean, passwordInputHeight: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#081426' : '#F5F5F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#0B1B35' : '#F1F1EF',
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 15,
    marginTop: 70,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: isDarkMode ? '#A9A6FF' : '#5B57BC',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 0,
    fontFamily: 'Usual-Bold',
  },
  linkUpText: {
    color: isDarkMode ? '#5B57BC' : '#5B57BC', // Gold for dark mode, orange-red for light mode
    fontWeight: '600',
  },
  forRealText: {
    color: isDarkMode ? '#F1F1EF' : '#0B1B35', // Lime green for dark mode, green for light mode
    fontWeight: '600',
  },
  subHeader: {
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#0B1B35',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 10,
    fontFamily: 'Usual-Medium',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  inputContainerTight: {
    marginBottom: 0, // collapse gap under the error
  },
  input: {
    backgroundColor: isDarkMode ? '#192040' : '#ffffff',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: isDarkMode ? '#F1F1EF' : '#0B1B35',
    borderColor: isDarkMode ? '#A9A6FF' : '#5B57BC',
    borderWidth: 1.5, // Add border width
  },
  placeholderText: {
    color: isDarkMode ? '#A9A6FF' : '#5B57BC',
  },
  hintText: {
    fontSize: 14,
    color: isDarkMode ? '#f86383ff' : '#e2264fff',
    marginTop: 10,
    marginLeft: 10,
  },
  signInButtonFull: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    backgroundColor: isDarkMode ? '#ffffff' : '#0B1B35',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: isDarkMode ? '#ffffff' : '#0B1B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  signInButtonDisabled: {
    backgroundColor: isDarkMode ? '#22304F' : '#E5E7EB',
    borderColor: isDarkMode ? '#22304F' : '#E5E7EB',
    elevation: 0,        // remove Android shadow
    shadowOpacity: 0,    // no iOS shadow
  },
  signInButtonText: {
    color: isDarkMode ? '#0B1B35' : '#ffffff', // Dark blue for dark mode, gold for light mode
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInButtonTextDisabled: {
    color: isDarkMode ? '#AAB2C8' : '#9CA3AF',
  },
  footerText: {
    fontSize: 14,
    color: isDarkMode ? '#ffffff' : '#0B1B35',
    marginTop: 150,
    marginBottom: -25,
    textAlign: 'center',
    fontFamily: 'Usual-Medium',
    paddingVertical: 5, // Add vertical padding
    paddingHorizontal: 10, // Add horizontal padding
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 50, // Adjust position based on platform
    left: 20,
    padding: 10,
    backgroundColor: isDarkMode ? '#192040' : '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: -50, // Adjust margin top for better spacing
  },
  backButtonText: {
    color: isDarkMode ? '#ffffff' : '#5B57BC',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 16,        // balanced spacing from divider
    paddingVertical: 10, // Add padding
    paddingHorizontal: 20,
    backgroundColor: isDarkMode ? '#192040' : '#ffffff', // Add background color
    borderRadius: 20, // Make it rounded
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'stretch', // make width match inputs
  },
  forgotPasswordText: {
    color: isDarkMode ? '#A9A6FF' : '#5B57BC', // Brighten purple for better contrast
    fontSize: 16,
    fontWeight: 'bold', // Use bold weight for better readability
    textAlign: 'center',
  },
  signUpContainer: {
    marginTop: 14,        // balanced spacing between actions
    alignItems: 'center',
    paddingVertical: 10, // Add padding
    paddingHorizontal: 20,
    backgroundColor: isDarkMode ? '#192040' : '#ffffff', // Add background color
    borderRadius: 20, // Make it rounded
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'stretch', // make width match inputs
  },
  signUpText: {
    fontSize: 16,
    color: isDarkMode ? '#A9A6FF' : '#5B57BC',
    textAlign: 'center',
    fontFamily: 'Usual-Medium',
  },
  seshText: {
    fontWeight: '600',
    color: '#5B57BC',
  },
  linkrText: {
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#0B1B35',
  },
  signUpLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: isDarkMode ? '#A9A6FF' : '#5B57BC',
  },
  tooltipText: {
    color: isDarkMode ? '#A9A6FF' : '#5B57BC',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: passwordInputHeight / 2, // Dynamically position based on input height
    transform: [{ translateY: -12 }], // Center the icon vertically
    zIndex: 1, // Ensure it appears above other elements
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain', // Ensure the icon scales properly
  },
  // Modern card styles
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardDark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: '#22304F',
  },
  cardDivider: {
    height: 3,
    marginLeft: '35%',
    width: '30%',
    alignSelf: 'stretch',
    backgroundColor: isDarkMode ? '#a9a6ffbf' : '#5B57BC',
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 2,
  },
  cardDividerUnderError: {
    marginTop: 7, // much tighter gap under the error
  },
  // --- Add these styles for the "or" divider ---
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'stretch',
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: isDarkMode ? '#e5e7eb33' : '#e5e7eb',
  },
  orDividerText: {
    marginHorizontal: 10,
    color: '#b0b0b0',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
});