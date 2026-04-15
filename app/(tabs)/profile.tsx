import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from './navigationTypes';

const user = {
  name: 'You',
  handle: '@you.local',
  avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  location: 'Canterbury, UK',
  bio: 'Just vibing through seshes 🎧 | Uni of Kent 📍',
  seshes: [
    { id: 1, content: "Who's going to the silent disco tonight at Eliot Hall? 👀", time: '2h' },
    { id: 2, content: "Chill sesh at Templeman café later? Hit me up!", time: '6h' },
  ],
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Gradient Header */}
        <LinearGradient
          colors={['#5B2C6F', '#6A1B9A', '#7B1FA2']}
          style={styles.gradientHeader}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.nameGradient}>{user.name}</Text>
          <Text style={styles.handle}>{user.handle}</Text>
          <Text style={styles.location}>{user.location}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Text style={styles.stat}><Text style={styles.statBold}>42</Text> seshes</Text>
          <Text style={styles.stat}><Text style={styles.statBold}>118</Text> followers</Text>
          <Text style={styles.stat}><Text style={styles.statBold}>105</Text> following</Text>
        </View>

        {/* Seshlinkr Feature Section */}
        <View style={styles.seshlinkrFeature}>
          <Text style={styles.featureTitle}>Seshlinkr Spotlight 🔥</Text>
          <Text style={styles.featureDescription}>
            Discover the hottest seshes happening nearby right now! Don’t miss out on real connections.
          </Text>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => navigation.navigate('SeshlinkrHub')} // Replace with your actual screen name
          >
            <Text style={styles.featureButtonText}>Explore Seshlinkr</Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View style={styles.section}>
          {user.seshes.map((sesh) => (
            <View key={sesh.id} style={styles.post}>
              <Image source={{ uri: user.avatar }} style={styles.postAvatar} />
              <View style={styles.postContent}>
                <Text style={styles.postName}>
                  {user.name} <Text style={styles.postHandle}>{user.handle}</Text>
                </Text>
                <Text style={styles.postText}>{sesh.content}</Text>
                <Text style={styles.postTime}>{sesh.time} ago</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[...Array(4)].map((_, i) => (
          <TouchableOpacity key={i}>
            <Image
              source={require('../../assets/images/Seshlinkr_plus.png')}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Image source={{ uri: user.avatar }} style={styles.navAvatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F1EF' },
  scrollContent: { paddingBottom: 100 },

  gradientHeader: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  nameGradient: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  handle: { fontSize: 15, color: '#ffffff' },
  location: { fontSize: 14, color: '#ffffff', marginTop: 4 },
  bio: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#5B57BC',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 8,
  },
  editText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 14,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#DDD',
    paddingVertical: 12,
  },
  stat: { fontSize: 14, color: '#444' },
  statBold: { fontWeight: '600' },

  seshlinkrFeature: {
    backgroundColor: '#5B57BC',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    marginVertical: 20,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 15,
    lineHeight: 20,
  },
  featureButton: {
    backgroundColor: '#0B1B35',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  featureButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  post: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#0B1B35',
  },
  postAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postName: {
    fontWeight: '600',
    color: '#111',
    fontSize: 15,
  },
  postHandle: {
    fontWeight: '400',
    color: '#666',
    fontSize: 14,
  },
  postText: {
    marginTop: 4,
    fontSize: 15,
    color: '#111',
    lineHeight: 20,
  },
  postTime: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navIcon: { width: 24, height: 24, tintColor: '#333' },
  navAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ProfileScreen;