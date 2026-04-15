import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const mockSesher = {
  id: '1',
  user: 'Alice',
  location: 'Templeman Library',
  time: 'Now',
  content: "Study group for ECON101. Join if you're around!",
  participants: ['Alice', 'Bob', 'Charlie'],
  comments: [
    { id: 'c1', user: 'Bob', text: 'On my way!' },
    { id: 'c2', user: 'Charlie', text: 'Save me a seat.' },
  ],
};

export default function SesherDetail() {
  const [comments, setComments] = useState(mockSesher.comments);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setComments([...comments, { id: Date.now().toString(), user: 'You', text: input }]);
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.originalPost}>
        <Text style={styles.user}>{mockSesher.user}</Text>
        <Text style={styles.meta}>{mockSesher.location} • {mockSesher.time}</Text>
        <Text style={styles.content}>{mockSesher.content}</Text>
      </View>
      <Text style={styles.sectionTitle}>Participants</Text>
      <View style={styles.participants}>
        {mockSesher.participants.map((p) => (
          <Text key={p} style={styles.participant}>{p}</Text>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Thread</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentUser}>{item.user}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
        style={styles.commentsList}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add a comment..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', padding: 16 },
  originalPost: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  user: { fontWeight: 'bold', fontSize: 16 },
  meta: { color: '#888', fontSize: 13, marginBottom: 4 },
  content: { fontSize: 15, marginTop: 4 },
  sectionTitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, fontSize: 15 },
  participants: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  participant: { backgroundColor: '#E0E7FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 4 },
  commentsList: { flex: 1, marginBottom: 8 },
  comment: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentUser: { fontWeight: 'bold', marginRight: 4 },
  commentText: { flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 8 },
  input: { flex: 1, padding: 8 },
  sendButton: { backgroundColor: '#5B57BC', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginLeft: 8 },
});
