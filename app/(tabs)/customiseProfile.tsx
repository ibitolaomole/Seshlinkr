import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './types';

export default function CustomizeProfile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const bioErrorAnim = useRef(new Animated.Value(0)).current;
  const [showBioError, setShowBioError] = useState(false);
  const [bioError, setBioError] = useState('');

  const pickImage = async (setImage: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    // Save profile info logic here
    navigation.navigate('homescreen');
  };

  const handleBioChange = (text: string) => {
    setBio(text);
    if (text.length > 120) {
      setBioError('Bio must be 120 characters or less.');
    } else {
      setBioError('');
    }
  };

  React.useEffect(() => {
    const hasBioError = !!bioError;
    setShowBioError(hasBioError);
    Animated.timing(bioErrorAnim, {
      toValue: hasBioError ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [bioError]);

  const getInputStyle = () => {
    if (focusedInput === 'bio') return [styles.input, styles.inputFocused];
    else if (bio.length > 0 && !bioError) return [styles.input, styles.inputValid];
    else return styles.input;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top bar with Back and Skip for now */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.topBarText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue} accessibilityRole="button">
          <Text style={styles.topBarText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Customize Your Profile</Text>
      <Text style={styles.subheader}>
        You can upload a profile picture, add a header image, and write a short bio to personalize your profile. These steps can also be completed later.
      </Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setProfileImage)}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setHeaderImage)}>
        {headerImage ? (
          <Image source={{ uri: headerImage }} style={styles.headerImage} />
        ) : (
          <Text style={styles.imagePickerText}>Add Header Image</Text>
        )}
      </TouchableOpacity>
      {/* Bio input with floating label */}
      <View style={{ position: 'relative', marginBottom: 10 }}>
        <Text
          style={{
            position: 'absolute',
            left: 20,
            top: -6,
            fontSize: 12,
            color:
              focusedInput !== 'bio' && bio.trim().length > 0
                ? '#0B1B35'
                : '#5B57BC',
            fontFamily: 'Usual-Regular',
            zIndex: 2,
            backgroundColor: 'transparent',
            pointerEvents: 'none',
          }}
        >
          Short bio (optional)
        </Text>
        <TextInput
          style={getInputStyle()}
          placeholder=""
          value={bio}
          onChangeText={handleBioChange}
          maxLength={120}
          multiline
          accessibilityLabel="Short bio input"
          onFocus={() => setFocusedInput('bio')}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      <Animated.View style={{ opacity: bioErrorAnim }}>
        <Text style={styles.errorText}>{bioError ? bioError : ' '}</Text>
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={handleContinue} accessibilityRole="button">
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleContinue} accessibilityRole="button">
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1EF',
    padding: 20,
    paddingTop: 70,
  },
  header: {
    fontSize: 32,
    fontFamily: 'Usual-Bold',
    color: '#5B57BC',
    marginBottom: 0,
    marginTop: 10,
    textAlign: 'left',
  },
  subheader: {
    fontSize: 20,
    color: '#0B1B35',
    marginBottom: 10,
    fontFamily: 'Usual-Bold',
    textAlign: 'left',
  },
  optionalMessage: {
    fontSize: 16,
    color: '#5B57BC',
    marginBottom: 18,
    fontFamily: 'Usual-Bold',
    textAlign: 'left',
  },
  imagePicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imagePickerText: {
    color: '#5B57BC',
    fontFamily: 'Usual-Medium',
    fontSize: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  input: {
    fontFamily: 'Usual-Regular',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: -8.5,
    marginBottom: -2,
    borderRadius: 24,
    fontSize: 15,
    color: '#0B1B35',
    borderWidth: 2,
    borderColor: '#ffffff',
    textAlign: 'left',
  },
  inputFocused: {
    borderColor: '#5B57BC',
  },
  inputValid: {
    borderColor: '#0B1B35',
  },
  errorText: {
    color: '#D6001C',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 12,
    marginLeft: 15,
    fontFamily: 'Usual-Regular',
    minHeight: 16,
  },
  button: {
    backgroundColor: '#0B1B35',
    paddingVertical: 13,
    borderRadius: 23,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Usual-Medium',
    fontSize: 16,
  },
  skipButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#5B57BC',
    fontFamily: 'Usual-Regular',
    fontSize: 15,
  },
  topBarText: {
    color: '#5B57BC',
    fontFamily: 'Usual-Bold',
    fontSize: 16,
  },
});
