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
import {HelperText, Provider, DefaultTheme, Snackbar} from 'react-native-paper';
import {http} from '../services/http';
import DropDown from '../libraries/dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

export default function Profile({route, navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [showClassDropDown, setShowClassDropDown] = useState(false);
  const [role, setRole] = useState('');
  const [classSelected, setClassSelected] = useState('');
  const [onSubmitClick, setOnSubmitClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [showRoleDropDown, setShowRoleDropDown] = useState(false);

  const {emailId, fullName} = route.params;

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    if (emailId) {
      setName(fullName);
      setEmail(emailId);
    } else {
      setUserDetails();
    }
  }, []);

  const setUserDetails = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));
    setName(data.name);
    setEmail(data.email);
    setMobile(data.mobile);
    setRole(data.role);
    setClassSelected(data.class);
  };

  const hasError = (field: string) => {
    if (!onSubmitClick) {
      return false;
    }

    switch (field) {
      case 'name':
        return !name.trim();
      case 'mobile':
        return !mobile || (mobile.trim().length && mobile.length < 10);
      case 'role':
        return !role;
      case 'class':
        return !classSelected;
    }
  };

  const getRoleDetails = newRole => {
    for (let i = 0; i < roleList.length; i++) {
      if (newRole === roleList[i].value) {
        return roleList[i].label;
      }
    }
  };

  const onDropdownChange = (val, type) => {
    setOnSubmitClick(false);

    if (type === 'role') {
      setRole(val);
    } else {
      setClassSelected(val);
    }
  };

  const updateUser = () => {
    setOnSubmitClick(true);

    const param = {
      name,
      email,
      mobile,
      role,
      class: classSelected,
    };

    if (!name || !mobile || !classSelected || !role) {
      return;
    }

    setIsLoading(true);

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/updaterUser',
        param,
      )
      .then(response => response.json())
      .then(async res => {
        console.log('update = ', res);
        setIsLoading(false);

        if (res.status === 200) {
          setVisible(true);

          await AsyncStorage.setItem('userData', JSON.stringify(res.user));

          if (emailId) {
            checkLoginInStore(res.user);
          } else {
            setTimeout(() => {
              navigation.navigate('HomeComp', {
                screen: 'Dashboard',
              });
            }, 500);
          }
        } else if (res.status === 500) {
          Alert.alert('', `User with email ${email} already exists.`);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const checkLoginInStore = (data: any) => {
    console.log('Data = ', data);
    const emailId = data.email;

    http
      .post(
        'https://yymwutqwze.execute-api.us-east-1.amazonaws.com/dev/addLoginHistory',
        {email: emailId},
      )
      .then(response => response.json())
      .then(async res => {
        console.log('setLoginInDB = ', res);

        if (res.status === 200) {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem('userData', jsonValue);

          navigation.navigate('HomeComp', {
            screen: 'Dashboard',
          });
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

  return (
    <Provider theme={theme}>
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

          <View style={{marginTop: 30}}>
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
              editable={false}
              style={[
                styles.inputStyle,
                styles.disabledInput,
                {marginBottom: 30},
              ]}
            />
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
          {!emailId && (
            <View>
              <TextInput
                placeholder="Role"
                value={getRoleDetails(role)}
                editable={false}
                style={[
                  styles.inputStyle,
                  styles.disabledInput,
                  {marginBottom: 30},
                ]}
              />
            </View>
          )}

          {emailId && (
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
          )}
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
            <Button color="#e9165b" title="Save" onPress={() => updateUser()} />
          </View>
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
