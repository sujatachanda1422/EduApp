import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {HelperText, Provider, Snackbar} from 'react-native-paper';
import {http} from '../services/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CryptoJS from 'react-native-crypto-js';

export default function Profile({navigation}) {
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [onSubmitClick, setOnSubmitClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const hasError = () => {
    if (!onSubmitClick) {
      return false;
    }
    return !pwd.trim();
  };

  const matchPwd = () => {
    if (!onSubmitClick) {
      return false;
    }

    if (pwd.trim().length && confirmPwd.trim().length && pwd === confirmPwd) {
      return false;
    }

    return true;
  };

  const updatePassword = async () => {
    setOnSubmitClick(true);

    if (!pwd.trim().length || !confirmPwd.trim().length || pwd !== confirmPwd) {
      return;
    }

    const email = JSON.parse(await AsyncStorage.getItem('userData')).email;
    // Encrypt
    const encryptedPwd = CryptoJS.AES.encrypt(pwd, 'issschool').toString();

    const param = {
      email,
      pwd: encryptedPwd,
    };

    setIsLoading(true);

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/updatePassword',
        param,
      )
      .then(response => response.json())
      .then(async res => {
        console.log('Data = ', res);
        setIsLoading(false);

        if (res.status === 200) {
          setVisible(true);

          await AsyncStorage.setItem('userData', JSON.stringify(res.user));

          setTimeout(() => {
            navigation.navigate('HomeComp', {
              screen: 'Dashboard',
            });
          }, 500);
        } else if (res.status === 500) {
          Alert.alert('', `User with email ${email} already exists.`);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
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
          <TextInput
            style={styles.inputStyle}
            placeholder="New Password"
            secureTextEntry={true}
            value={pwd}
            min
            onChangeText={pwd => {
              setOnSubmitClick(false);
              setPwd(pwd);
            }}
            ref={ref =>
              ref && ref.setNativeProps({style: {fontFamily: 'Roboto-Regular'}})
            }
          />
          <HelperText
            style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
            type="error"
            visible={hasError()}>
            Please enter password
          </HelperText>
          <TextInput
            style={styles.inputStyle}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPwd}
            onChangeText={confirmPwd => {
              setOnSubmitClick(false);
              setConfirmPwd(confirmPwd);
            }}
            ref={ref =>
              ref && ref.setNativeProps({style: {fontFamily: 'Roboto-Regular'}})
            }
          />
          <HelperText
            style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
            type="error"
            visible={matchPwd()}>
            Password does not match
          </HelperText>

          <View style={{marginHorizontal: 20, marginTop: 10}}>
            <Button color="#e9165b" title="Save" onPress={() => updatePassword()} />
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
