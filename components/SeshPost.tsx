// components/SeshPost.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colours';

export type SeshPostType = {
  id: string;
  username: string;
  time: string;
  title: string;
  image?: string | null;
  isOpen: boolean;
  likes: number;
  comments: number;
};

const SeshPost: React.FC<{ post: SeshPostType }> = ({ post }) => (
  <View style={{
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ fontWeight: 'bold', color: Colors.text }}>@{post.username}</Text>
      <Text style={{ color: Colors.muted }}>{post.time}</Text>
    </View>

    <Text style={{ fontSize: 16, color: Colors.text, marginBottom: 8 }}>{post.title}</Text>

    {post.image && (
      <Image
        source={{ uri: post.image }}
        style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }}
        resizeMode="cover"
      />
    )}

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity><Feather name="heart" size={20} color={Colors.like} /></TouchableOpacity>
        <Text style={{ marginLeft: 6, marginRight: 12, color: Colors.text }}>{post.likes}</Text>
        <TouchableOpacity><Feather name="message-circle" size={20} color={Colors.comment} /></TouchableOpacity>
        <Text style={{ marginLeft: 6, color: Colors.text }}>{post.comments}</Text>
      </View>

      {post.isOpen && (
        <TouchableOpacity style={{
          backgroundColor: Colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 999,
        }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Join sesh</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default SeshPost;