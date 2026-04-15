import { Stack } from 'expo-router'; // Change from Tabs to Stack
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Optionally hide headers for all screens
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          // Remove tabBarIcon for Stack screens, as tab bar is removed
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
          // Remove tabBarIcon for Stack screens
        }}
      />
      <Stack.Screen
        name="signUp1"
        options={{ title: 'Sign Up - Details' }}
      />
      <Stack.Screen
        name="signUp2"
        options={{ title: 'Verify Email' }}
      />
      <Stack.Screen
        name="signUp3"
        options={{ title: 'Add Mobile (Optional)' }}
      />
      <Stack.Screen
        name="signUp4"
        options={{ title: 'Email Connect' }}
      />
      <Stack.Screen
        name="setPassword"
        options={{ title: 'Set Password' }}
      />
      <Stack.Screen
        name="customiseProfile"
        options={{ title: 'Customise Profile' }}
      />
      <Stack.Screen
        name="homescreen"
        options={{ title: 'Home' }}
      />
    </Stack>
  );
}