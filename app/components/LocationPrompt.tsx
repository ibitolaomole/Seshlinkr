import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

interface LocationPromptProps {
  onPermissionDenied: () => void;
}

export default function LocationPrompt({ onPermissionDenied }: LocationPromptProps) {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } else {
      onPermissionDenied();
      Alert.alert(
        'Location Permission Denied',
        'We need your location to show local content. You can retry or enter your postcode manually.',
        [{ text: 'Retry', onPress: requestLocationPermission }]
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <Text style={styles.locationText}>
          Location: {location.latitude}, {location.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#5B57BC',
    textAlign: 'center',
  },
});
