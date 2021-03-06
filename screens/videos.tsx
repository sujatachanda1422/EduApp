import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

const video = require('../images/video.png');
const activity = require('../images/activity.jpg');

export default function Videos({navigation, videoList}) {
  const onSubjectClick = item => {
    if (item.type === 'video') {
      navigation.navigate('HomeComp', {
        screen: 'VideoDetails',
        params: {
          videoDetails: item,
        },
      });
    } else {
      navigation.navigate('HomeComp', {
        screen: 'Scorm',
        params: {
          videoDetails: item,
        },
      });
    }
  };

  // useEffect(() => {
  //   // console.log("Props == ", videoList);
  // }, [videoList]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {videoList && (
          <FlatList
            data={videoList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.item}
                  onPress={() => onSubjectClick(item)}>
                  {item.type === 'video' && (
                    <Image source={video} style={styles.videoImg}></Image>
                  )}
                  {item.type === 'activity' && (
                    <Image source={activity} style={styles.activityImg}></Image>
                  )}
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
        {!videoList && (
          <Text>No videos found.</Text>
        )}
      </View>
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
  wrapper: {
    flex: 1,
    // margin: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  item: {
    height: 80,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
    borderColor: '#1877f2',
    borderLeftWidth: 5,
  },
  videoImg: {
    width: 80,
    height: 50,
    marginRight: 15,
  },
  activityImg: {
    width: 80,
    height: 70,
    marginRight: 15,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 20,
  },
});
