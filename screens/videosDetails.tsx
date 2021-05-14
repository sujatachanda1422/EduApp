import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';

const url = 'https://issschool.com';

export default function VideoDetails({route, navigation}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const {videoDetails} = route.params;

  const onEnterFullscreen = () => {
    setIsFullScreen(true);
  };

  const onExitFullscreen = () => {
    setIsFullScreen(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View>
            <Text style={{fontSize: 22, color: '#fff'}}>
              {videoDetails.name}
            </Text>
          </View>
        );
      },
    });
  }, []);

  const OpenURLButton = ({url, children}) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View
          style={[styles.videoWrapper, isFullScreen ? styles.fullscreen : {}]}>
          <VideoPlayer
            source={{uri: videoDetails.link}}
            tapAnywhereToPause={true}
            navigator={navigation}
            onEnterFullscreen={onEnterFullscreen}
            onExitFullscreen={onExitFullscreen}
          />
        </View>
        {!isFullScreen && (
          <View>
            <Text style={styles.videoDesc}>{videoDetails.name}</Text>
            <OpenURLButton url={url}>Open Issschool to buy kit</OpenURLButton>
          </View>
        )}
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
  },
  wrapper: {
    flex: 1,
  },
  videoWrapper: {
    height: 500,
  },
  fullscreen: {
    height: '100%',
  },
  videoDesc: {
    fontSize: 28,
    margin: 20,
  },
  text: {
    fontSize: 22,
    margin: 20,
    color: '#e9165b',
    textDecorationLine: 'underline'
  },
});
