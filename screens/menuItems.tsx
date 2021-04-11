import React, {} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MenuItems({navigation}) {
  const doLogout = () => {
    Alert.alert('', 'Are you sure, you want to leave?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          AsyncStorage.removeItem('userData');
          AsyncStorage.removeItem('subjects');

          navigation.navigate('HomeComp', {
            screen: 'Login',
          });
        },
      },
    ]);
  };

  const onMenuSelect = async (item: string) => {
    switch (item) {
      case 'profile':
        navigation.navigate('HomeComp', {
          screen: 'Profile',
        });
        break;
      case 'logout':
        doLogout();
        break;
    }

    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <View>
        {/* <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => onMenuSelect('profile')}>
            <FontAwesome5
              name="user-edit"
              size={24}
              color="#557dd6"
              style={{marginLeft: -3}}
            />
            <Text style={styles.item}>Profile</Text>
          </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.itemWrapper}
          onPress={() => onMenuSelect('logout')}>
          <MaterialCommunityIcons name="logout" size={28} color="#557dd6" />
          <Text style={styles.item}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemWrapper: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  item: {
    color: '#2649c5',
    fontSize: 20,
    marginLeft: 20,
  },
});
