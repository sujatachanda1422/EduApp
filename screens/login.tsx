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
            <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Mobile"
                keyboardType="numeric"
                placeholderTextColor="#fff"
                // value={this.state.mobile}
                // onChangeText={(val) => this.updateInputVal(val, 'mobile')}
                maxLength={10}
              />
              <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#fff"
                // value={this.state.loginPin}
                // onChangeText={(val) => this.updateInputVal(val, 'loginPin')}
              />
              <View style={{marginTop: 10}}>
                <Button
                  color="#d13fa4"
                  title="Login"
                  onPress={() => this.userLogin()}
                />
              </View>
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
    marginVertical: 20
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
    width: '100%',
    marginBottom: 15,
    color: '#fff',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#98eaf2',
    borderRadius: 2,
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
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
