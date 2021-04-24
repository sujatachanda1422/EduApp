import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {HelperText, Provider, Snackbar} from 'react-native-paper';
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CryptoJS from 'react-native-crypto-js';
import ImagePicker from 'react-native-image-picker';

let userUrl = require('../images/user.png');

export default function ChangeProfilePic({navigation}) {
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const uploadImage = async () => {
    if (!imageBlob) {
      Alert.alert('', `Please select a new image`);
      return;
    }

    let user = JSON.parse(await AsyncStorage.getItem('userData'));

    const param = {
      email: user.email,
      image: imageBlob,
    };

    setIsLoading(true);

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/imageUpload',
        param,
      )
      .then(response => response.json())
      .then(async res => {
        console.log('Data = ', res);

        if (res.status === 200) {
          setImageInDb(user, res.data.Location);
        } else {
          setIsLoading(false);

          Alert.alert('', `Image upload error`);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const setImageInDb = async (user, imageUrl) => {
    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/updateImage',
        {email: user.email, imageUrl},
      )
      .then(response => response.json())
      .then(async res => {
        console.log('Data = ', res);
        setIsLoading(false);

        if (res.status === 200) {
          setVisible(true);
          user.imageUrl = imageUrl;
          await AsyncStorage.setItem('userData', JSON.stringify(user));

          setTimeout(() => {
            navigation.navigate('HomeComp', {
              screen: 'Dashboard',
            });
          }, 500);
        } else {
          Alert.alert('', `Image upload error`);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const pickImage = async () => {
    const options = {
      title: 'Select Profile Picture',
      noData: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
      storageOptions: {privateDirectory: true},
    };

    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // this.setState({ picUpload: true });
        try {
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', response.uri, true);
            xhr.send(null);
          });

          setImage(response.uri);

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            setImageBlob(reader.result);
          };
        } catch (err) {
          console.log('Img err ..........', err);
        }
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )}

      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={34} color="grey" />
        </TouchableOpacity>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={{marginLeft: 50, marginBottom: 50}}>
          Saved successfully!
        </Snackbar>

        <View style={{justifyContent: 'center', flex: 1}}>
          <TouchableOpacity
            style={{width: 200, position: 'relative'}}
            onPress={() => pickImage()}>
            {/* {this.state.picUpload === true && (
              <View style={styles.picLoader}>
                <ActivityIndicator size="large" color="#dcdcdc" />
              </View>
            )} */}
            <Image
              source={image ? {uri: image} : userUrl}
              style={styles.profileImg}
            />
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={36}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: 20, marginTop: 10}}>
            <Button
              color="#e9165b"
              title="Save"
              onPress={() => uploadImage()}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  overlay: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    height: '100%',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  inputStyle: {
    width: '90%',
    color: '#000',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#ade0f2',
    borderRadius: 2,
    height: 46,
    fontSize: 15,
    marginBottom: 5,
  },
  disabledInput: {
    backgroundColor: '#d9d9d9',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  loginText: {
    marginTop: 20,
    color: '#0c50ea',
    textAlign: 'center',
    fontSize: 16,
  },
  dropDown: {
    marginHorizontal: 20,
    marginBottom: 5,
  },
  profileImg: {
    width: 200,
    height: 200,
    // borderRadius: 200
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
