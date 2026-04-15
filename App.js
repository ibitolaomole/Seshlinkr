import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // Update path as needed
import EmailSignUpScreen from './screens/EmailSignUp'; // Import your actual email signup screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={EmailSignUpScreen} /> {/* Note: name="Signup" */}
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}