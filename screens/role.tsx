import React, {useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {
  Provider,
  TextInput,
  Button,
  Text,
  DefaultTheme,
} from 'react-native-paper';
import DropDown from '../libraries/dropdown';

export default function Role({navigation}) {
  const roleList = [
    {label: 'Student', value: 'Student'},
    {label: 'Teacher', value: 'Teacher'},
    {label: 'Parent', value: 'Parent'},
    {label: 'Admin', value: 'admin'},
  ];
  const schoolList = [
    {label: 'St. Xaviers', value: 'xaviers'},
    {label: 'Delhi Public School', value: 'dps'},
    {label: 'Loreto', value: 'loreto'},
    {label: 'G.D.Birla', value: 'gdb'},
  ];
  const classList = [
    {label: 'Play Group', value: 'play'},
    {label: 'Nursery', value: 'nursery'},
    {label: 'Junior KG', value: 'jkg'},
    {label: 'Senior KD', value: 'skg'},
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

  const [showRoleDropDown, setShowRoleDropDown] = useState(false);
  const [showSchoolDropDown, setShowSchoolDropDown] = useState(false);
  const [showClassDropDown, setShowClassDropDown] = useState(false);
  const [role, setRole] = useState();
  const [school, setSchool] = useState();
  const [classSelected, setClassSelected] = useState();

  const register = () => {
    navigation.navigate('HomeComp', {
      screen: 'Dashboard',
    });
  };

  return (
    <Provider children="" theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.loginText}>
            Tell us more about yourself to customise the product
          </Text>

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
              inputProps={{
                right: <TextInput.Icon name={'menu-down'} />,
              }}
            />
          </View>
          <View style={styles.dropDown}>
            <DropDown
              label={'School'}
              value={school}
              setValue={setSchool}
              activeColor="#000"
              list={schoolList}
              visible={showSchoolDropDown}
              showDropDown={() => setShowSchoolDropDown(true)}
              onDismiss={() => setShowSchoolDropDown(false)}
              inputProps={{
                right: <TextInput.Icon name={'menu-down'} />,
              }}
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
              inputProps={{
                right: <TextInput.Icon name={'menu-down'} />,
              }}
            />
          </View>
          <Button
            color="#2dadb3"
            mode="contained"
            style={{marginTop: 30}}
            onPress={() => register()}>
            Set Role
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    // backgroundColor: '#fff',
    marginHorizontal: 30,
  },
  dropDown: {
    marginBottom: 40,
  },
  loginText: {
    marginBottom: 60,
    color: '#0c50ea',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 'bold'
  },
});
