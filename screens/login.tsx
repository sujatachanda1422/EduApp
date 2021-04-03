import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  ImageBackground,
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

const logo = require('../images/bee.png');
const appName = require('../images/app-name.png');
const user1 = require('../images/user1.png');
const user2 = require('../images/user2.png');

export default class Login extends Component {
  constructor() {
    super();
  }

  handleBackButton = () => {
    BackHandler.exitApp();
  };

  facebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success with permissions:');
          this.props.navigation.navigate('HomeComp', {
            screen: 'Dashboard',
          });
        }
      },
      (error) => {
        console.log('Login fail with error: ', error);
      },
    );
  };
  googleLogin = async () => {
    try {
      await GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      console.log('User = ', userInfo);
      this.props.navigation.navigate('HomeComp', {
        screen: 'Dashboard',
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Login cancelled');
      } else {
        // some other error happened
        console.log('Login error = ', error);
      }
    }
  };

  register = () => {
    this.props.navigation.navigate('HomeComp', {
      screen: 'Register',
    });
  };

  userLogin = () => {
    this.props.navigation.navigate('HomeComp', {
      screen: 'Dashboard',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <Image source={appName} style={styles.appName}></Image>
          <View style={{flex: 1}}>
            <View style={styles.inputContainer}>
              <Image source={user1} style={styles.userIcon}></Image>
              <TextInput
                style={styles.inputStyle}
                placeholder="Username"
                placeholderTextColor="#fff"
                // value={this.state.mobile}
                // onChangeText={(val) => this.updateInputVal(val, 'mobile')}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image source={user2} style={styles.userIcon}></Image>
              <TextInput
                style={[styles.inputStyle, {height: 45}]}
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#fff"
                // value={this.state.loginPin}
                // onChangeText={(val) => this.updateInputVal(val, 'loginPin')}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Button
                color="#e9165b"
                title="Login"
                onPress={() => this.userLogin()}
              />
            </View>
            <View style={styles.loginBtn}>
              <View style={styles.fbBtn}>
                <Button
                  color="#1877f2"
                  title="Facebook"
                  onPress={() => this.facebookLogin()}
                />
              </View>
              <View style={styles.googleBtn}>
                <Button
                  color="#f55"
                  title="Google"
                  onPress={() => this.googleLogin()}
                />
              </View>
            </View>
            <Text style={styles.signUp} onPress={() => this.register()}>
              Sign Up
            </Text>
            <Image source={logo} style={styles.logo}></Image>
          </View>
        </View>
      </View>
    );
  }
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
    height: 46
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
    marginRight: -1
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
});
