import React, {Component} from 'react';
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
import * as subjects from '../data/subjects.json';
import * as Images from '../data/images';

let bkg = require('../images/header.jpg');
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
        }
      });
    } else {
      navigation.navigate('HomeComp', {
        screen: 'Lesson',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bkg} style={styles.image}>
        <Text style={styles.headerStyle}>School</Text>
        <Text style={styles.headerStyle}>Anytime</Text>
        <Text style={styles.headerStyle}>Anywhere</Text>
      </ImageBackground>
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
                  <Image
                    source={shadow}
                    style={styles.shadowImg}></Image>
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
  },
  wrapper: {
    flex: 1,
    margin: 20,
  },
  headerStyle: {
    fontSize: 42,
    marginLeft: 110,
  },
  listContainer: {
    paddingTop: 20,
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
    marginBottom: 15
  },
  shadowImg: {
    position: 'absolute',
    left: -20,
    width: 110,
    height: 100
  },
});
