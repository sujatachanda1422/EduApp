import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Videos from './videos';
import Worklist from './worklist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {http} from '../services/http';

const Tab = createBottomTabNavigator();

export default function LessonDetails({route}) {
  const {lessonId} = route.params;
  const [videos, setVideos] = useState([]);
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    getVideoList();
    getWorkList();
  }, []);

  const getVideoList = () => {
    http
      .get(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/videoList/' +
          lessonId,
      )
      .then(response => response.json())
      .then(res => {
        if (res.videos) {
          setVideos(res.videos);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getWorkList = () => {
    http
      .get(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/workList/' +
          lessonId,
      )
      .then(response => response.json())
      .then(res => {
        if (res.worklist) {
          setWorkList(res.worklist);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBarOptions={{
          style: {height: 60},
          tabStyle: {padding: 8},
        }}>
        <Tab.Screen
          name="Videos"
          children={props => <Videos {...props} videoList={videos} />}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="play-box-multiple"
                color={color}
                size={size}
              />
            ),
          }}/>
        <Tab.Screen
          name="Worklist"
          children={props => <Worklist {...props} workListData={workList} />}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="playlist-check"
                color={color}
                size={size}
              />
            ),
          }}/>
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
