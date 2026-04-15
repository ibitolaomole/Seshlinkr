import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TestFirestore from '../../TestFirestore'; // Adjust the path if necessary

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      {/* ...existing screens... */}
      <Stack.Screen name="TestFirestore" component={TestFirestore} />
      {/* ...existing screens... */}
    </Stack.Navigator>
  );
}

export default AppNavigator;