import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
// const image = require("../images/login.jpg");

export default function WorklistDetails({navigation}) {
  const register = () => {};

  const onSubjectClick = () => {
    navigation.navigate('HomeComp', {
      screen: 'Login',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <WebView
          // style={{flex: 1}}
          originWhitelist={['*']}
          source={{
            uri: 'file:///android_asset/AlphabetWriting/story_html5.html',
          }}
          style={{flex: 1.0}}
          javaScriptEnabled={true}
          javaScriptCanOpenWindowsAutomatically={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          mediaPlaybackRequiresUserAction={false}
          androidLayerType={'hardware'} 
          mixedContentMode='always'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#d6e2e8',
  },
  wrapper: {
    flex: 1,
    // margin: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  item: {
    height: 120,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 15,
    elevation: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeader: {
    color: 'violet',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 18,
    color: '#000',
    marginTop: 20,
  },
  itemDate: {
    color: 'violet',
    fontWeight: 'bold',
  },
});
