import { FontAwesome } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { fetchChatMessages } from '../../api';
import { RootStackParamList } from './navigationTypes';

const chatStyles = StyleSheet.create({
  chatBubble: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
    elevation: 5,
    // Removed fixed width so bubble sizes to content
    // width: '95%',
    alignSelf: 'flex-start', // was 'center' - let bubble size to its content and align left
    overflow: 'hidden',
    borderColor: '#885BD0',
    // Removed minHeight so height grows naturally with text
    // minHeight: 60,
    backgroundColor: 'transparent',
  },
  chatText: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: 'Usual-Regular',
    lineHeight: 25, // consistent line height for varying text lengths
    flexShrink: 1,  // allow text wrap without overflow
  },
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // was 'space-between' - causes huge gaps
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 0, // prevent row from stretching to full width
  },
  plusButton: {
    backgroundColor: '#812B58',
    width: 53,
    height: 53,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 18, // Android
    borderWidth: 2,
    borderColor: '#9467B9',
  },
  dotsButton: {
    width: 100,
    height: 20,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#8E84D1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 18, // Android
  },
  arrowButton: {
    backgroundColor: '#0C2B65',
    width: 53,
    height: 53,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 18, // Android
    borderWidth: 2,
    borderColor: '#3E539D',
    position: 'relative',
    marginLeft: 8, // Adjusted spacing
  },
  skipButton: {
    position: 'absolute',
    top: 6,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingActions: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

const chatMessages = [
  "Movie night at Eliot Building today, free snacks and drinks! 🍿🥤",
  "anyone else in 2nd year economics doing a revision all-nighter tonight?",
  "The blonde girl working in co op every morning this week is so hot man",
  "had so many silent study eye contact ships recently, just not brave enough to speak to them",
  "Pizza and Smash Bros at 5 today at Kennedy Seminar Room 3. Just show up. 🍕",
  "To the guy in parkwood screaming at his game it can't be that serious",
  "Congrats to the guy that mashed up the camera guy outside McDs, he needed it.",
  "To the guy in the black volkswagen with a certain flag on the roof - I AGREE WITH YOU + YOU SHOULD MARRY ME",
  "wat is wrong with mungos's staff - why is they always grumpy and rude to us like wat did we do to them?!?!",
  "Griffin really was the main character of campus. RIP, legend 💛"
];


const SCREEN_WIDTH = Dimensions.get('window').width;

// Constants for typing/deleting intervals
const TYPING_INTERVAL = 40;
const DELETING_INTERVAL = 50;
const NETWORK_CHECK_INTERVAL = 10000; // Increased to 10 seconds

// Reusable shadow styles
const shadowStyles = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 18,
  },
};

// Abstract common button styles
import type { FlexAlignType } from 'react-native';

const baseButtonStyle = {
  borderRadius: 28,
  justifyContent: 'center' as 'center',
  alignItems: 'center' as FlexAlignType,
  ...shadowStyles.light,
};

