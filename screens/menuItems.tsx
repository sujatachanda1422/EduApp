import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {http} from '../services/http';

export default function MenuItems({navigation}) {
  const doLogout = () => {
    Alert.alert('', 'Are you sure, you want to leave?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          deleteLoginHistory();
        },
      },
    ]);
  };

  const onMenuSelect = async (item: string) => {
    switch (item) {
      case 'home':
        navigation.navigate('HomeComp', {
          screen: 'Dashboard',
        });
        break;
      case 'profile':
        navigation.navigate('HomeComp', {
          screen: 'Profile',
        });
        break;
      case 'changePwd':
        navigation.navigate('HomeComp', {
          screen: 'ChangePwd',
        });
        break;
      case 'logout':
        doLogout();
        break;
    }

    navigation.closeDrawer();
  };

  const deleteLoginHistory = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));

    http
      .delete(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/deleteLoginHistory',
        {email: data.email},
      )
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          AsyncStorage.clear();

          navigation.navigate('HomeComp', {
            screen: 'Login',
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.itemWrapper}
          onPress={() => onMenuSelect('home')}>
          <MaterialCommunityIcons
            name="home"
            size={29}
            color="#557dd6"
            style={{marginLeft: -3}}
          />
          <Text style={styles.item}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemWrapper}
          onPress={() => onMenuSelect('profile')}>
          <MaterialCommunityIcons
            name="account-edit"
            size={29}
            color="#557dd6"
            style={{marginLeft: -3}}
          />
          <Text style={styles.item}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemWrapper}
          onPress={() => onMenuSelect('changePwd')}>
          <MaterialCommunityIcons
            name="lock-question"
            size={29}
            color="#557dd6"
            style={{marginLeft: -3}}
          />
          <Text style={styles.item}>Change Password</Text>
        </TouchableOpacity>
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
