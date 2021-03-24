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
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {LoginManager} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const bkg = require('../images/blue-background.jpg');
const logo = require('../images/book.png');
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

  register = () => {};

  userLogin = () => {
    this.props.navigation.navigate('HomeComp', {
      screen: 'Dashboard',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={bkg} style={styles.image}>
          <View style={styles.overlay}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Image
                source={logo}
                style={{marginTop: 10, width: 100, height: 100}}></Image>
              <Image source={appName} style={styles.appName}></Image>
              <Text style={styles.contextLine}>Learn Anytime Anywhere</Text>
            </View>
            <View style={{flex: 1}}>
              <View>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Mobile"
                  keyboardType="numeric"
                  // value={this.state.mobile}
                  // onChangeText={(val) => this.updateInputVal(val, 'mobile')}
                  maxLength={10}
                />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Password"
                  // value={this.state.loginPin}
                  // onChangeText={(val) => this.updateInputVal(val, 'loginPin')}
                />
                <Button
                  color="#2dadb3"
                  title="Sign In"
                  onPress={() => this.userLogin()}
                />
              </View>
              <View style={styles.loginBtn}>
                <Text style={styles.signUp} onPress={() => this.register()}>
                  Sign Up
                </Text>
              </View>
              <View style={styles.loginBtn}>
                <Text style={styles.before}></Text>
                <Text style={styles.dividerText}> OR </Text>
                <Text style={styles.before}></Text>
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
            </View>
          </View>
        </ImageBackground>
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
    backgroundColor: 'rgba(199,199,199,0.3)',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  loginBtn: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    width: '80%',
    height: 100,
    marginTop: 20,
    resizeMode: 'contain',
    marginBottom: -15,
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
    marginBottom: 25,
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
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
    color: '#fff',
    marginTop: 20,
    fontSize: 18,
  },
  before: {
    backgroundColor: '#fff',
    height: 1,
    width: '40%',
  },
  dividerText: {
    color: '#fff',
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
