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
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

let userUrl = require('../images/user.png');
let userShadow = require('../images/user-shadow.png');

export default function Dashboard({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [classes, setClasses] = useState([]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      getSubjectsList();

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    }, []),
  );

  const handleBackButton = () => {
    BackHandler.exitApp();
  };

  const getSubjectsList = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));
    setUser(data);

    if (data.role === 'student') {
      navigation.navigate('HomeComp', {
        screen: 'SubjectList',
        params: {
          className: data.class,
        },
      });

      return;
    }

    const classData = JSON.parse(await AsyncStorage.getItem('classList'));

    if (classData) {
      setClasses(classData);

      return;
    }

    setIsLoading(true);

    http
      .get(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/classList',
      )
      .then(response => response.json())
      .then(async res => {
        console.log('classes = ', res);
        setIsLoading(false);

        if (res.length) {
          setClasses(res);
          await AsyncStorage.setItem('classList', JSON.stringify(res));
        }
      })
      .catch(error => {
        console.log('classes error = ', error);
        setIsLoading(false);
        console.error(error);
      });
  };

  const onClassClick = async item => {
    await AsyncStorage.setItem('subjects', JSON.stringify(item.subjects));

    navigation.navigate('HomeComp', {
      screen: 'SubjectList',
      params: {
        className: item.name,
      },
    });
  };

  const checkIndexIsEven = n => {
    return [0, 3].indexOf(n) > -1;
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MaterialCommunityIcons name="menu" size={34} color="grey" />
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <Image source={userShadow} style={styles.userShadow}></Image>
        <Image source={userUrl} style={styles.userImg}></Image>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.class}>{user.role}</Text>
      </View>

      <View style={styles.wrapper}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={2}
          data={classes.sort((a, b) => a.order > b.order)}
          contentContainerStyle={styles.listContainer}
          renderItem={({item, index}) => {
            return (
              <>
                {item.name !== user.class && (
                  <View
                    style={[
                      styles.item,
                      {
                        backgroundColor: checkIndexIsEven(index)
                          ? '#e9165b'
                          : '#2dadb3',
                      },
                    ]}>
                    <View style={styles.lockIconBkg}></View>
                    <MaterialCommunityIcons
                      name="lock"
                      size={34}
                      style={styles.lockIcon}
                      color="#000"
                    />
                    <Text style={styles.itemText}>{item.displayName}</Text>
                  </View>
                )}

                {item.name === user.class && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.item,
                      {
                        backgroundColor: checkIndexIsEven(index)
                          ? '#e9165b'
                          : '#2dadb3',
                      },
                    ]}
                    onPress={() => onClassClick(item)}>
                    <Text style={styles.itemText}>{item.displayName}</Text>
                  </TouchableOpacity>
                )}
              </>
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
    height: 160,
    elevation: 8,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#000',
    position: 'relative',
  },
  listIcon: {
    width: 70,
    height: 70,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 18,
    textTransform: 'uppercase',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
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
    marginVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  userImg: {
    width: 100,
    height: 100,
    borderRadius: 40,
    overflow: 'hidden',
    resizeMode: 'contain',
    //  position: 'absolute',
  },
  userName: {
    fontSize: 23,
    marginTop: 20,
  },
  userShadow: {
    position: 'absolute',
    width: 150,
    height: 120,
    top: -10,
  },
  class: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  lockIconBkg: {
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: '#dcdcdc',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  lockIcon: {
    position: 'absolute',
    zIndex: 10,
    opacity: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
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
