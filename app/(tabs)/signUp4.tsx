import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleProp,
  StyleSheet,
  Switch,
  Text, // added
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { RootStackParamList } from './types';

function OptionToggle({
  title,
  subtitle,
  value,
  onValueChange,
  subtitleStyle, // added
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  subtitleStyle?: StyleProp<TextStyle>; // added
}) {
  // Animation for toggle bounce
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme(); // read theme for this component

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    onValueChange(!value);
  };

  return (
    <View style={styles.optionContainer}>
      <View style={styles.textGroup}>
        <Text style={[styles.optionTitle, colorScheme === 'dark' && styles.optionTitleDark]}>
          {title}
        </Text>
        <Text
          style={[
            styles.optionSubtitle,
            colorScheme === 'dark' && styles.optionSubtitleDark,
            subtitleStyle, // added to allow override
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleToggle}
        style={styles.toggleTouchable}
        accessibilityLabel={`${title} toggle`}
        accessibilityHint={`Toggle to ${value ? 'disable' : 'enable'} ${title.toLowerCase()}`}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Switch
            value={value}
            onValueChange={handleToggle}
            trackColor={{ false: '#ccc', true: '#5B57BC' }}
            // Make thumb white in dark mode; keep existing behavior for light mode
            thumbColor={colorScheme === 'dark' ? '#FFFFFF' : (value ? '#0B1B35' : '#ffffff')}
            style={{ opacity: 1 }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default function SignUpContinued() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [receiveEmails, setReceiveEmails] = useState(false);
  const [connectWithContacts, setConnectWithContacts] = useState(false); // merged toggle
  const colorScheme = useColorScheme(); // add this line

  // Animation for fade/slide-in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = () => {
    navigation.navigate('setPassword');
  };

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert('No previous screen to go back to.');
    }
  };

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    });
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
      {/* Replace Back button with the provided snippet */}
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

      <View style={{ marginBottom: 20, marginTop: 50, alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/Seshlinkr_logo_purple_transparent.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Seshlinkr logo"
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[
          styles.header,
          colorScheme === 'dark' && { color: '#5B57BC' }
        ]}>
          Tailor your Sesh
          <Text style={[
            styles.linkr,
            colorScheme === 'dark' && { color: '#F1F1EF' }
          ]}>linkr</Text>
          {' '}experience.
        </Text>

        {/* MODERN CARD WRAPPER FOR TOGGLES */}
        <View style={[
          styles.card,
          colorScheme === 'dark' ? styles.cardDark : styles.cardLight
        ]}>
          <OptionToggle
            title="Get more out of Seshlinkr."
            subtitle="Receive email about your Seshlinkr activity and recommendations."
            value={receiveEmails}
            onValueChange={setReceiveEmails}
            subtitleStyle={colorScheme === 'dark' ? { color: '#ffffff' } : { color: '#5B57BC' }}
          />
          <View style={styles.cardDivider} />
          <OptionToggle
            title="Connect with people you know."
            subtitle="Let others find your Seshlinkr account by your email address or phone number."
            value={connectWithContacts}
            onValueChange={setConnectWithContacts}
            subtitleStyle={colorScheme === 'dark' ? { color: '#ffffff' } : { color: '#5B57BC' }}
          />
        </View>
        {/* END CARD */}
      </Animated.View>

      <Text style={[
        styles.disclaimer,
        colorScheme === 'dark' && { color: '#ffffff' }
      ]}>
        By continuing, you agree to our{' '}
        <Text
          style={[
            styles.linkText,
            colorScheme === 'dark' && { color: '#A9A6FF' }
          ]}
          onPress={() => openLink('https://example.com/terms')}
          accessibilityRole="link"
          accessibilityLabel="Terms and Conditions"
        >
          Terms
        </Text>
        ,{' '}
        <Text
          style={[
            styles.linkText,
            colorScheme === 'dark' && { color: '#A9A6FF' }
          ]}
          onPress={() => openLink('https://example.com/privacy')}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
        >
          Privacy Policy
        </Text>
        , and{' '}
        <Text
          style={[
            styles.linkText,
            colorScheme === 'dark' && { color: '#A9A6FF' }
          ]}
          onPress={() => openLink('https://example.com/cookies')}
          accessibilityRole="link"
          accessibilityLabel="Cookie Use"
        >
          Cookie Use
        </Text>
        . We may use your contact information for purposes outlined in our Privacy Policy.
      </Text>

      <TouchableOpacity
        style={[
          styles.nextButtonFull,
          colorScheme === 'dark' && {
            backgroundColor: '#5B57BC',
            borderColor: '#AAB2C8',
          }
        ]}
        onPress={handleNext}
        accessibilityRole="button"
        accessibilityLabel="Next button"
        accessibilityHint="Proceed to the final step"
      >
        <Text style={[
          styles.nextButtonText,
          colorScheme === 'dark' && { color: '#F1F1EF' }
        ]}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    padding: 20,
    paddingTop: 70,
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
  image: {
    width: 50,
    height: 50,
    marginTop: 20,
  },
  header: {
    fontSize: 25,
    fontFamily: 'Usual-Bold',
    color: '#5B57BC',
    marginBottom: 15,
  },
  linkr: {
    color: '#0B1B35',
    fontFamily: 'Usual-Bold',
  },
  optionContainer: {
    // keep layout inside card tidy
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
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
    backgroundColor: 'hsla(0, 0%, 100%, 0.04)',
    borderColor: '#22304F',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
    borderRadius: 1,
  },
  textGroup: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    color: '#0B1B35',
    marginBottom: 4,
  },
  optionTitleDark: {
    color: '#5B57BC',
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Usual-Medium',
    color: '#5B57BC',
  },
  optionSubtitleDark: {
    color: '#5B57BC',
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Usual-Regular',
    color: '#5B57BC',
    lineHeight: 18,
  },
  linkText: {
    color: '#0B1B35',
    fontFamily: 'Usual-Regular',
  },
  toggleTouchable: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Usual-Medium',
    fontSize: 16,
  },
});