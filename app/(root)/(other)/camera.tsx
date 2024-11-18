import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { savePhotoToBucket } from '@/lib/appwrite';


export default function camera(){

  const { siteName, constructId } = useLocalSearchParams();

  const siteNameString = Array.isArray(siteName) ? siteName[0] : siteName ?? '';
  const constructIdString = Array.isArray(constructId) ? constructId[0] : constructId ?? '';

  const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));
  

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null); // This line was added for camera reference
  const [photoUri, setPhotoUri] = useState<string | null>(null); // This line was added to store captured photo



  const bucketId = `${siteNameString.toLowerCase().replace(/\s+/g, '')}-${constructIdString}`.slice(0, 36);


  if (!permission) {
    // Camera permissions are still loading.
    return console.log("camera still loading");
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



  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function goBack() {
    router.back()
  }

  
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Capture the photo
        const photo: any = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);


        // Save to Appwrite bucket
        const photourl = await savePhotoToBucket(bucketId, constructIdString, siteNameString, photo.uri);

        await delay(500)

        router.replace({
        pathname: '/(root)/(other)/inspection',
        params: {
          siteName: siteNameString,
          constructId: constructIdString,
          photourl, // Pass the photo URL
        },
      });


      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to save the photo.');
      }
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