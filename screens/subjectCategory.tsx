import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Images from '../data/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let shadow = require('../images/shadow.png');

export default function SubjectCategory({route, navigation}) {
  const {name, subCategory} = route.params;

  const onSubjectClick = (item) => {
    navigation.navigate('HomeComp', {
      screen: 'Lesson',
    });
  };

  // useEffect(() => {
  //   console.log('Prop = ', subCategory);
  // }, []);

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        color={'#000'}
        size={35}
        style={{margin: 10}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Image
            source={Images[name.toLowerCase()]}
            style={[styles.listIcon, styles.headerListIcon]}></Image>
          <Text style={styles.headerItemText}>{name}</Text>
        </View>
        <FlatList
          data={subCategory}
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
                    source={Images[item.name.toLowerCase()]}
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    marginHorizontal: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  item: {
    height: 160,
    maxWidth: '42%',
    paddingHorizontal: 10,
    elevation: 5,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 15,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  listIcon: {
    width: 70,
    height: 70,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 18,
  },
  headerItemText: {
    fontSize: 30,
    color: '#ff1ea5',
  },
  listIconWrapper: {
    backgroundColor: '#fff',
  },
  header: {
    marginVertical: 30,
    alignItems: 'center',
  },
  headerListIcon: {
    width: 120,
    height: 120,
    marginBottom: 0,
  },
  shadowImg: {
    position: 'absolute',
    left: -20,
    width: 110,
    height: 100
  },
});
