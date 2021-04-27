import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import * as Images from '../data/images';
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

let userUrl = require('../images/user.png');
let shadow = require('../images/shadow.png');
let userShadow = require('../images/user-shadow.png');

export default function SubjectList({navigation, route}) {
  const {className} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [subjects, setSubjects] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getSubjectsList();

      if (user.role === 'student') {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            handleBackButton,
          );
        };
      }
    }, []),
  );

  const handleBackButton = () => {
    BackHandler.exitApp();
  };

  const getSubjectsList = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));
    setUser(data);

    const subjectsStoreData = await AsyncStorage.getItem('subjects');

    if (subjectsStoreData) {
      const subjectsData = JSON.parse(subjectsStoreData);
      setSubjects(subjectsData);

      return;
    }

    setIsLoading(true);

    http
      .get(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/classDetails/' +
          className,
      )
      .then(response => response.json())
      .then(res => {
        console.log('classes = ', res);

        if (res.subjects) {
          setIsLoading(false);
          setSubjects(res.subjects);
          AsyncStorage.setItem('subjects', JSON.stringify(res.subjects));
          getImageData(data.email);
        }
      })
      .catch(error => {
        console.log('classes error = ', error);
        setIsLoading(false);
        console.error(error);
      });
  };

  const getImageData = email => {
    http
      .get(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/getImage/' +
          email,
      )
      .then(response => response.json())
      .then(async res => {
        if (res.status === 200) {
          let userData = JSON.parse(await AsyncStorage.getItem('userData'));
          userData.imageUrl = res.data.replace(
            'dataimage/jpegbase64',
            'data:image/jpeg;base64,',
          );
          setUser(userData);

          console.log('email   = ', email, userData);

          AsyncStorage.setItem('userData', JSON.stringify(userData));
        }
      })
      .catch(error => {
        console.log('classes error = ', error);
        setIsLoading(false);
        console.error(error);
      });
  };

  const onSubjectClick = item => {
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
        params: {
          lessons: item.lessons,
          name: item.name,
        },
      });
    }
  };

  const changeProfilePic = () => {
    navigation.navigate('HomeComp', {
      screen: 'ChangeProfilePic',
      params: {},
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )}

      {user.role === 'student' && (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={34} color="grey" />
        </TouchableOpacity>
      )}

      {user.role === 'teacher' && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={34} color="grey" />
        </TouchableOpacity>
      )}

      {user.role === 'student' && (
        <View style={styles.imageWrapper}>
          <Image source={userShadow} style={styles.userShadow}></Image>
          <TouchableOpacity onPress={changeProfilePic}>
            <Image
              source={user.imageUrl ? {uri: user.imageUrl} : userUrl}
              style={styles.userImg}></Image>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.class}>{className}</Text>
        </View>
      )}

      {user.role === 'teacher' && (
        <View>
          <Text style={styles.classNameStyle}>{className}</Text>
        </View>
      )}

      <View style={styles.wrapper}>
        <FlatList
          data={subjects}
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  wrapper: {
    flex: 1,
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
    width: 100,
    height: 100,
  },
  userShadow: {
    position: 'absolute',
    width: 150,
    height: 120,
    top: -10,
  },
  imageWrapper: {
    justifyContent: 'center',
    marginVertical: 20,
    alignItems: 'center',
  },
  userImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 0,
    resizeMode: 'contain',
  },
  userName: {
    fontSize: 23,
    marginTop: 20,
  },
  class: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  classNameStyle: {
    fontSize: 20,
    margin: 40,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000007d',
    zIndex: 1,
  },
});
