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

// let image = require('../images/book.png');

export default function Dashboard({navigation}) {
  const register = () => {};

  const onSubjectClick = (item) => {
    navigation.navigate('HomeComp', {
      screen: 'Lesson',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* <View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Search subject"
            // value={this.state.mobile}
            // onChangeText={(val) => this.updateInputVal(val, 'mobile')}
            maxLength={10}
          />
        </View> */}
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
                <Image
                  source={Images[item.icon]}
                  style={styles.listIcon}></Image>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemTextContext}>{item.tagline}</Text>
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    margin: 20,
  },
  inputStyle: {
    width: '100%',
    margin: 25,
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  listContainer: {
    paddingTop: 20,
  },
  item: {
    height: 200,
    paddingHorizontal: 10,
    elevation: 5,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
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
  itemTextContext: {
    fontSize: 12,
    marginTop: 5,
    color: '#2dadb3',
  },
});
