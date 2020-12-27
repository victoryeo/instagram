import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function Add() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async() => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      console.log(data.uri) //temp file of the taken picture
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex:1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={style.fixedRatio}
          type={type}
          ratio={'1:1'} />
      </View>

      <Button
        style={{
          flex: 0.1,
          alignSelf: 'flex-end',
          alignItems: 'center'
        }}
        title="FlipImage"
        onPress={() => {
          setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button
        title="Take Picture"
        onPress={() =>{
          takePicture()
        }}>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
})
