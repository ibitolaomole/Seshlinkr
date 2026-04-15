import React, { useState } from 'react';
<<<<<<< HEAD
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { handleVerify } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Firestore import
=======
import { ActivityIndicator, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from './api'; // Import your API utility
>>>>>>> e1ed311 (Initial commit from local machine)

export default function VerifyEmailScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [cooldown, setCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0); // Track resend attempts
>>>>>>> e1ed311 (Initial commit from local machine)

  // Safely read and normalize the email from params
  const emailParam = route?.params?.email;
  const email = typeof emailParam === 'string' ? emailParam.trim().toLowerCase() : '';

  async function onVerifyPressed() {
    setError('');

    // Basic validation first
    if (!email) {
      setError('Missing email from previous screen.');
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter a valid 6‑digit code.');
      return;
    }

    setLoading(true);
    try {
      console.log('[Verify] email:', email);
      console.log('[Verify] code:', JSON.stringify(code));

<<<<<<< HEAD
      await handleVerify(email, code, (next) => navigation.navigate(next));
      // Optionally navigate here if your handleVerify doesn’t navigate:
      // navigation.navigate('NextScreen');

    } catch (e: any) {
      console.log('[Verify] Error thrown:', e?.message || String(e));
      setError(e?.message || 'Verification failed. Please try again.');
=======
      const response = await api.post('/auth/verify-email', { email, code });
      
      if (response.status === 200) {
        // Verification successful - navigate to next screen
        navigation.navigate('signUp3', { email });
      } else {
        setError('Unexpected response from the server.');
      }

    } catch (e: any) {
      console.log('[Verify] Error thrown:', e?.message || String(e));
      
      if (e?.response?.status === 400) {
        setError(e?.response?.data?.message || 'Invalid or expired code.');
      } else {
        setError('Network error. Please try again.');
      }
>>>>>>> e1ed311 (Initial commit from local machine)
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
=======
  const handleResend = async () => {
    if (cooldown > 0) return;
    
    // Limit resend attempts to prevent spam (max 3 attempts)
    if (resendAttempts >= 3) {
      setError('Maximum resend attempts reached. Please try again later.');
      return;
    }
    
    try {
      await api.post('/auth/resend-email-code', { email });
      setCooldown(30);
      setResendAttempts(prev => prev + 1);
      const id = setInterval(() => setCooldown(c => (c <= 1 ? (clearInterval(id), 0) : c - 1)), 1000);
      setError(''); // Clear any existing errors
    } catch (e: any) {
      setError('Could not resend code. Try again shortly.');
    }
  };

  const handleInputChange = (text: string) => {
    const numericOnly = text.replace(/\D/g, '').slice(0, 6);
    setCode(numericOnly);
    
    // Auto-verify when 6 digits are entered
    if (numericOnly.length === 6) {
      setError(''); // Clear any existing error
      onVerifyPressed();
    }
  };

>>>>>>> e1ed311 (Initial commit from local machine)
  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your verification code:</Text>
      <TextInput
        keyboardType="number-pad"
        maxLength={6}
        value={code}
<<<<<<< HEAD
        onChangeText={setCode}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
=======
        onChangeText={handleInputChange}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="oneTimeCode" // iOS autofill support
        autoComplete="one-time-code" // Android autofill support
        inputMode="numeric" // Better numeric keyboard
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
        placeholder="000000"
        autoFocus
>>>>>>> e1ed311 (Initial commit from local machine)
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
<<<<<<< HEAD
        <Button title="Verify" onPress={onVerifyPressed} />
      )}
      {/* Temporary Firestore sanity test button */}
      <Button
        title="Test Firestore Read"
        onPress={async () => {
          try {
            const key = email || 'ibitolaomole@gmail.com'; // fallback for testing
            const snap = await getDoc(doc(db, 'email_verifications', key));
            console.log('Doc exists?', snap.exists());
            if (snap.exists()) {
              console.log('Doc data:', snap.data());
            }
          } catch (e) {
            console.log('Firestore read error:', e);
          }
        }}
      />
=======
        <Button title="Verify" onPress={onVerifyPressed} disabled={code.length !== 6} />
      )}
      
      <TouchableOpacity 
        onPress={handleResend} 
        disabled={cooldown > 0 || resendAttempts >= 3} 
        style={{ marginTop: 10 }}
      >
        <Text style={{ 
          color: (cooldown > 0 || resendAttempts >= 3) ? 'gray' : 'blue' 
        }}>
          {resendAttempts >= 3 
            ? 'Max resend attempts reached' 
            : `Resend Code ${cooldown > 0 ? `(${cooldown}s)` : ''}`
          }
        </Text>
      </TouchableOpacity>
      
      {resendAttempts > 0 && (
        <Text style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>
          Resend attempts: {resendAttempts}/3
        </Text>
      )}
>>>>>>> e1ed311 (Initial commit from local machine)
    </View>
  );
}
