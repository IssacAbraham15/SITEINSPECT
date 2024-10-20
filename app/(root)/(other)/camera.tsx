import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';


export default function camera(){
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null); // This line was added for camera reference
  const [photoUri, setPhotoUri] = useState<string | null>(null); // This line was added to store captured photo
  const [mediapermission, mediarequestPermission] = MediaLibrary.usePermissions();


  if (!permission) {
    // Camera permissions are still loading.
    return console.log("Wait bitch, camera still loading");
  }
  if (!mediapermission) {
    // Camera permissions are still loading.
    return console.log("Wait bitch, gallery still loading");
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
        <Text> title="grant permission" </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )}

   if (!mediapermission?.granted) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>We need your permission to save to your gallery</Text>
        <TouchableOpacity onPress={mediarequestPermission}>
          <Text>Grant Media Library Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function goBack() {
    router.back()
  }

  const takePhoto = async () => { // This function was added for capturing the photo
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // This line was added to take the picture
      setPhotoUri(photo.uri); // This line was added to store the photo URI
      const asset = await MediaLibrary.createAssetAsync(photo.uri); // This line saves the photo to the gallery
      console.log('Bitch check you gallery', asset.uri);
    }
  };

  return (
   <SafeAreaView className='flex-1 bg-black'>
    <View className='flex-1'>
      <CameraView className='absolute top-0 left-0 right-0 bottom-0' ref={cameraRef} facing={facing}>
      </CameraView>
      <TouchableOpacity className='left-4 mt-4' onPress={goBack}>
          <FontAwesome name="arrow-left" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
          className='absolute bottom-10 w-full items-center'
          onPress={takePhoto} // This line was added to trigger the photo capture
        >
          <FontAwesome name="camera" size={50} color="white" />
        </TouchableOpacity>
    </View>
    {photoUri && ( // This block was added to display the photo after capture
        <View className='absolute bottom-0 w-full bg-black items-center'>
          <Text className='text-white'>Photo captured!</Text>
        </View>
      )}
    </SafeAreaView>
  )
}