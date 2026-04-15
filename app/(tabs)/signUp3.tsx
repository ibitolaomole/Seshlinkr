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
  useColorScheme,
  View
} from 'react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { RootStackParamList } from './types';

export default function PhoneNumberScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('GB');
  const [callingCode, setCallingCode] = useState('44');
  const [country, setCountry] = useState<Country | null>(null);
  const colorScheme = useColorScheme();
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [isCountryActive, setIsCountryActive] = useState(false);

  // E.164: + followed by 7–15 digits total (country code + local)
  const E164_REGEX = /^\+[1-9]\d{6,14}$/;
  const maxLocalDigits = Math.max(0, 15 - String(callingCode).length);

  // Replace isFormValid to use E.164
  const isFormValid = E164_REGEX.test(`+${callingCode}${phone.replace(/\D/g, '')}`);

  const handleNext = () => {
    // Allow skipping if no phone is provided
    if (phone.trim().length === 0) {
      navigation.navigate('signUp4');
      return;
    }
    // Validate only when a phone is entered
    const fullPhone = `+${callingCode}${phone.replace(/\D/g, '')}`;
    if (/^\+?[1-9]\d{6,14}$/.test(fullPhone)) {
      navigation.navigate('signUp4');
    } else {
      setError('Please enter a valid phone number.');
    }
  };

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    const limited = digitsOnly.slice(0, maxLocalDigits);
    setPhone(limited);

    if (error && E164_REGEX.test(`+${callingCode}${limited}`)) {
      setError('');
    }
  };

  const handleBlur = () => {
    const fullPhone = `+${callingCode}${phone.replace(/\D/g, '')}`;
    if (phone && !E164_REGEX.test(fullPhone)) {
      setError('Phone number must be 7–15 digits (including country code).');
    }
    setIsFocused(false);
  };

  const getInputStyle = () => {
    if (error) return [styles.input, styles.inputError];
    if (isFocused) return [styles.input, styles.inputFocused];
    return [styles.input, styles.inputValid];
  };

  const callingDisplayText = callingCode ? `+${callingCode}` : '+ Code';
  const countryBorderColor =
    isCountryActive
      ? (colorScheme === 'dark' ? '#AAB2C8' : '#E5E7EB')
      : (colorScheme === 'dark' ? '#3D4A6B' : '#E5E7EB');

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
        onPress={() => navigation.goBack()}
      >
        <Text
          style={[
            { color: colorScheme === 'dark' ? '#F1F1EF' : '#0B1B35', fontSize: 16, fontWeight: '600', textAlign: 'center' }
          ]}
        >
          Back
        </Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 20, marginTop: 40, alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={[
          styles.header,
          colorScheme === 'dark' && { color: '#5B57BC' }
        ]}>Add your mobile number.</Text>
        <Text style={[
          styles.subHeader,
          colorScheme === 'dark' && { color: '#ffffff' }
        ]}>Select your country and enter your number.</Text>

        <Text style={[
          styles.optionalMessage,
          colorScheme === 'dark' && { color: '#ffffff' }
        ]}>
          You can add your mobile number now or skip and add it later.
        </Text>

        {/* MODERN CARD CONTAINER */}
        <View
          style={[
            styles.card,
            colorScheme === 'dark' ? styles.cardDark : styles.cardLight
          ]}
        >
          <View style={styles.twoColRow}>
            {/* Country code (left) */}
            <View style={styles.fieldBlock}>
              <Text
                style={[
                  styles.fieldLabel,
                  colorScheme === 'dark' && { color: '#AAB2C8' }
                ]}
              >
                Country code
              </Text>

              <View
                style={[
                  styles.underlineBox,
                  { borderBottomColor: countryBorderColor }
                ]}
              >
                {/* Make the code row the trigger. No flags shown. */}
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountryModalVisible(true);
                    setIsCountryActive(true);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Select country code"
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.callingDisplay,
                      colorScheme === 'dark' && { color: '#ffffff' }
                    ]}
                    numberOfLines={1}
                  >
                    {callingDisplayText}
                  </Text>
                  <Text
                    style={[
                      styles.caret,
                      colorScheme === 'dark' && { color: '#ffffff' }
                    ]}
                  >
                    ▾
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mobile number (right) */}
            <View style={[styles.fieldBlock, { flex: 1, marginLeft: 16 }]}>
              <Text
                style={[
                  styles.fieldLabel,
                  colorScheme === 'dark' && { color: '#AAB2C8' }
                ]}
              >
                Mobile number
              </Text>

              <TextInput
                style={[
                  styles.textInputUnderline,
                  {
                    borderBottomColor: error
                      ? '#D6001C'
                      : isFocused
                      ? (colorScheme === 'dark' ? '#3D4A6B' : '#E5E7EB')
                      : (colorScheme === 'dark' ? '#3D4A6B' : '#E5E7EB'),
                  },
                  colorScheme === 'dark' && { color: '#F1F1EF' }
                ]}
                placeholder=" "
                placeholderTextColor={colorScheme === 'dark' ? '#5B57BC' : '#9CA3AF'}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                selectionColor={colorScheme === 'dark' ? '#AAB2C8' : '#E5E7EB'}
                accessible
                accessibilityLabel="Phone Number Input"
                maxLength={maxLocalDigits} // dynamic limit so total <= 15
              />
            </View>
          </View>

          <Text style={[
            styles.regionNote,
            { marginTop: 8, marginBottom: 0 },
            colorScheme === 'dark' && { color: '#AAB2C8' }
          ]}>
            Tap the code to change your country.
          </Text>
        </View>
        {/* END CARD */}

        {/* Modal-only CountryPicker (no flag) */}
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withCallingCode
          withFlag={false}
          withEmoji={false}
          withCountryNameButton={false}
          withFlagButton={false}
          visible={countryModalVisible}
          onClose={() => {
            setCountryModalVisible(false);
            setIsCountryActive(false);
          }}
          onSelect={(c) => {
            setCountryCode(c.cca2);
            setCallingCode(c.callingCode[0] || '');
            setCountry(c);
            // Trim local part if new calling code reduces remaining length
            const newMax = Math.max(0, 15 - String(c.callingCode[0] || '').length);
            setPhone(prev => prev.replace(/\D/g, '').slice(0, newMax));
            setCountryModalVisible(false);
            setIsCountryActive(false);
          }}
        />
      </Animated.View>

      {error ? (
        <Text style={[
          styles.inputErrorText,
          colorScheme === 'dark' && styles.inputErrorTextDark
        ]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.nextButton,
          colorScheme === 'dark' && {
            backgroundColor: '#5B57BC',
            borderColor: '#AAB2C8',
          }
        ]}
        onPress={handleNext}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Continue button"
        accessibilityHint="Proceed to the next step"
      >
        <Text
          style={styles.nextButtonText}
        >
          Continue
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
  header: {
    fontSize: 25,
    fontFamily: 'Usual-Bold',
    color: '#5B57BC',
    marginBottom: 8,
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 20,
  },
  subHeader: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35',
    marginBottom: 25,
    marginLeft: 5,
  },
  optionalMessage: {
    fontSize: 14,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35',
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  // New layout styles for the two-column, underlined design
  twoColRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  fieldBlock: {
    minWidth: 120,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Usual-Regular',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  underlineBox: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    // Make height match the TextInput underline field and center contents
    height: 48,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingDisplay: {
    fontSize: 16,
    fontFamily: 'Usual-Regular',
    color: '#0B1B35',
    fontWeight: '600',
  },
  caret: {
    marginLeft: 8,
    fontSize: 12,
    color: '#0B1B35', // was '#6B7280' — light mode color set to #0B1B35
  },
  textInputUnderline: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    // Match fixed height with country selector
    height: 48,
    paddingVertical: 0,
    fontSize: 16,
    letterSpacing: 0.25,
    fontFamily: 'Usual-Regular',
    color: '#0B1B35',
  },

  // MODERN CARD
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

  inputErrorText: {
    color: '#D6001C',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
    marginLeft: 5,
    fontFamily: 'Usual-Medium',
    minHeight: 16,
  },
  inputErrorTextDark: {
    color: '#FF6B8A', // brighter error color for dark mode
  },
  regionNote: {
    fontSize: 14,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35', // Darker purple for better contrast
    marginLeft: 5,
    marginBottom: 10,
    marginTop: -35,
  },
  nextButton: {
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
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Usual-Medium',
    fontSize: 16,
  },
});
