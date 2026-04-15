import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { handleVerify } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function ExampleScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verifyCode = async () => {
    try {
      await handleVerify(email, code, (screen) => navigation.navigate(screen));
    } catch (e: any) {
      setError(e?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Code" value={code} onChangeText={setCode} />
      <Button title="Verify" onPress={verifyCode} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      {/* Quick Firestore Read Test */}
      <Button
        title="Test Firestore Read"
        onPress={async () => {
          const emailKey = 'ibitolaomole@gmail.com';
          const snap = await getDoc(doc(db, 'email_verifications', emailKey));
          console.log('exists?', snap.exists());
          console.log('data:', snap.data());
        }}
      />
    </View>
  );
}
