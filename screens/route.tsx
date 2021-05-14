import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import SubjectList from './subjectList';
import Lesson from './lesson';
import LessonDetails from './lessonDetails';
import Scorm from './scorm';
import VideoDetails from './videosDetails';
import SubjectCategory from './subjectCategory';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text} from 'react-native';
import MenuItems from './menuItems';
import Profile from './profile';
import ChangePwd from './changePwd';
import ChangeProfilePic from './changeProfilePic';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeComp() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(false);

  useEffect(async () => {
    const data = await AsyncStorage.getItem('userData');

    if (data) {
      setUserData(true);
    }

    setLoading(false);
    SplashScreen.hide();

    return () => {};
  }, []);

  return (
    <>
      {loading && (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
      {!loading && (
        <Stack.Navigator
          screenOptions={{
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleAllowFontScaling: true,
            headerTitleStyle: {
              color: '#fff',
            },
            headerTitleContainerStyle: {
              alignItems: 'center',
              width: '70%'
            },
            headerStyle: {
              backgroundColor: '#2dadb3',
            },
          }}>
          {!userData && (
            <>
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
                  headerShown: false,
                }}
              />
            </>
          )}
          {userData && (
            <>
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ChangePwd"
            component={ChangePwd}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ChangeProfilePic"
            component={ChangeProfilePic}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SubjectList"
            component={SubjectList}
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
          <Stack.Screen name="Scorm" component={Scorm} />
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
      )}
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="HomeComp"
        drawerContent={props => <MenuItems {...props} />}>
        <Drawer.Screen name="HomeComp" component={HomeComp} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
