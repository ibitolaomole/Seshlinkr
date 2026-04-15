import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationPrompt from '../components/LocationPrompt';

const AVATARS = [
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
  'https://randomuser.me/api/portraits/men/66.jpg',
];

// New: top nav items (mark first as active to match the reference highlight)
const NAV_ITEMS = [
  { key: 'Nearby', emoji: '🔥', active: true },
  { key: 'Vibes', emoji: '🎧' },
  { key: 'Explore', emoji: '🕊️' },
  { key: 'Chats', emoji: '💬' },
  { key: 'Linkmates', emoji: '🧍' },
];

// New: animated icon button with gradient background bubble
const NavIcon: React.FC<{ emoji: string; label: string; active?: boolean; onPress?: () => void }> = ({ emoji, label, active, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 30, bounciness: 6 }),
      Animated.timing(opacity, { toValue: 0.9, duration: 110, useNativeDriver: true }),
    ]).start();
  };
  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.85}
      style={styles.navIconWrap}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }], opacity }}>
        <View style={styles.navBubbleWrap}>
          {/* Subtle glass-blur behind each icon */}
          <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={
              active
                ? ['rgba(255,251,234,0.65)', 'rgba(242,239,216,0.35)']
                : ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']
            }
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.navBubble}
          />
          <Text style={styles.navEmoji}>{emoji}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

type ActivityCardProps = {
  title: string;
  image: string;
  leftPill: string;
  cta: string;
  avatars: string[];
};

const CampusChip = ({ uri, label }: { uri: string; label: string }) => (
  <View style={styles.campusChip}>
    <Image source={{ uri }} style={styles.campusAvatar} />
    <Text style={styles.campusLabel} numberOfLines={1}>{label}</Text>
  </View>
);

