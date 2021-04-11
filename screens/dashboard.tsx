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

export default function Dashboard({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [subjects, setSubjects] = useState([]);

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

  const name = 'kg';

  const getSubjectsList = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));
    setUser(data);

    const subjectsData = JSON.parse(await AsyncStorage.getItem('subjects'));
    setSubjects(subjectsData);

    if (subjectsData) {
      return;
    }

    setIsLoading(true);

    http
      .get(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/classList/' +
          name,
      )
      .then(response => response.json())
      .then(res => {
        // console.log('Data = ', res);

        if (res.subjects) {
          setIsLoading(false);
          setSubjects(res.subjects);
          AsyncStorage.setItem('subjects', JSON.stringify(res.subjects));
        }
      })
      .catch(error => {
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
        <Image source={userUrl} style={styles.userImg}></Image>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.class}>Kindergarten</Text>
      </View>

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
    backgroundColor: '#f7f7f7'
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
    marginVertical: 20,
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
    marginTop: 20,
  },
  class: {
    fontSize: 16,
    marginBottom: 15,
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
