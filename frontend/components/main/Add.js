import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'

export default function Add({navigation}) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (Platform.OS !== 'web') {
        const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(galleryStatus)
        //if (galleryStatus !== 'granted') {
        //  alert('Sorry, we need camera roll permissions to make this work!');
        //}
        setHasGalleryPermission(galleryStatus === 'granted');
      }
    })();
  }, []);

  const takePicture = async() => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      console.log(data.uri) //temp file of the taken picture
      setImage(data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  //if (hasPermission === false || hasGalleryPermission === false) {
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex:1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
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
      <Button
        title="Pick Image"
        onPress={() =>{
          pickImage()
        }}>
      </Button>
      <Button
        title="Save Image"
        onPress={() =>{
          navigation.navigate("Save", {image})
        }} />
      {image && <Image source={{uri: image}} style={{flex:1 }}/>}
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
