import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  BackHandler,
} from 'react-native';
import * as subjects from '../data/subjects.json';
import * as Images from '../data/images';

let user = require('../images/user.jpg');
let shadow = require('../images/shadow.png');

export default function Dashboard({navigation}) {
  const register = () => {};

  const onSubjectClick = (item) => {
    if (item.subCategory) {
      navigation.navigate('HomeComp', {
        screen: 'SubjectCategory',
        params: {
          subCategory: item.subCategory,
          name: item.name,
        },
      });
    } else {
      navigation.navigate('HomeComp', {
        screen: 'Lesson',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={user} style={styles.userImg}></Image>
        <Text style={styles.userName}>Suman Sinha</Text>
        <Text style={styles.class}>Kindergarten</Text>
      </View>
      <View style={styles.wrapper}>
        <FlatList
          data={subjects.list}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.item}
                onPress={() => onSubjectClick(item)}>
                <View style={styles.listIconWrapper}>
                  <Image source={shadow} style={styles.shadowImg}></Image>
                  <Image
                    source={Images[item.icon]}
                    style={styles.listIcon}></Image>
                </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  wrapper: {
    flex: 1,
  },
  headerStyle: {
    fontSize: 42,
    marginLeft: 110,
  },
  listContainer: {
    // paddingTop: 20,
  },
  image: {
    height: 260,
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    transform: [{scaleX: 1.4}],
  },
  item: {
    height: 150,
    elevation: 5,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  listIcon: {
    width: 70,
    height: 70,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 18,
  },
  listIconWrapper: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  shadowImg: {
    position: 'absolute',
    left: -20,
    width: 110,
    height: 100,
  },
  imageWrapper: {
    justifyContent: 'center',
    marginVertical: 50,
    alignItems: 'center',
  },
  userImg: {
    width: 100,
    height: 100,
    borderRadius: 40,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  userName: {
    fontSize: 22,
    marginTop: 20
  },
  class: {
    fontSize: 16,
    marginTop: 5
  },
});
