// app/_layout.tsx
import { useColorScheme } from '@/hooks/useColorScheme'; // since you're using it
import { useFonts } from 'expo-font'; // ✅ Correct import
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Usual': require('@/assets/fonts/Usual Medium.ttf'),
    'Usual Bold': require('@/assets/fonts/Usual Bold.ttf'),
    'Usual Light': require('@/assets/fonts/Usual Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Optional: show a loading screen or spinner
  }

  return <Slot />;
}
