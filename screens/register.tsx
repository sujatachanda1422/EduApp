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
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HelperText, Provider, DefaultTheme, Checkbox} from 'react-native-paper';
import {http} from '../services/http';
import DropDown from '../libraries/dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as terms from '../data/terms.json';
import CryptoJS from 'react-native-crypto-js';

const logo = require('../images/bee.png');
const roleList = [
  {label: 'Student/Parent', value: 'student'},
  {label: 'Teacher', value: 'teacher'},
  // {label: 'Parent', value: 'Parent'},
  // {label: 'Admin', value: 'admin'},
];
const classList = [
  {label: 'Play Group', value: 'playgroup'},
  {label: 'Nursery', value: 'nursery'},
  {label: 'Kindergarten One', value: 'lkg'},
  {label: 'Kindergarten Two', value: 'ukg'},
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
const {width} = Dimensions.get('window');

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
  const [checked, setChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hasError = (field: string) => {
    if (!onSubmitClick) {
      return false;
    }

    switch (field) {
      case 'name':
        return !name.trim();
      case 'mobile':
        return !mobile || (mobile.trim().length && mobile.length < 10);
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
      !mobile ||
      !classSelected
    ) {
      return;
    }

    // Encrypt
    const encryptedPwd = CryptoJS.AES.encrypt(pwd, 'issschool').toString();

    param.pwd = encryptedPwd;

    setIsLoading(true);

    http
      .post(
        'https://eci0xf7t0i.execute-api.ap-south-1.amazonaws.com/dev/register',
        param,
      )
      .then(response => response.json())
      .then(async res => {
        // console.log('Data = ', res);
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

  const openTermsModal = () => {
    setIsModalVisible(true);
  };

  return (
    <Provider theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && (
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        )}

        <Modal
          style={styles.modal}
          // transparent
          visible={isModalVisible}
          presentationStyle="overFullScreen"
          onDismiss={() => setIsModalVisible(false)}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Icon
                name="close"
                color={'#000'}
                size={30}
                style={{alignSelf: 'flex-end', marginRight: 5}}
                onPress={() => setIsModalVisible(false)}
              />
              <ScrollView style={{paddingHorizontal: 20, marginBottom: 20}}>
                <Text>{terms.terms.join(' ')}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

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
              style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
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
              style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
              type="error"
              visible={hasError('email')}>
              Email address is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Mobile"
              keyboardType="numeric"
              value={mobile}
              onChangeText={mobile => {
                setOnSubmitClick(false);
                setMobile(mobile);
              }}
              maxLength={10}
            />
            <HelperText
              style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
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
              style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
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
              style={{marginLeft: 10, marginTop: -5, marginBottom: 5}}
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

          <View style={styles.termsWrapper}>
            <Checkbox
              style={styles.checkBox}
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text style={styles.termsText}>I agree to the </Text>
            <Text style={styles.termsTextLink} onPress={() => openTermsModal()}>
              Terms and Conditions.
            </Text>
          </View>

          <View style={{marginHorizontal: 20, marginTop: 10}}>
            <Button
              color="#e9165b"
              title="Register"
              disabled={!checked}
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
    paddingTop: 30,
    height: '100%',
  },
  modal: {
    // width: '80%',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '20%',
    left: '45%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: '80%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 7,
    // paddingVertical: 20,
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
  logo: {
    marginTop: 15,
    width: 130,
    height: 130,
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
  termsWrapper: {
    flexDirection: 'row',
    marginTop: -10,
    marginLeft: 10,
  },
  termsTextLink: {
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 7,
  },
  termsText: {
    color: '#000',
    marginTop: 7,
  },
  checkBox: {
    marginBottom: -10,
  },
});
