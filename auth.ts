import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth client ID (same one used for web)
const GOOGLE_CLIENT_ID = '656309014861-vj49jf0vk14s6f5j6v6v6v6v6v6v6v6v.apps.googleusercontent.com'; // Replace with your actual Google Client ID

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  return {
    googleRequest: request,
    googleResponse: response,
    googlePromptAsync: promptAsync,
  };
}

export async function signInWithGoogle(googlePromptAsync: any) {
  try {
    const result = await googlePromptAsync();

    if (result?.type === 'success') {
      const { id_token } = result.params;

      // Sign in with Firebase using the Google ID token
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth, credential);

      console.log('Signed in with Google:', userCredential.user);
      return userCredential.user;
    } else {
      throw new Error('Google sign-in was cancelled or failed');
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

export function isUserSignedIn() {
  return !!auth.currentUser;
}

export async function signOutUser() {
  try {
    await signOut(auth);
    console.log('Signed out successfully');
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}
