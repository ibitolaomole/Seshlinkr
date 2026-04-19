import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATARS = [
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
  'https://randomuser.me/api/portraits/men/66.jpg',
];

const NAV_ITEMS = [
  { key: 'Nearby', icon: 'location', active: true, isIonicon: true },
  { key: 'Vibes', emoji: '🎧' },
  { key: 'Explore', emoji: '🕊️' },
  { key: 'Chats', emoji: '💬' },
  { key: 'Linkmates', emoji: '🧍' },
];

// Stories data - Instagram style
const STORIES = [
  { id: '1', name: 'Your story', avatar: AVATARS[0], isPlus: true, viewed: true },
  { id: '2', name: 'Chris', avatar: AVATARS[1], viewed: false },
  { id: '3', name: 'Sarah', avatar: AVATARS[2], viewed: false },
  { id: '4', name: 'Alex', avatar: AVATARS[3], viewed: true },
  { id: '5', name: 'Jordan', avatar: AVATARS[4], viewed: false },
  { id: '6', name: 'Morgan', avatar: AVATARS[5], viewed: true },
];

// Seshers - Mock data (will be replaced by Firestore queries)
const SAMPLE_SESHERS = [
  {
    id: '1',
    creator: 'Marcus Dev',
    creatorId: 'user1',
    creatorAvatar: AVATARS[1],
    title: 'Coffee & Study Sesh',
    description: 'Just finished my midterm 🎓 celebrating with coffee & good vibes',
    location: { name: 'Turing Commons', lat: 40.7489, lng: -73.9680 },
    timestamp: Timestamp.now(),
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop',
    category: 'study',
    visibility: 'public',
    participants: 12,
    comments: 8,
    liked: false,
    isLinkmate: false,
    distanceMeters: 450,
  },
  {
    id: '2',
    creator: 'Casey Sport',
    creatorId: 'user2',
    creatorAvatar: AVATARS[0],
    title: 'Basketball Game Forming',
    description: 'Basketball game forming up! Need 2 more players ⛹️‍♀️',
    location: { name: 'South Lawn', lat: 40.7505, lng: -73.9680 },
    timestamp: Timestamp.now(),
    image: 'https://images.unsplash.com/photo-1546519638-68711109c79f?q=80&w=1600&auto=format&fit=crop',
    category: 'sports',
    visibility: 'public',
    participants: 8,
    comments: 14,
    liked: false,
    isLinkmate: false,
    distanceMeters: 850,
  },
  {
    id: '3',
    creator: 'Alex Study',
    creatorId: 'user3',
    creatorAvatar: AVATARS[2],
    title: 'Silent Study Zone',
    description: 'Silent studying zone - come join if you need focus 📚',
    location: { name: 'Library Level 3', lat: 40.7485, lng: -73.9695 },
    timestamp: Timestamp.now(),
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop',
    category: 'study',
    visibility: 'public',
    participants: 19,
    comments: 5,
    liked: false,
    isLinkmate: false,
    distanceMeters: 200,
  },
];

// Micro Spaces
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

