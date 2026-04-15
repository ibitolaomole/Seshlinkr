import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const mockLinkmates = ['Bob', 'Charlie'];
const mockRequests = ['Daisy', 'Eve'];

export default function Linkmates() {
  const [search, setSearch] = useState('');
  const [linkmates, setLinkmates] = useState(mockLinkmates);
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (name: string) => {
    setLinkmates([...linkmates, name]);
    setRequests(requests.filter(r => r !== name));
  };

  const handleDecline = (name: string) => {
    setRequests(requests.filter(r => r !== name));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Linkmates</Text>
      <FlatList
        data={linkmates}
        keyExtractor={item => item}
        renderItem={({ item }) => <Text style={styles.linkmate}>{item}</Text>}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.title}>Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.requestRow}>
            <Text style={styles.linkmate}>{item}</Text>
            <TouchableOpacity onPress={() => handleAccept(item)} style={styles.acceptBtn}>
              <Text style={{ color: '#fff' }}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDecline(item)} style={styles.declineBtn}>
              <Text style={{ color: '#fff' }}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.title}>Find Linkmates</Text>
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
      />
      {/* Add search results here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  linkmate: { fontSize: 16, paddingVertical: 4 },
  requestRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  acceptBtn: { backgroundColor: '#22C55E', borderRadius: 6, padding: 8, marginLeft: 8 },
  declineBtn: { backgroundColor: '#EF4444', borderRadius: 6, padding: 8, marginLeft: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
});
