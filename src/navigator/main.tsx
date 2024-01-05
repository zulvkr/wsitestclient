import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screen/home';
import AddEdit from '../screen/AddEdit';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Add" component={AddEdit} />
    </Stack.Navigator>
  );
}
