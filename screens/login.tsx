import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  Alert,
  Text,
  BackHandler,
} from 'react-native';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';

const logo = require('../images/bee.png');
const appName = require('../images/app-name.png');
const user1 = require('../images/user1.png');
const user2 = require('../images/user2.png');

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const checkLoginInStore = (data: any) => {
    // console.log('Data = ', data);
    const emailId = data.email;

    http
      .post(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/addLoginHistory',
        {email: emailId},
      )
      .then(response => response.json())
      .then(res => {
        // console.log('setLoginInDB = ', res);

        if (res.status === 200) {
          setLoginInStore(data);
        } else if (res.status === 500) {
          Alert.alert(
            '',
            `User with email ${emailId} is already logged in another device.`,
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const setLoginInStore = async data => {
    // console.log('setLoginInStore Data = ', data);

    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('userData', jsonValue);

    navigation.navigate('HomeComp', {
      screen: 'Dashboard',
    });
  };

  const setProfile = data => {
    // console.log('Social = ', data);

    userLogin(true, data);
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'email,name,friends',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          // console.log('login info has error: ' + error);
        } else {
          // console.log('result:', result);
          setProfile(result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const facebookLogin = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]).then(
      result => {
        if (result.isCancelled) {
          // console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        // console.log('Login fail with error: ', error);
      },
    );
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      setProfile(userInfo.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // console.log('Login cancelled');
      } else {
        // console.log('Login error = ', JSON.stringify(error));
      }
    }
  };

  const register = () => {
    navigation.navigate('HomeComp', {
      screen: 'Register',
    });
  };

  const userLogin = (isSocial: boolean, data?) => {
    if (!isSocial && (!email.trim() || !pwd.trim())) {
      return;
    }

    const emailId = isSocial ? data.email : email;

    // console.log('emailId = ', emailId);

    http
      .post(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/login',
        {email: emailId},
      )
      .then(response => response.json())
      .then(res => {
        // console.log('login = ', res);

        if (!isSocial) {
          if (res.status === 200) {
            // Decrypt
            let bytes = CryptoJS.AES.decrypt(res.data.pwd, 'issschool');
            let pwdDecrypt = bytes.toString(CryptoJS.enc.Utf8);

            if (pwdDecrypt === pwd) {
              setLoginInStore(res.data);
            } else {
              setErrorMsg('Wrong password');
            }
          } else if (res.status === 500 || res.status === 404) {
            setErrorMsg(res.message);
          }
        } else {
          if (res.status === 200) {
            setLoginInStore(res.data);
          } else {
            navigation.navigate('HomeComp', {
              screen: 'Profile',
              params: {
                emailId: data.email,
                fullName: data.name,
              },
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Image source={appName} style={styles.appName}></Image>
        {!!errorMsg.length && (
          <View>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        <View style={{flex: 1}}>
          <View style={styles.inputContainer}>
            <Image source={user1} style={styles.userIcon}></Image>

            <TextInput
              style={styles.inputStyle}
              placeholder="Username"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={email => {
                setErrorMsg('');
                setEmail(email);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Image source={user2} style={styles.userIcon}></Image>
            <TextInput
              style={[styles.inputStyle, {height: 45}]}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="#fff"
              value={pwd}
              onChangeText={pwd => {
                setErrorMsg('');
                setPwd(pwd);
              }}
            />
          </View>
          <View style={{marginTop: 10}}>
            <Button
              color="#e9165b"
              title="Login"
              onPress={() => userLogin(false)}
            />
          </View>
          <View style={styles.loginBtn}>
            <View style={styles.fbBtn}>
              <Button
                color="#1877f2"
                title="Facebook"
                onPress={() => facebookLogin()}
              />
            </View>
            <View style={styles.googleBtn}>
              <Button
                color="#f55"
                title="Google"
                onPress={() => googleLogin()}
              />
            </View>
          </View>
          <Text style={styles.signUp} onPress={() => register()}>
            Sign Up
          </Text>
          <Image source={logo} style={styles.logo}></Image>
        </View>
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
  overlay: {
    backgroundColor: '#fff',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loginBtn: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  appName: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  contextLine: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  inputStyle: {
    width: '90%',
    color: '#fff',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#ade0f2',
    borderRadius: 2,
    height: 46,
  },
  fbBtn: {
    flex: 1,
    marginRight: 10,
  },
  googleBtn: {
    flex: 1,
  },
  signUp: {
    color: 'blue',
    fontSize: 18,
    alignSelf: 'center',
  },
  before: {
    backgroundColor: '#fff',
    height: 1,
    width: '40%',
  },
  logo: {
    marginTop: 40,
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  userIcon: {
    width: 45,
    height: 53,
    resizeMode: 'contain',
    marginRight: -1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    top: -40,
    left: '33%',
    position: 'absolute',
  },
});
