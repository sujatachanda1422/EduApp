import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
const pdf_url =
  'https://issschool-scorm.s3.amazonaws.com/worksheets/tracing-letters-f.pdf';

export default function Worklist({navigation, workListData}) {
  const onDownloadClick = item => {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Tracing letters worksheet',
          message: 'storage_permission',
        },
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadFile();
        } else {
          //If permission denied then show alert 'Storage Permission
          ('Not Granted');
          Alert.alert('storage_permission');
        }
      });
    } catch (err) {
      //To handle permission related issue
      console.log('error', err);
    }
  };

  const downloadFile = () => {
    const fileName = 'tracing-letters.pdf';
    const destPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;

    let options = {
      fileCache: true,
      // path: destPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'File downloaded by download manager.',
      },
    };

    RNFetchBlob.config(options)
      .fetch('GET', pdf_url)
      .then(res => {
        // console.log('res -> ', JSON.stringify(res));
        Alert.alert('Worksheet downloaded.');
      })
      .catch(err => {
        Alert.alert('Error.');
        console.log('err -> ', err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          data={workListData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.item}
                onPress={() => onDownloadClick(item)}>
                <View style={{flex: 1}}>
                  <Text style={styles.itemHeader}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <MaterialCommunityIcons
                  name="download"
                  color="#000"
                  size={40}
                />
              </TouchableOpacity>
            );
          }}
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
