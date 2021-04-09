import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  Text,
  BackHandler,
} from 'react-native';
import * as lessons from '../data/lesson.json';
// const image = require("../images/login.jpg");

export default function Lesson({navigation}) {
  const register = () => {};

  const onLessonClick = (item) => {
    navigation.navigate('HomeComp', {
      screen: 'LessonDetails',
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons.list}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.item}
              onPress={() => onLessonClick(item)}>
              <Text style={styles.itemIndex}>{index + 1}</Text>
              <View>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemTextDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listContainer: {
    marginTop: 10,
    padding: 20,
  },
  item: {
    height: 90,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 25,
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    flexDirection: 'row',
  },
  itemIndex: {
    color: '#a468b5',
    fontSize: 30,
    fontWeight: 'bold',
    backgroundColor: '#f5ddff',
    borderRightColor: '#e19dff',
    borderRightWidth: 2,
    marginVertical: 15,
    marginRight: 20,
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    alignSelf: 'center',
  },
  itemText: {
    marginTop: 8,
    fontSize: 18,
  },
  itemTextDesc: {
    marginTop: 5,
    fontSize: 14,
    color: 'green'
  },
});
