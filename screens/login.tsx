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
import {LoginManager} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const IMEI = require('react-native-imei');
const logo = require('../images/bee.png');
const appName = require('../images/app-name.png');
const user1 = require('../images/user1.png');
const user2 = require('../images/user2.png');

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imei, setImei] = useState('');

  // useEffect(() => {
  //   IMEI.getImei().then(imeiList => {
  //     console.log('imeiList', imeiList);
  //   });
  // }, []);

  const setLoginInStore = async data => {
    // console.log('Data = ', data);

    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('userData', jsonValue);

    navigation.navigate('HomeComp', {
      screen: 'Dashboard',
    });
  };

  const facebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          setLoginInStore(result);
        }
      },
      error => {
        console.log('Login fail with error: ', error);
      },
    );
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      setLoginInStore(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelled');
      } else {
        console.log('Login error = ', JSON.stringify(error));
      }
    }
  };

  const register = () => {
    navigation.navigate('HomeComp', {
      screen: 'Register',
    });
  };

  const userLogin = () => {
    if (!email.trim() || !pwd.trim()) {
      return;
    }

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/login',
        {email, pwd},
      )
      .then(response => response.json())
      .then(res => {
        console.log('login = ', res);

        if (res.status === 200) {
          setLoginInStore(res.data);
        } else if (res.status === 500 || res.status === 404) {
          setErrorMsg(res.message);
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
            <Button color="#e9165b" title="Login" onPress={() => userLogin()} />
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
