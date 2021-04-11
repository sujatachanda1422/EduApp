import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  TextInput,
  Image
} from 'react-native';

import {HelperText, Provider, DefaultTheme} from 'react-native-paper';
import {http} from '../services/http';
import DropDown from '../libraries/dropdown';

const logo = require('../images/bee.png');
const roleList = [
  {label: 'Student', value: 'Student'},
  {label: 'Teacher', value: 'Teacher'},
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
  const [confirmPwd, setconfirmPwd] = useState('');
  const [showRoleDropDown, setShowRoleDropDown] = useState(false);
  const [showClassDropDown, setShowClassDropDown] = useState(false);
  const [role, setRole] = useState();
  const [classSelected, setClassSelected] = useState();

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
      .then(response => response.json())
      .then(res => {
        console.log('Data = ', res);
        navigation.navigate('HomeComp', {
          // screen: 'Role',
          screen: 'Dashboard',
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Provider children="" theme={theme}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Fullname"
              value={name}
              onChangeText={name => setName(name)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Please enter fullname
            </HelperText>
          </View>
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              style={styles.inputStyle}
              onChangeText={email => setEmail(email)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Email address is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Mobile (Optional)"
              keyboardType="numeric"
              value={mobile}
              onChangeText={mobile => setMobile(mobile)}
              maxLength={10}
            />
            <HelperText type="error" visible={hasErrors()}>
              Mobile number is invalid!
            </HelperText>
          </View>
          <View>
            <TextInput
              style={styles.inputStyle}
              placeholder="Password"
              secureTextEntry={true}
              value={pwd}
              onChangeText={pwd => setPwd(pwd)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Please eneter password
            </HelperText>
            <TextInput
              style={styles.inputStyle}
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={confirmPwd}
              onChangeText={confirmPwd => setconfirmPwd(confirmPwd)}
            />
            <HelperText type="error" visible={hasErrors()}>
              Password does not match
            </HelperText>
          </View>
          <View style={styles.dropDown}>
            <DropDown
              label={'Role'}
              value={role}
              setValue={setRole}
              activeColor="#000"
              list={roleList}
              visible={showRoleDropDown}
              showDropDown={() => setShowRoleDropDown(true)}
              onDismiss={() => setShowRoleDropDown(false)}
            />
          </View>
          <View style={styles.dropDown}>
            <DropDown
              label={'Class'}
              value={classSelected}
              setValue={setClassSelected}
              activeColor="#000"
              list={classList}
              visible={showClassDropDown}
              showDropDown={() => setShowClassDropDown(true)}
              onDismiss={() => setShowClassDropDown(false)}
            />
          </View>

          <View style={{marginHorizontal: 20}}>
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
    color: '#fff',
    padding: 10,
    alignSelf: 'center',
    backgroundColor: '#ade0f2',
    borderRadius: 2,
    height: 46,
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
    marginBottom: 25,
    marginHorizontal: 20,
  },
  logo: {
    marginTop: 30,
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});
