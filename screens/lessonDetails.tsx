import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Videos from './videos';
import Worklist from './worklist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {http} from '../services/http';

const Tab = createBottomTabNavigator();

export default function LessonDetails({route, navigation}) {
  const {lessonId, lessonName} = route.params;
  const [videos, setVideos] = useState([]);
  const [workList, setWorkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVideos, setHasVideos] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View>
            <Text style={{fontSize: 22, color: '#fff'}}>{lessonName}</Text>
          </View>
        );
      },
    });

    getVideoList();
    // getWorkList();
  }, []);

  const getVideoList = () => {
    setIsLoading(true);

    http
      .get(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/videoList/' +
          lessonId,
      )
      .then(response => response.json())
      .then(res => {
        setIsLoading(false);

        // console.log('data = ', res.status);
        if (res.status === 200) {
          setVideos(res.data.videos);
          setHasVideos(true);
        } else if (res.status === 404 || res.status === 500) {
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const getWorkList = () => {
    http
      .get(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/workList/' +
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
      {isLoading && (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )}

      {!isLoading && hasVideos && <Videos navigation={navigation} videoList={videos} />}
      {!isLoading && !hasVideos && <Text style={styles.textStyle}>COMING SOON...</Text>}

      {/* <Tab.Navigator
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
          }}
        />
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
          }}
        />
      </Tab.Navigator> */}
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
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000007',
    zIndex: 1,
  },
  textStyle: {
    fontSize: 40,
    alignSelf: 'center',
    color: 'blue'
  }
});
