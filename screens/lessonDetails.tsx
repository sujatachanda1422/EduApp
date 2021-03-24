import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Videos from './videos';
import Worklist from './worklist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function LessonDetails() {
  const register = () => {};

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          style: {height: 60},
          tabStyle: {padding: 8},
        }}>
        <Tab.Screen
          name="Videos"
          component={Videos}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="play-box-multiple"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Worklist"
          component={Worklist}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="playlist-check"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
