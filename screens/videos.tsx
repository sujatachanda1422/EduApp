import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import * as videos from '../data/videos.json';

const video = require('../images/video.png');

export default function Videos({navigation}) {
  const register = () => {};

  const onSubjectClick = () => {
    navigation.navigate('HomeComp', {
      screen: 'Login',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          data={videos.list}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.item}
                // onPress={() => onSubjectClick(item)}
              >
                <Image source={video} style={styles.videoImg}></Image>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
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
    marginBottom: 5,
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
  itemText: {
    fontSize: 20,
  },
});
