import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Use your existing Firebase config

export default function TestFirestore() {
  useEffect(() => {
    async function runTest() {
      try {
        const emailKey = 'ibitolaomole@gmail.com'.trim().toLowerCase();
        console.log('Testing Firestore read for:', emailKey);

        const snap = await getDoc(doc(db, 'email_verifications', emailKey));

        console.log('Doc exists?', snap.exists());
        if (snap.exists()) {
          console.log('Doc data:', snap.data());
        }
      } catch (err) {
        console.log('Firestore error:', err);
      }
    }
    runTest();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Check your Metro terminal for Firestore output</Text>
    </View>
  );
}
