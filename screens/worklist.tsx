import React from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity, Text} from 'react-native';
import * as worklist from '../data/worklist.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// const image = require("../images/login.jpg");

export default function Worklist({navigation}) {
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
          data={worklist.list}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.item}
                // onPress={() => onSubjectClick(item)}
              >
                <View style={{flex: 1}}>
                  <Text style={styles.itemHeader}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <MaterialCommunityIcons
                  name="download"
                  color="#000"
                  size={40}
                />
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
    backgroundColor: '#d6e2e8',
  },
  wrapper: {
    flex: 1,
    // margin: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  item: {
    height: 120,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemHeader: {
    color: 'violet',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 18,
    color: '#000',
    marginTop: 20,
  },
  itemDate: {
    color: 'violet',
    fontWeight: 'bold',
  },
});
