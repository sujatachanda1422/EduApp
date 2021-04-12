import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {HelperText, Provider, DefaultTheme} from 'react-native-paper';
import {http} from '../services/http';
import DropDown from '../libraries/dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../images/bee.png');
const roleList = [
  {label: 'Student', value: 'student'},
  {label: 'Teacher', value: 'teacher'},
  // {label: 'Parent', value: 'Parent'},
  // {label: 'Admin', value: 'admin'},
];
const classList = [
  {label: 'Play Group', value: 'playgroup'},
  {label: 'Nursery', value: 'nursery'},
  {label: 'Lower KG', value: 'lkg'},
  {label: 'Upper KG', value: 'ukg'},
];
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000',
    accent: '#000',
  },
};

export default function Register({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showRoleDropDown, setShowRoleDropDown] = useState(false);
  const [showClassDropDown, setShowClassDropDown] = useState(false);
  const [role, setRole] = useState('');
  const [classSelected, setClassSelected] = useState('');
  const [onSubmitClick, setOnSubmitClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasError = (field: string) => {
    if (!onSubmitClick) {
      return false;
    }

    switch (field) {
      case 'name':
        return !name.trim();
      case 'mobile':
        return mobile.trim().length && mobile.length < 10;
      case 'password':
        return !pwd.trim();
      case 'email':
        return !email || !email.includes('@');
      case 'role':
        return !role;
      case 'class':
        return !classSelected;
    }
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

  const onDropdownChange = (val, type) => {
    setOnSubmitClick(false);

    if (type === 'role') {
      setRole(val);
    } else {
      setClassSelected(val);
    }
  };

  const register = () => {
    setOnSubmitClick(true);

    const param = {
      name,
      email,
      mobile,
      pwd,
      role,
      class: classSelected,
    };

    if (
      !name ||
      !email.includes('@') ||
      pwd !== confirmPwd ||
      !role ||
      !classSelected
    ) {
      return;
    }

    console.log('param = ', param);
    setIsLoading(true);

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/register',
        param,
      )
      .then(response => response.json())
      .then(async res => {
        console.log('Data = ', res);
        setIsLoading(false);

        if (res.status === 200) {
          await AsyncStorage.setItem('userData', JSON.stringify(param));

          navigation.navigate('HomeComp', {
            screen: 'Dashboard',
          });
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
    <Provider children="" theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && (
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        )}

        <View style={styles.overlay}>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Fullname"
              value={name}
              onChangeText={name => {
                setOnSubmitClick(false);
                setName(name);
              }}
            />
            <HelperText
              style={{marginLeft: 10}}
              type="error"
              visible={hasError('name')}>
              Please enter fullname
            </HelperText>
          </View>
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              style={styles.inputStyle}
              onChangeText={email => {
                setOnSubmitClick(false);
                setEmail(email);
              }}
            />
            <HelperText
              style={{marginLeft: 10}}
              type="error"
              visible={hasError('email')}>
              Email address is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Mobile (Optional)"
              keyboardType="numeric"
              value={mobile}
              onChangeText={mobile => {
                setOnSubmitClick(false);
                setMobile(mobile);
              }}
              maxLength={10}
            />
            <HelperText
              style={{marginLeft: 10}}
              type="error"
              visible={hasError('mobile')}>
              Mobile number is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Password"
              secureTextEntry={true}
              value={pwd}
              min
              onChangeText={pwd => {
                setOnSubmitClick(false);
                setPwd(pwd);
              }}
              ref={ref =>
                ref &&
                ref.setNativeProps({style: {fontFamily: 'Roboto-Regular'}})
              }
            />
            <HelperText
              style={{marginLeft: 10}}
              type="error"
              visible={hasError('password')}>
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
                ref &&
                ref.setNativeProps({style: {fontFamily: 'Roboto-Regular'}})
              }
            />
            <HelperText
              style={{marginLeft: 10}}
              type="error"
              visible={matchPwd()}>
              Password does not match
            </HelperText>
          </View>
          <View style={styles.dropDown}>
            <DropDown
              label={'Role'}
              value={role}
              setValue={evt => onDropdownChange(evt, 'role')}
              activeColor="#000"
              list={roleList}
              visible={showRoleDropDown}
              showDropDown={() => setShowRoleDropDown(true)}
              onDismiss={() => setShowRoleDropDown(false)}
            />
            <HelperText
              style={{marginLeft: -10}}
              type="error"
              visible={hasError('role')}>
              Please select a role.
            </HelperText>
          </View>
          <View style={styles.dropDown}>
            <DropDown
              label={'Class'}
              value={classSelected}
              setValue={val => onDropdownChange(val, 'class')}
              activeColor="#000"
              list={classList}
              visible={showClassDropDown}
              showDropDown={() => setShowClassDropDown(true)}
              onDismiss={() => setShowClassDropDown(false)}
            />
            <HelperText
              style={{marginLeft: -10}}
              type="error"
              visible={hasError('class')}>
              Please select a class.
            </HelperText>
          </View>

          <View style={{marginHorizontal: 20, marginTop: 10}}>
            <Button
              color="#e9165b"
              title="Register"
              onPress={() => register()}
            />
          </View>
          <Text
            style={styles.loginText}
            onPress={() =>
              navigation.navigate('HomeComp', {
                screen: 'Login',
              })
            }>
            Already have an account? Login now
          </Text>

          <Image source={logo} style={styles.logo}></Image>
        </View>
      </ScrollView>
    </Provider>
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
    paddingTop: 50,
    height: '100%',
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
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  loginText: {
    marginTop: 30,
    color: '#0c50ea',
    textAlign: 'center',
    fontSize: 16,
  },
  dropDown: {
    marginHorizontal: 20,
  },
  logo: {
    marginTop: 20,
    width: 150,
    height: 150,
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
    backgroundColor: '#0000007d',
    zIndex: 1,
  },
});
