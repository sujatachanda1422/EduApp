import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground, ScrollView} from 'react-native';

import {HelperText, TextInput, Button, Text} from 'react-native-paper';
import {http} from '../services/http';

const bkg = require('../images/register-bkg.png');

export default function Register({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setconfirmPwd] = useState('');

  const hasErrors = () => {
    return false;
    return email && !email.includes('@');
  };

  const register = () => {
    const param = {
      name,
      email,
      mobile,
      pwd,
    };

    console.log('Val = ', param);

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/register',
        param,
      )
      .then((response) => response.json())
      .then((res) => {
        console.log("Data = ", res);
        navigation.navigate('HomeComp', {
          // screen: 'Role',
          screen: 'Dashboard',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={bkg} style={styles.image}>
        <View style={styles.overlay}>
          <View>
            <TextInput
              style={styles.inputStyle}
              label="Fullname"
              value={name}
              onChangeText={(name) => setName(name)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Please enter fullname
            </HelperText>
          </View>
          <View>
            <TextInput
              label="Email"
              value={email}
              style={styles.inputStyle}
              onChangeText={(email) => setEmail(email)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Email address is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              label="Mobile (Optional)"
              keyboardType="numeric"
              value={mobile}
              onChangeText={(mobile) => setMobile(mobile)}
              maxLength={10}
            />
            <HelperText type="error" visible={hasErrors()}>
              Mobile number is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              label="Password"
              secureTextEntry={true}
              value={pwd}
              onChangeText={(pwd) => setPwd(pwd)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Please eneter password
            </HelperText>
            <TextInput
              style={styles.inputStyle}
              label="Confirm Password"
              secureTextEntry={true}
              value={confirmPwd}
              onChangeText={(confirmPwd) => setconfirmPwd(confirmPwd)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Password does not match
            </HelperText>
          </View>
          <Button
            color="#2dadb3"
            mode="contained"
            style={{marginTop: 30}}
            onPress={() => register()}>
            Register
          </Button>

          <Text
            style={styles.loginText}
            onPress={() =>
              navigation.navigate('HomeComp', {
                screen: 'Login',
              })
            }>
            Already have an account? Login now
          </Text>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  overlay: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
  },
  inputStyle: {
    backgroundColor: 'transparent',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  loginText: {
    marginTop: 40,
    color: '#0c50ea',
    textAlign: 'center',
    fontSize: 16,
  },
});
