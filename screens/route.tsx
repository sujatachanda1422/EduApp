import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import Role from './role';
import Lesson from './lesson';
import LessonDetails from './lessonDetails';
import Scorm from './scorm';
import VideoDetails from './videosDetails';
import SubjectCategory from './subjectCategory';
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
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Role"
        component={Role}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Lesson"
        component={Lesson}
        options={{
          title: 'Numbers',
        }}
      />
      <Stack.Screen
        name="LessonDetails"
        component={LessonDetails}
        options={{
          title: 'The Numbers Song',
        }}
      />
      <Stack.Screen
        name="Scorm"
        component={Scorm}
      />
      <Stack.Screen
        name="SubjectCategory"
        component={SubjectCategory}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="VideoDetails"
        component={VideoDetails}
        options={() => ({
          headerShown: false,
        })}
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