// Navigation Icon with animation
const NavIcon: React.FC<{ emoji?: string; icon?: string; label: string; active?: boolean; isIonicon?: boolean; onPress?: () => void }> = ({ emoji, icon, label, active, isIonicon, onPress }) => {
  const colorScheme = useColorScheme();
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

  const isImage = emoji && typeof emoji === 'object';
  const iconColor = colorScheme === 'dark' ? '#fff' : '#1F2937';

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
          {isIonicon ? (
            <Ionicons name={icon as any} size={20} color={iconColor} />
          ) : isImage ? (
            <Image source={emoji} style={{ width: 20, height: 20, tintColor: iconColor }} resizeMode="contain" />
          ) : (
            <Text style={styles.navEmoji}>{emoji}</Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Story Bubble Component
const StoryBubble: React.FC<{ story: typeof STORIES[0]; onPress: () => void }> = ({ story, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 30 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.storyBubbleWrap}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Gradient border for unwatched stories */}
        {!story.viewed && (
          <LinearGradient
            colors={['#885BD0', '#FF9F40', '#885BD0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.storyBorder}
          >
            <View style={styles.storyInner}>
              {story.isPlus ? (
                <View style={styles.storyPlusIcon}>
                  <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
                </View>
              ) : (
                <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
              )}
            </View>
          </LinearGradient>
        )}
        {/* Plain background for viewed stories */}
        {story.viewed && (
          <View style={[styles.storyInner, { borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }]}>
            {story.isPlus ? (
              <View style={styles.storyPlusIcon}>
                <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
              </View>
            ) : (
              <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
            )}
          </View>
        )}
        <Text style={styles.storyLabel} numberOfLines={1}>{story.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Live Presence Bar
const LivePresenceBar: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const colorScheme = useColorScheme();
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
          <Text style={[styles.presenceText, { color: colorScheme === 'dark' ? '#F4F7FF' : '#1F2937' }]}>
            <Text style={[styles.presenceNumber, { color: colorScheme === 'dark' ? '#FF9F40' : '#D97706' }]}>42</Text> people nearby · <Text style={[styles.presenceNumber, { color: colorScheme === 'dark' ? '#FF9F40' : '#D97706' }]}>3</Text> Micro Spaces active now
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Micro Space Card
const MicroSpaceCard: React.FC<{ space: typeof MICRO_SPACES[0]; colorScheme: any }> = ({ space, colorScheme }) => {
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
              <Text style={[styles.microSpaceName, { color: colorScheme === 'dark' ? '#F4F7FF' : '#1F2937' }]}>{space.name}</Text>
              <View style={styles.microSpaceMeta}>
                <View style={[styles.statusDot, space.status === 'Just formed' && styles.statusDotNew]} />
                <Text style={[styles.microSpaceStatus, { color: colorScheme === 'dark' ? '#B8C5FF' : '#4B5563' }]}>{space.count} people · {space.status}</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.microSpaceMessage, { color: colorScheme === 'dark' ? '#EEF2FF' : '#374151' }]} numberOfLines={2}>{space.lastMessage}</Text>
          <View style={styles.microSpaceAction}>
            <Text style={[styles.joinText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }]}>Join →</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Sesher Card - Core feature component
type SesherProps = typeof SAMPLE_SESHERS[0];

const SesherCard: React.FC<{ sesher: SesherProps; colorScheme: any; onJoin: () => void }> = ({ sesher, colorScheme, onJoin }) => {
  const [joined, setJoined] = React.useState(false);
  const [participantCount, setParticipantCount] = React.useState(sesher.participants);
  const joinScale = React.useRef(new Animated.Value(1)).current;

  const handleJoin = () => {
    setJoined(!joined);
    setParticipantCount(joined ? participantCount - 1 : participantCount + 1);
    
    if (!joined) {
      Animated.sequence([
        Animated.spring(joinScale, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(joinScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    onJoin();
  };

  const getCategoryColor = () => {
    switch (sesher.category) {
      case 'study': return '#8B5CF6';
      case 'sports': return '#F59E0B';
      case 'social': return '#EC4899';
      default: return '#6366F1';
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <View style={styles.sesherCardWrap}>
      {/* Header with creator info & visibility badge */}
      <View style={styles.sesherHeader}>
        <View style={styles.sesherUserInfo}>
          <Image source={{ uri: sesher.creatorAvatar }} style={styles.sesherAvatar} />
          <View style={styles.sesherMeta}>
            <Text style={[styles.sesherCreator, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }]}>
              {sesher.creator}
            </Text>
            <View style={styles.sesherMetaRow}>
              <Text style={[styles.sesherLocation, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
                📍 {sesher.location.name} • {formatDistance(sesher.distanceMeters)}
              </Text>
              {sesher.visibility === 'linkmates' && (
                <View style={styles.visibilityBadge}>
                  <Ionicons name="lock-closed" size={12} color="#FF9F40" />
                  <Text style={styles.visibilityText}>Linkmates</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={20} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Sesher Title */}
      <View style={styles.sesherTitleWrap}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() + '30', borderColor: getCategoryColor() }]}>
          <Text style={[styles.categoryLabel, { color: getCategoryColor() }]}>
            {sesher.category.charAt(0).toUpperCase() + sesher.category.slice(1)}
          </Text>
        </View>
        <Text style={[styles.sesherTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }]}>
          {sesher.title}
        </Text>
      </View>

      {/* Sesher description */}
      <Text style={[styles.sesherDescription, { color: colorScheme === 'dark' ? '#D9E1FF' : '#4B5563' }]}>
        {sesher.description}
      </Text>

      {/* Sesher image */}
      <ImageBackground source={{ uri: sesher.image }} style={styles.sesherImage} imageStyle={{ borderRadius: 12 }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Participants badge */}
        <View style={styles.participantsBadge}>
          <View style={styles.participantsDot} />
          <Text style={styles.participantsText}>{participantCount} people joining</Text>
        </View>
      </ImageBackground>

      {/* Engagement metrics */}
      <View style={styles.sesherMetrics}>
        <View style={styles.metricItem}>
          <Ionicons name="chatbubble-outline" size={16} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
          <Text style={[styles.metricValue, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
            {sesher.comments} <Text style={{ fontWeight: '500', fontSize: 12 }}>comments</Text>
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="people-outline" size={16} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
          <Text style={[styles.metricValue, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
            {participantCount} <Text style={{ fontWeight: '500', fontSize: 12 }}>joining</Text>
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.sesherActions}>
        <TouchableOpacity
          onPress={handleJoin}
          style={[styles.joinButton, { backgroundColor: joined ? '#885BD0' : '#4C41AD' }]}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: joinScale }], flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name={joined ? 'checkmark-circle' : 'add-circle-outline'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.joinButtonText}>
              {joined ? 'Joined' : 'Join Sesher'}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonSmall} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonSmall} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={18} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonSmall} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={18} color={colorScheme === 'dark' ? '#B8C5FF' : '#6B7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main HomeScreen Component
const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const [showMicroSpaces, setShowMicroSpaces] = React.useState(false);
  
  const backgroundColor = colorScheme === 'dark' ? '#081426' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
              <NavIcon 
                key={it.key} 
                emoji={it.emoji} 
                icon={it.icon} 
                label={it.key} 
                active={it.active} 
                isIonicon={it.isIonicon}
                onPress={() => { /* hook up navigation here */ }} 
              />
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Stories carousel - Instagram style */}
          <View style={styles.storiesSection}>
            <Text style={[styles.sectionLabel, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
              Now
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesRow}
            >
              {STORIES.map(story => (
                <StoryBubble key={story.id} story={story} onPress={() => {}} />
              ))}
            </ScrollView>
          </View>

          {/* Live Presence Bar */}
          <LivePresenceBar onPress={() => setShowMicroSpaces(prev => !prev)} />

          {/* Mini Spaces Discovery */}
          <View style={styles.discoverySection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeader, { color: colorScheme === 'dark' ? '#F4F7FF' : '#1F2937' }]}>
                What's happening nearby
              </Text>
              <TouchableOpacity
                onPress={() => setShowMicroSpaces(prev => !prev)}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.sectionHeaderAction, { color: colorScheme === 'dark' ? '#B7C5FF' : '#4B5563' }]}>
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
                <MicroSpaceCard key={space.id} space={space} colorScheme={colorScheme} />
              ))}
            </ScrollView>
          </View>

          {/* For You Feed Section - Powered by algorithmically matched Seshers */}
          <View style={styles.feedHeader}>
            <View>
              <Text style={[styles.sectionLabel, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
                HYPER-LOCAL
              </Text>
              <Text style={[styles.sectionHeader, { color: colorScheme === 'dark' ? '#F4F7FF' : '#1F2937' }]}>
                For You
              </Text>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <Ionicons name="tune" size={18} color={colorScheme === 'dark' ? '#FFFFFF' : '#1F2937'} />
              <Text style={[styles.filterText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' }]}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.algorithmNote, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
            Personalized based on location, your Linkmates, and popular Seshers nearby
          </Text>

          {/* Seshers Feed */}
          {SAMPLE_SESHERS.map(sesher => (
            <SesherCard
              key={sesher.id}
              sesher={sesher}
              colorScheme={colorScheme}
              onJoin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            />
          ))}

          {/* Load more indicator */}
          <View style={styles.loadMoreSection}>
            <Text style={[styles.loadMoreText, { color: colorScheme === 'dark' ? '#B8C5FF' : '#6B7280' }]}>
              Pull to refresh or scroll for more Seshers
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081426' },

  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },

  // Top Navigation
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 4,
  },
  navIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
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

  // Stories Section
  storiesSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  storiesRow: {
    paddingHorizontal: 14,
    gap: 10,
  },
  storyBubbleWrap: {
    alignItems: 'center',
    marginRight: 0,
  },
  storyBorder: {
    padding: 3,
    borderRadius: 36,
    marginBottom: 6,
  },
  storyInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(13, 27, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  storyPlusIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#F4F7FF',
    maxWidth: 64,
    textAlign: 'center',
  },

  // Presence Bar
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

  // Discovery Section
  discoverySection: {
    marginBottom: 4,
  },
  sectionHeaderRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: '800',
  },
  sectionHeaderAction: {
    fontSize: 13,
    fontWeight: '700',
  },
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
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  microSpaceMessage: {
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
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Feed Header
  feedHeader: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(136,91,208,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Social Post Card
  socialPostWrap: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(136,91,208,0.2)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(184,197,255,0.6)',
  },
  postMeta: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  postLocation: {
    fontSize: 12,
    fontWeight: '500',
  },
  postContent: {
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  postImage: {
    height: width * 0.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nearbyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  nearbyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  engagementMetrics: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  metricText: {
    fontSize: 13,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Load More Section
  loadMoreSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Sesher Card Styles
  sesherCardWrap: {
    marginHorizontal: 14,
    marginBottom: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(136,91,208,0.2)',
  },
  sesherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sesherUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sesherAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(184,197,255,0.6)',
  },
  sesherMeta: {
    flex: 1,
  },
  sesherCreator: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  sesherMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sesherLocation: {
    fontSize: 12,
    fontWeight: '500',
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,159,64,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9F40',
  },
  sesherTitleWrap: {
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sesherTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  sesherDescription: {
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  sesherImage: {
    height: width * 0.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  participantsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 8,
  },
  participantsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sesherMetrics: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  sesherActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Algorithm note
  algorithmNote: {
    paddingHorizontal: 18,
    marginBottom: 12,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default HomeScreen;
