import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';

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
            <Text style={{fontSize: 22, color: '#fff'}}>{videoDetails. name}</Text>
          </View>
        );
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View
          style={[
            styles.videoWrapper,
            isFullScreen ? styles.fullscreen : {}
          ]}>
          <VideoPlayer
            source={{uri: videoDetails.link}}
            tapAnywhereToPause={true}
            navigator={navigation}
            onEnterFullscreen={onEnterFullscreen}
            onExitFullscreen={onExitFullscreen}
          />
        </View>
        {!isFullScreen && <Text style={styles.videoDesc}>{videoDetails.name}</Text>}
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
    height: '100%'
  },
  videoDesc: {
    fontSize: 24,
    margin: 20
  },
});
