import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateSesher() {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [isNow, setIsNow] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Sesher</Text>
      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Happening now</Text>
        <Switch value={isNow} onValueChange={setIsNow} />
      </View>
      {!isNow && (
        <TextInput
          style={styles.input}
          placeholder="Time (e.g. 18:00)"
          value={time}
          onChangeText={setTime}
        />
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Public</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
        <Text style={styles.label}>Linkmates only</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Sesher</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8FF', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { marginRight: 8 },
  button: { backgroundColor: '#5B57BC', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 16 },
});
