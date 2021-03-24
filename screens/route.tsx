import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './login';
import Dashboard from './dashboard';
import Lesson from './lesson';
import LessonDetails from './lessonDetails';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeComp() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#2dadb3',
        },
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Kindergarten',
          headerLeft: null
        }}
      />
      <Stack.Screen
        name="Lesson"
        component={Lesson}
        options={{
          title: 'Numbers'
        }}
      />
      <Stack.Screen
        name="LessonDetails"
        component={LessonDetails}
        options={{
          title: 'The Numbers Song'
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="HomeComp">
        <Drawer.Screen name="HomeComp" component={HomeComp} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
