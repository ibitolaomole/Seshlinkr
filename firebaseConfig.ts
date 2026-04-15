import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Corrected Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAoQcgrFQCYNORYVMJIYd3sCTfovQHsr2k',
  authDomain: 'seshlinkr.firebaseapp.com',
  projectId: 'seshlinkr',
  storageBucket: 'seshlinkr.appspot.com', // Corrected storage bucket
  messagingSenderId: '656309014861',
  appId: '1:656309014861:web:b0cbd5a0c49b34519ea704', // Corrected Web appId
  // measurementId is optional in React Native
};

const app = initializeApp(firebaseConfig);

// Firestore for React Native with long-polling
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

// Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Verify the email code from Firestore
 * @param email User's email (should match Firestore document ID)
 * @param enteredCode 6-digit verification code entered by user
 * @param navigate Function to navigate between screens
 */
export async function handleVerify(
  email: string,
  enteredCode: string,
  navigate: (screen: string) => void
) {
  try {
    const emailKey = email.trim().toLowerCase(); // Ensure email is trimmed and lowercased

    if (!/^\d{6}$/.test(String(enteredCode).trim())) { // Validate 6-digit code
      throw new Error('Enter a valid 6-digit code.');
    }

    const docRef = doc(db, 'email_verifications', emailKey); // Ensure Firestore document ID matches this format
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('No verification data found for this email.');
    }

    const data = docSnap.data();
    const code = data?.code;
    const expiresAt = data?.expiresAt;

    if (!code || !expiresAt) {
      throw new Error('Invalid verification data.');
    }

    const expiryDate = typeof expiresAt?.toDate === 'function'
      ? expiresAt.toDate()
      : new Date(expiresAt);

    // Debug logs to identify mismatches
    console.log('enteredCode:', JSON.stringify(enteredCode));
    console.log('storedCode:', JSON.stringify(code));
    console.log('expiryDate:', expiryDate);
    console.log('now:', new Date());

    if (String(enteredCode).trim() !== String(code).trim()) { // Strict code comparison
      throw new Error('Invalid verification code.');
    }

    if (new Date() > expiryDate) {
      throw new Error('Verification code has expired.');
    }

    // Delete the code and expiry fields to prevent reuse
    await updateDoc(docRef, { code: deleteField(), expiresAt: deleteField() });

    navigate('NextScreen'); // Replace with your actual screen name
  } catch (error: any) {
    console.error('Email verification error:', error?.message || String(error));
    throw error; // Re-throw to surface the error to the UI
  }
}