const ActivityCard: React.FC<ActivityCardProps> = ({ title, image, leftPill, cta, avatars }) => {
  return (
    <View style={styles.cardShadow}>
      <ImageBackground source={{ uri: image }} style={styles.card} imageStyle={styles.cardImage}>
        {/* subtle overlay — shifted to purple tint to match bubble */}
        <LinearGradient
          colors={['rgba(46,50,157,0.18)', 'rgba(136,91,208,0.55)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* top: stacked avatars */}
        <View style={styles.stackedRow}>
          {avatars.slice(0, 4).map((u, i) => (
            <Image key={`${u}-${i}`} source={{ uri: u }} style={[styles.stackedAvatar, { left: i * 24, zIndex: 10 - i }]} />
          ))}
        </View>

        {/* title */}
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        {/* bottom row */}
        <View style={styles.cardBottomRow}>
          <View style={styles.leftPill}>
            {/* small leading avatar bullet */}
            <Image source={{ uri: avatars[0] }} style={styles.leftPillAvatar} />
            <Text style={styles.leftPillText}>{leftPill}</Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
            {/* mini icon approximation */}
            <View style={styles.ctaIcon} />
            <Text style={styles.ctaText}>{cta}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

// Small floating chat card (sourced from index.tsx look & feel, smaller footprint, larger radius)
const BottomChatCardSmall: React.FC = () => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.fabChatWrap}>
      <LinearGradient
        colors={['#885BD0', '#4C41AD', '#32349F', '#2E329D']} // match index.tsx gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fabChatCard}
      >
        {/* message text (kept concise) */}
        <Text numberOfLines={2} style={styles.fabChatText} accessibilityRole="text" accessibilityLabel="Pizza & Smash Bros in Turing common room — just turn up 🍕">
          Pizza & Smash Bros in Turing{'\n'}common room — just turn up 🍕
        </Text>

        {/* actions row: plus, dots (gradient frame), arrow */}
        <View style={styles.fabRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[
              {
                backgroundColor: colorScheme === 'dark' ? '#a14390ff' : '#812B58',
                width: 46,
                height: 46,
                borderRadius: 28,
                borderColor: colorScheme === 'dark' ? '#a382d1ff' : '#C14385',
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Image
              source={require('../../assets/images/Seshlinkr_plus.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Gradient border for dots button (index.tsx style) */}
          <View style={{ borderRadius: 28 }}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['#e8a057ff', '#dd6d6dff', '#9420cdff', '#1b79e3ff', '#ccce27ff']
                  : ['#ffbe0b', '#fb5607', '#5c15c0ff', '#3a86ff', '#0f4c5c']
              }
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 28, padding: 2, borderWidth: 0.5, borderColor: 'transparent' }}
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
                  activeOpacity={0.9}
                  onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={{ width: 111, height: 49, borderRadius: 26, justifyContent: 'center', alignItems: 'center' }}
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

          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[
              {
                backgroundColor: colorScheme === 'dark' ? '#20294aff' : '#0C2B65',
                borderColor: colorScheme === 'dark' ? '#305489ff' : '#3E539D',
                width: 46,
                height: 46,
                borderRadius: 28,
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
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
      </LinearGradient>
    </View>
  );
};

// Add after AVATARS array
const MICRO_SPACES = [
  {
    id: '1',
    name: 'Campus Bus',
    count: 17,
    status: 'Active',
    lastMessage: 'Anyone getting off at the library stop?',
    avatar: AVATARS[0],
  },
  {
    id: '2',
    name: 'South Lawn',
    count: 8,
    status: 'Active',
    lastMessage: 'Anyone want to toss a frisbee?',
    avatar: AVATARS[1],
  },
  {
    id: '3',
    name: 'Library Basement',
    count: 12,
    status: 'Quiet mode',
    lastMessage: 'Study group forming for finals',
    avatar: AVATARS[2],
  },
  {
    id: '4',
    name: 'Dining Hall',
    count: 5,
    status: 'Just formed',
    lastMessage: 'Pizza line is moving fast today',
    avatar: AVATARS[3],
  },
];

// New: Live Presence Bar Component
const LivePresenceBar: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.presenceBar}>
      <LinearGradient
        colors={['rgba(255,107,107,0.25)', 'rgba(255,159,64,0.25)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.presenceGradient}
      >
        <View style={styles.presenceContent}>
          <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.presenceText}>
            <Text style={styles.presenceNumber}>42</Text> people nearby · <Text style={styles.presenceNumber}>3</Text> Micro Spaces active now
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// New: Hero Header Component
const HeroHeader: React.FC = () => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroTextBlock}>
        <Text style={styles.heroGreeting}>Good evening,</Text>
        <Text style={styles.heroTitle}>Turing campus</Text>
        <Text style={styles.heroSubtitle} numberOfLines={2}>
          Drop into what&apos;s happening around you in the next hour.
        </Text>
      </View>

      <BlurView
        intensity={35}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.heroStatusCard}
      >
        <LinearGradient
          colors={
            colorScheme === 'dark'
              ? ['rgba(136,91,208,0.7)', 'rgba(46,50,157,0.4)']
              : ['rgba(76,81,191,0.8)', 'rgba(155,119,244,0.6)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroStatusPill}>
          <View style={styles.heroStatusDot} />
          <Text style={styles.heroStatusPillText}>Now</Text>
        </View>
        <Text style={styles.heroStatusValue}>On campus</Text>
        <Text style={styles.heroStatusHint}>Tap to set your vibe</Text>
      </BlurView>
    </View>
  );
};

// New: Micro Space Card Component
const MicroSpaceCard: React.FC<{ space: typeof MICRO_SPACES[0] }> = ({ space }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.9}
      style={styles.microSpaceCard}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={['rgba(136,91,208,0.15)', 'rgba(46,50,157,0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.microSpaceGradient}
        >
          <View style={styles.microSpaceHeader}>
            {space.avatar && (
              <Image source={{ uri: space.avatar }} style={styles.microSpaceAvatar} />
            )}
            <View style={styles.microSpaceInfo}>
              <Text style={styles.microSpaceName}>{space.name}</Text>
              <View style={styles.microSpaceMeta}>
                <View style={[styles.statusDot, space.status === 'Just formed' && styles.statusDotNew]} />
                <Text style={styles.microSpaceStatus}>{space.count} people · {space.status}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.microSpaceMessage} numberOfLines={2}>{space.lastMessage}</Text>
          <View style={styles.microSpaceAction}>
            <Text style={styles.joinText}>Join →</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const [showMicroSpaces, setShowMicroSpaces] = React.useState(false);
  
  return (
    <View style={styles.container}>
      {/* background — solid colors based on color scheme */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colorScheme === 'dark' ? '#081426' : '#f4f3ff' },
        ]}
      />
      {/* subtle gradient wash behind content */}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['rgba(76,65,173,0.65)', 'transparent', 'rgba(14,26,56,0.9)']
            : ['rgba(104,110,255,0.25)', 'transparent', 'rgba(255,255,255,0.9)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top navigation header */}
        <View style={styles.topNav}>
          <View style={styles.navIconsRow}>
            {/* Logo as first item */}
            <View style={styles.navIconWrap}>
              <Image
                source={
                  colorScheme === 'dark'
                    ? require('../../assets/images/Seshlinkr_logo_icon_white_blue.png')
                    : require('../../assets/images/Seshlinkr_logo_icon_dark_blue.png')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {NAV_ITEMS.map(it => (
              <NavIcon key={it.key} emoji={it.emoji} label={it.key} active={it.active} onPress={() => { /* hook up navigation here */ }} />
            ))}
          </View>
        </View>

        {/* New: hero header with greeting + status */}
        <HeroHeader />

        {/* Live Presence Bar */}
        <LivePresenceBar onPress={() => setShowMicroSpaces(prev => !prev)} />

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ height: 8 }} />

          {/* Micro-Spaces Section with toggle */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Micro Spaces</Text>
            <TouchableOpacity
              onPress={() => setShowMicroSpaces(prev => !prev)}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.sectionHeaderAction}>
                {showMicroSpaces ? 'Hide' : 'See all ›'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.microSpacesRow}
          >
            {MICRO_SPACES.slice(0, showMicroSpaces ? MICRO_SPACES.length : 2).map(space => (
              <MicroSpaceCard key={space.id} space={space} />
            ))}
          </ScrollView>

          {/* Your campus */}
          <Text style={styles.sectionHeader}>Your campus</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.campusRow}
          >
            <CampusChip uri={AVATARS[0]} label="Relaxed" />
            <CampusChip uri={AVATARS[1]} label="Creative" />
            <CampusChip uri={AVATARS[2]} label="Sam" />
            <CampusChip uri={AVATARS[4]} label="Erin" />
          </ScrollView>

          {/* Linkmates active */}
          <Text style={[styles.sectionHeader, { marginTop: 14 }]}>Linkmates active</Text>

          <ActivityCard
            title="Evening Chill on the Lawn"
            image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
            leftPill="5 linkmates"
            cta="Join"
            avatars={[AVATARS[4], AVATARS[2], AVATARS[5], AVATARS[1]]}
          />

          {/* Add ~10px extra space between the two cards */}
          <View style={{ height: 10 }} />

          <ActivityCard
            title="Library’s quiet tonight. Cozy vibes 🌱"
            image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop"
            leftPill="Geneva"
            cta="Share"
            avatars={[AVATARS[0], AVATARS[3], AVATARS[1], AVATARS[2]]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081426' },

  // new: background gradient
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },

  sectionHeader: {
    color: '#F4F7FF',
    fontSize: 30, // +2px to strengthen section hierarchy
    fontWeight: '800',
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  // new: header row for sections
  sectionHeaderRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 4,
  },
  sectionHeaderAction: {
    color: '#B7C5FF',
    fontSize: 13,
    fontWeight: '700',
  },

  // campus chips
  campusRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  campusChip: {
    width: 86,
    alignItems: 'center',
    marginRight: 12,
  },
  campusAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  campusLabel: {
    color: '#E6EBFF',
    fontSize: 12, // reduced from 14 for better hierarchy
    marginTop: 6,
    fontWeight: '600',
  },

  // activity cards
  cardShadow: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  card: {
    width: '100%',
    height: width * 0.56,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 24,
  },

  stackedRow: {
    position: 'absolute',
    top: 10,
    left: 12,
    height: 36,
    width: 130,
  },
  stackedAvatar: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },

  titleWrap: {
    marginBottom: 18,
    paddingRight: 18,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
  },

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17,17,17,0.55)',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
  },
  leftPillAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  leftPillText: {
    color: '#F5F5F5',
    fontWeight: '700',
    fontSize: 14,
  },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
  },
  ctaIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#111',
    marginRight: 8,
  },
  ctaText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 16,
  },

  // New: top navigation styles
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, // reduced from 16 for tighter grouping
    paddingVertical: 6,
  },
  navIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // changed from space-evenly for denser feel
    flex: 1,
    paddingHorizontal: 4,
  },
  navIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2, // reduced horizontal padding
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  navBubbleWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  navBubble: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  navEmoji: {
    fontSize: 18,
    color: '#fff',
  },

  // Floating chat card — decreased width/height, increased borderRadius
  fabChatWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  fabChatCard: {
    width: '82%',
    minHeight: 84,
    borderRadius: 36,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabChatText: {
    color: '#EDEAFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  fabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabPlus: {
    width: 42,
    height: 42,
    borderRadius: 26, // rounder
    backgroundColor: '#812B58',
    borderWidth: 2,
    borderColor: '#9467B9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabSymbol: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: -2,
  },
  fabDotsOuter: {
    padding: 2,
    borderRadius: 28,
    width: 112,     // slightly smaller
    height: 44,
  },
  fabDotsInner: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDotsText: {
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 4,
    fontWeight: '800',
  },
  fabArrow: {
    width: 42,
    height: 42,
    borderRadius: 26, // rounder
    backgroundColor: '#0C2B65',
    borderWidth: 2,
    borderColor: '#3E539D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabArrowIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: -1,
  },

  // Live Presence Bar
  presenceBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  presenceGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  presenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
    marginRight: 10,
  },
  presenceText: {
    color: '#F4F7FF',
    fontSize: 15,
    fontWeight: '600',
  },
  presenceNumber: {
    fontWeight: '800',
    color: '#FF9F40',
  },

  // Hero header
  heroContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 2,
    marginBottom: 4,
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  heroGreeting: {
    color: '#B8C5FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#D9E1FF',
    fontSize: 13,
    lineHeight: 18,
  },
  heroStatusCard: {
    width: 130,
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(9,12,40,0.55)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  heroStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 5,
  },
  heroStatusPillText: {
    color: '#ECFDF5',
    fontSize: 11,
    fontWeight: '700',
  },
  heroStatusValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  heroStatusHint: {
    color: '#E5E7EB',
    fontSize: 11,
    opacity: 0.8,
  },

  // Micro Space Cards
  microSpacesRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  microSpaceCard: {
    width: width * 0.72,
    marginRight: 0,
  },
  microSpaceGradient: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(136,91,208,0.3)',
  },
  microSpaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // remove emoji usage; keep style if you want for later
  microSpaceEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  // new avatar style
  microSpaceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(184,197,255,0.9)',
  },
  microSpaceInfo: {
    flex: 1,
  },
  microSpaceName: {
    color: '#F4F7FF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  microSpaceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  statusDotNew: {
    backgroundColor: '#FF9F40',
  },
  microSpaceStatus: {
    color: '#B8C5FF', // brighter from #A5B4FC
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  microSpaceMessage: {
    color: '#EEF2FF', // brighter from #E6EBFF
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  microSpaceAction: {
    alignSelf: 'flex-end',
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ...existing code...
});

export default HomeScreen;