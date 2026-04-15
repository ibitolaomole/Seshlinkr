import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const mockNotifications = [
  { id: 'n1', text: 'Daisy sent you a Linkmate request.' },
  { id: 'n2', text: 'Bob replied to your Sesher.' },
  { id: 'n3', text: 'You were invited to a private Sesher.' },
  { id: 'n4', text: 'Study group for ECON101 is starting soon near you.' },
];

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  notification: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10 },
});
