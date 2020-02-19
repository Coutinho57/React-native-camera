import React, { useState } from 'react';
import { AppRegistry, PermissionsAndroid, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

export function ExampleApp() {
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async (camera) => {
    try {
      if (camera) {
        const options = {
          quality: 0.5,
          base64: true,
          forceUpOrientation: true,
          fixOrientation: true
        };
        const data = await camera.takePictureAsync(options);
        setImageUri(data.uri);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const submitPicture = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          "title": "Access Storage",
          "message": "Access Storage for the pictures"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert(imageUri);
         CameraRoll.saveToCameraRoll(imageUri, "photo");
      } else {
        console.log("Permissao de camera negada.");
      }
    } catch (err) {
      console.warn(err);
    }
  
    setImageUri(null);
  }
    return (
      imageUri ?
      <ImageBackground style={styles.preview} source={{ uri: imageUri }}>
        <ScrollView></ScrollView>
        <View style={styles.buttonsPreview}>
          <Icon name="chevron-right"onPress={() => setImageUri(null)} />
          <Icon name="chevron-left" onPress={() => submitPicture()} /> 
        </View>
      </ImageBackground>
      :
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
}


// const takePicture = async function(camera) {
//   const options = { quality: 0.5, base64: true };
//   const data = await camera.takePictureAsync(options);
//   //  eslint-disable-next-line
//   setImageUri(data.uri);

// };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonsPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000",
    width: "100%",
    height: '6%'
  }
});

const Icon = styled(MDIcon).attrs(({...rest}) => ({
  ...rest,
  size: 30,
}))`
  color: #fff;
`;