export default function HomeScreen() {
  const [visibleMessage, setVisibleMessage] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const messageIndex = useRef<number>(0);

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();

  // Animated entrance for logo and buttons
  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  // Animate logo and buttons on mount
  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    Animated.timing(buttonsAnim, {
      toValue: 1,
      duration: 900,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const typeMessage = (message: string, callback: () => void) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    setIsTyping(true);
    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      if (index <= message.length) {
        setVisibleMessage(message.substring(0, index));
        index++;
      } else {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setIsTyping(false);
        callback();
      }
    }, TYPING_INTERVAL);
  };

  const deleteMessage = (message: string, callback: () => void) => {
    setIsDeleting(true);

    let index = message.length;
    const interval = setInterval(() => {
      if (index > 0) {
        setVisibleMessage((prev) => prev.slice(0, -1));
        index--;
      } else {
        clearInterval(interval);
        setIsDeleting(false);
        callback();
      }
    }, DELETING_INTERVAL);
  };

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const status = await Network.getNetworkStateAsync();
        if (isMounted) {
          setIsConnected(status.isConnected ?? true);
        }
      } catch (error) {
        console.error('Network check error:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, NETWORK_CHECK_INTERVAL);

    const startMessageLoop = (messages: string[]) => {
      if (!isMounted) return;
      
      const showMessage = () => {
        if (!isMounted) return;
        
        const nextMsg = messages[messageIndex.current % messages.length];
        console.log(`Displaying message index: ${messageIndex.current % messages.length}`);
        typeMessage(nextMsg, () => {
          if (!isMounted) return;
          
          setTimeout(() => {
            if (!isMounted) return;
            
            deleteMessage(nextMsg, () => {
              if (!isMounted) return;
              
              messageIndex.current += 1;
              showMessage();
            });
          }, 2500);
        });
      };
      showMessage();
    };

    const fetchAndDisplayMessages = async () => {
      try {
        const fetchedMessages = await fetchChatMessages();
        console.log(`Fetched messages count: ${fetchedMessages?.length || 0}`);
        const hasValidMessages =
          Array.isArray(fetchedMessages) && fetchedMessages.length > 0;
        if (isMounted) {
          startMessageLoop(hasValidMessages ? fetchedMessages : chatMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (isMounted) {
          startMessageLoop(chatMessages);
        }
      }
    };

    fetchAndDisplayMessages();

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      // Stop animations on unmount
      logoAnim.stopAnimation();
      buttonsAnim.stopAnimation();
      emptyBubbleAnim.stopAnimation();
      shimmerAnim.stopAnimation();
      waveAnim.stopAnimation();
    };
  }, []);

  // Placeholder animation for empty chat bubble
  const emptyBubbleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(emptyBubbleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(emptyBubbleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visibleMessage ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visibleMessage]);

  // Shimmer animation for loading message
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse wave animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  };

  const buttonColors = {
    light: {
      apple: '#ffffff',
      google: '#ffffff',
      signIn: '#ffffff',
    },
    dark: {
      apple: '#0e2041ff',
      google: '#0e2041ff',
      signIn: '#0e2041ff',
    },
  };

  const isLoading = !visibleMessage && !isTyping;

  return (
    <View style={[
      styles.container,
      colorScheme === 'dark' && { backgroundColor: '#081426' }
    ]}>
      {/* Light mode subtle background gradient */}
      {colorScheme !== 'dark' && (
        <LinearGradient
          colors={['#F1F1EF', '#F7F7FB', '#E9E6F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      <View style={[styles.chatContainer, { left: -15, paddingLeft: 40 }]}>
        <View style={[styles.chatBubbleWrapper, { marginLeft: 0, alignSelf: 'flex-start' }]}>
          <Text style={[styles.chatLabel, { marginBottom: -1.5 }, colorScheme === 'dark' && { color: '#e0e0e0' }]}>Local Event</Text>
          <View style={[
            chatStyles.chatBubble,
            isLoading && {
              // Let loading bubble size naturally as well
              // width: 315,
              // height: 60,
              borderRadius: 34,
              paddingVertical: 0,
              paddingHorizontal: 0,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }
          ]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['#5642D4', '#9556F5', '#5642D4', '#20254C']
                  : ['#885BD0', '#4C41AD', '#32349F', '#2E329D']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                StyleSheet.flatten(chatStyles.chatBubble),
                isLoading && {
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}
            >
              {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {'Loading nearby seshes...'.split('').map((char, index) => {
                    // Sequential delay for each character - ensure proper spacing
                    const delay = Math.min(index * 0.06, 0.8); // Cap at 0.8 to leave room for animation
                    
                    // Create properly spaced input ranges
                    const startTime = delay;
                    const peakTime = Math.min(delay + 0.1, 0.85);
                    const endTime = Math.min(delay + 0.2, 0.9);
                    const secondPeakTime = Math.min(delay + 0.3, 0.95);
                    
                    // Pulse wave animation with smooth bounce
                    const translateY = waveAnim.interpolate({
                      inputRange: [0, startTime, peakTime, endTime, secondPeakTime, 1],
                      outputRange: [0, 0, -6, 0, -2, 0],
                      extrapolate: 'clamp',
                    });

                    // Gradient shimmer with pulse
                    const opacity = waveAnim.interpolate({
                      inputRange: [0, startTime, peakTime, secondPeakTime, 1],
                      outputRange: [0.7, 0.7, 1, 0.9, 0.7],
                      extrapolate: 'clamp',
                    });

                    // Subtle scale for premium bounce
                    const scale = waveAnim.interpolate({
                      inputRange: [0, startTime, peakTime, endTime, 1],
                      outputRange: [1, 1, 1.08, 1.02, 1],
                      extrapolate: 'clamp',
                    });

                    return (
                      <Animated.Text
                        key={index}
                        style={[
                          chatStyles.chatText,
                          {
                            transform: [
                              { translateY },
                              { scale }
                            ],
                            opacity: Animated.multiply(shimmerStyle.opacity, opacity),
                          }
                        ]}
                      >
                        {char}
                      </Animated.Text>
                    );
                  })}
                </View>
              ) : (
                <>
                  <Text style={chatStyles.chatText} accessibilityRole="text" accessibilityLabel={visibleMessage}>{visibleMessage}</Text>
                  {visibleMessage && (
                    <View
                      style={chatStyles.chatActions} // removed inline marginTop logic for consistency
                    >
                      <TouchableOpacity
                        style={[
                          baseButtonStyle,
                          {
                            backgroundColor: colorScheme === 'dark' ? '#a14390ff' : '#812B58',
                            width: 53,
                            height: 53,
                            borderColor: colorScheme === 'dark' ? '#a382d1ff' : '#C14385', // updated
                            borderWidth: 2,
                          },
                          shadowStyles.strong
                        ]}
                        onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        accessibilityRole="button"
                        accessibilityLabel="Add to Calendar"
                      >
                        <Image
                          source={require('../../assets/images/Seshlinkr_plus.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      {/* Gradient border for dotsButton */}
                      <View style={{
                        ...shadowStyles.strong,
                        borderRadius: 28,
                        marginLeft: 7,
                      }}>
                        <LinearGradient
                          colors={
                            colorScheme === 'dark'
                              ? ['#e8a057ff', '#dd6d6dff', '#9420cdff', '#1b79e3ff', '#ccce27ff']
                              : ['#ffbe0b', '#fb5607', '#5c15c0ff', '#3a86ff', '#0f4c5c']
                          }
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 28,
                            padding: 2,
                            borderWidth: 0.5,
                            borderColor: 'transparent',
                          }}
                        >
                          <LinearGradient
                            colors={
                              colorScheme === 'dark'
                                ? ['#7f429bff', '#693fcbff', '#7779baff']
                                : ['#2C2A4A', '#4D48C0', '#332F8B']
                            }
                            start={{ x: 1.5, y: -1 }}
                            end={{ x: -1, y: -1.5 }}
                            style={{ borderRadius: 26, width: 111, height: 49, justifyContent: 'center', alignItems: 'center' }}
                          >
                            <TouchableOpacity
                              style={[chatStyles.dotsButton, { backgroundColor: 'transparent', borderWidth: 0, width: 111, height: 49 }]}
                              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                              accessibilityRole="button"
                              accessibilityLabel="More Options"
                            >
                              <Image
                                source={require('../../assets/images/Seshlinkr_dot.png')}
                                style={{ width: 110, height: 20, marginTop: 15 }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        </LinearGradient>
                      </View>
                      {/* End gradient border */}
                      <TouchableOpacity
                        style={[
                          chatStyles.arrowButton,
                          {
                            backgroundColor: colorScheme === 'dark' ? '#20294aff' : '#0C2B65',
                            borderColor: colorScheme === 'dark' ? '#305489ff' : '#3E539D',
                            borderWidth: 2,
                          },
                          shadowStyles.strong
                        ]}
                        onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        accessibilityRole="button"
                        accessibilityLabel="Navigate"
                      >
                        <Image
                          source={require('../../assets/images/Seshlinkr_arrow.png')}
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Animated logo */}
      <Animated.View style={[
        styles.logoContainer,
        { opacity: logoAnim, transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] },
        colorScheme === 'dark' && styles.logoShadow // Add shadow in dark mode
      ]}>
        <Image
          source={
            colorScheme === 'dark'
              ? require('../../assets/images/Seshlinkr_logo_centre_white.png')
              : require('../../assets/images/Seshlinkr_logo_centre.png')
          }
          style={styles.logo}
          accessibilityLabel="Seshlinkr logo"
        />
      </Animated.View>

      {/* Animated buttons */}
      <Animated.View style={{ opacity: buttonsAnim, width: '100%', alignItems: 'center' }}>
        {/* Modern card wrapper for auth buttons */}
        <View style={[
          styles.authCard,
          colorScheme === 'dark' ? styles.cardDark : styles.cardLight
        ]}>
          <TouchableOpacity
            style={[
              styles.buttonApple,
              { backgroundColor: colorScheme === 'dark' ? buttonColors.dark.apple : buttonColors.light.apple },
              { borderRadius: 24 },
              { width: '100%' }, // full-width inside card
              colorScheme !== 'dark' && styles.buttonShadow
            ]}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            <FontAwesome 
              name="apple" 
              size={26} 
              color={colorScheme === 'dark' ? 'white' : 'black'} // Updated logo color for dark mode
              style={styles.icon} 
            />
            <Text style={[
              styles.buttonAppleText,
              { color: colorScheme === 'dark' ? 'white' : 'black' } // Updated text color for dark mode
            ]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonGoogle,
              { backgroundColor: colorScheme === 'dark' ? buttonColors.dark.google : buttonColors.light.google },
              { borderRadius: 24 },
              { width: '100%' }, // full-width inside card
              colorScheme !== 'dark' && styles.buttonShadow
            ]}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Image
              source={require('../../assets/images/Google_Favicon_2025.png')}
              style={[styles.icon, { width: 26, height: 26 }]} 
              resizeMode="contain"
            />
            <Text style={[
              styles.buttonGoogleText,
              { color: colorScheme === 'dark' ? 'white' : 'black' } // Updated text color for dark mode
            ]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonOutline,
              { backgroundColor: colorScheme === 'dark' ? buttonColors.dark.signIn : buttonColors.light.signIn },
              { borderRadius: 24 },
              { width: '100%' } // full-width inside card
            ]}
            onPressIn={() => navigation.navigate('signInScreen')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={[
              styles.buttonOutlineText,
              { color: colorScheme === 'dark' ? 'white' : '#0B1B35' } // Updated text color for dark mode
            ]}>
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonCreateAccount,
              { borderRadius: 24 },
              { width: '100%' }, // full-width inside card
              colorScheme === 'dark' ? { backgroundColor: '#5B57BC' } : { backgroundColor: '#0B1B35' },
              colorScheme !== 'dark' && styles.buttonShadow
            ]}
            onPress={() => navigation.navigate('signUp1')}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <Text style={[
              styles.buttonText,
              colorScheme === 'dark' && { color: '#F1F1EF' }
            ]}>Create account</Text>
          </TouchableOpacity>
        </View>
        {/* End card */}
      </Animated.View>

      <Text style={[
        styles.agreementText,
        colorScheme === 'dark' && { color: '#F8F8FF' } // Brighter text in dark mode
      ]}>
        By signing up, you agree to our
        <Text
          style={[
            styles.linkText,
            colorScheme === 'dark' && styles.linkTextDark
          ]}
          onPress={() => console.log('Privacy Policy clicked')}
          accessibilityRole="link"
        >
          {' '}privacy policy
        </Text>{' '}
        and
        <Text
          style={[
            styles.linkText,
            colorScheme === 'dark' && styles.linkTextDark
          ]}
          onPress={() => console.log('Terms of Service clicked')}
          accessibilityRole="link"
        >
          {' '}terms of service
        </Text>
        .
      </Text>

      {!isConnected && (
        <View style={styles.noConnectionBanner}>
          <Text style={styles.noConnectionText}>No internet connection</Text>
        </View>
      )}
    </View>
  );
}

// USE THIS ONLY IT ACTUALLY WORKS!!!!!

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 220,
  },
  logoContainer: {
    marginTop: 45, // Adjust this value to move the logo further down
    marginBottom: -55, // Optional: Add spacing below the logo
    alignItems: 'center',
  },
  logo: {
    width: '65%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  icon: {
    marginRight: 8,
  },
  chatContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    paddingLeft: 16,
    alignItems: 'flex-start',
    zIndex: 1,
  },
  chatBubbleWrapper: {
    maxWidth: SCREEN_WIDTH * 0.85, // keep the bubble responsive within parent
    marginLeft: 0,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  chatLabel: {
    color: '#0B1B35',
    fontSize: 14.5,
    fontFamily: 'Usual-Medium',
    marginBottom: 2,
  },
  chatBubble: {
    paddingVertical: 16, // Increased padding
    paddingHorizontal: 24, // Increased padding
    borderRadius: 40, // Adjusted border radius
    marginRight: -10,
    shadowColor: '#5B57BC',
    shadowOffset: { width: 0, height: 4 }, // shadow offset downwards
    shadowOpacity: 0.3,                    // opacity between 0 and 1
    shadowRadius: 6,                       // blur radius
    elevation: 5,                         // Android shadow
    // Removed fixed width so bubble sizes to content
    // width: '95%',
    alignSelf: 'flex-start', // was 'center' - let bubble size to its content and align left
    overflow: 'hidden',
    borderColor: '#885BD0',
    // Removed minHeight so height grows naturally with text
    // minHeight: 60,
    backgroundColor: 'transparent', // Ensure background is transparent for gradient
  },
  chatText: {
    color: '#ffffff',
    fontSize: 17.5,
    fontFamily: 'Usual-Light',
    lineHeight: 25,
    flexShrink: 1,  // allow text wrap without overflow
  },
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // was 'space-between' - causes huge gaps
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 0,
    // optional small spacing; RN gap support varies, margins already exist on children
  },
  dotsButton: {
    backgroundColor: '#ffffff',
    width: 111,
    height: 49,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  arrowButton: {
    backgroundColor: '#0B1B35',
    width: 53,
    height: 53,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  plusButton: {
    backgroundColor: '#812B58',
    width: 53,
    height: 53,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonApple: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 9999,
    marginTop: 12,
    width: '85%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonAppleText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    marginLeft: 8,
    marginBottom: -3,
  },
  buttonGoogle: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 9999,
    marginTop: 12,
    width: '85%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGoogleText: {
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    marginLeft: 8,
    marginBottom: -2,
  },
  buttonCreateAccount: {
    backgroundColor: '#0B1B35',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 9999, // Make it fully circular
    marginTop: 12,
    width: '85%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Usual-Medium',
    marginLeft: 8,
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 9999,
    marginTop: 12,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonOutlineText: {
    color: '#0B1B35',
    fontSize: 16,
    fontFamily: 'Usual-Medium',
  },
  agreementText: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 9999,
    marginTop: 0,
    width: '85%',
    fontSize: 14,
    color: '#5B57BC',
    textAlign: 'center',
    fontFamily: 'Usual-Regular',
  },
  linkText: {
    color: '#0B1B35',
  },
  linkTextDark: {
    color: '#A9A6FF',
  },
  noConnectionBanner: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#F8D7DA',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  noConnectionText: {
    color: '#721C24',
    fontSize: 16,
    fontFamily: 'Usual-Regular',
  },
  buttonShadow: {
    // Removed shadow properties
  },
  logoShadow: {
    // Removed shadow properties
  },
  authCard: {
    width: '90%',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 4,
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