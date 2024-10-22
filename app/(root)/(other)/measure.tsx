import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Accelerometer } from 'expo-sensors';
import * as DeviceBrightness from 'expo-brightness';

export default function measure() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediapermission, mediarequestPermission] = MediaLibrary.usePermissions();
  const [brightness, setBrightness] = useState(1);
  const [lightWarning, setLightWarning] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [mode, setMode] = useState<'measure' | 'level'>('measure');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
 const [photoUri, setPhotoUri] = useState<string | null>(null); // This line was added to store captured photo
  // Set up accelerometer for "Level" mode

  // Check brightness level to display the "More light required" warning
  useEffect(() => {
    const checkBrightness = async () => {
      const deviceBrightness = await DeviceBrightness.getBrightnessAsync();
      setBrightness(deviceBrightness);
      setLightWarning(deviceBrightness < 0.2); // Show warning if brightness is too low
    };
    checkBrightness();
  }, []);

  // Request camera and media library permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await requestPermission();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();

      if (cameraStatus.status !== 'granted') {
        alert('Camera permission is needed to use this feature!');
      }
      if (mediaStatus.status !== 'granted') {
        alert('Media library permission is needed to save photos!');
      }
    };

    requestPermissions();
  }, []);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'measure' ? 'level' : 'measure'));
  };

  // Capture Image Function
  const takePicture = async () => {
    if (cameraRef.current) {
     const photo:any = await cameraRef.current.takePictureAsync(); // This line was added to take the picture
      setPhotoUri(photo.uri); // This line was added to store the photo URI
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      Alert.alert('Image Captured', 'Now measure the height and width of the object.');

      // Prompt for dimensions
      promptForDimensions();
    }
  };

  // Prompt for Dimensions
  const promptForDimensions = () => {
    // Replace this with a modal or input prompt
    // For demonstration, using hardcoded values; you can replace this with actual user input
    const exampleHeight = 20; // Replace with user input or calculated value
    const exampleWidth = 10; // Replace with user input or calculated value
    setHeight(exampleHeight);
    setWidth(exampleWidth);
  };

  // Handle permissions not granted
  if (!permission || !mediapermission) {
    return <Text>Loading permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Camera Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!mediapermission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>We need your permission to save to your gallery</Text>
        <TouchableOpacity onPress={mediarequestPermission}>
          <Text>Grant Media Library Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        <CameraView className="absolute top-0 left-0 right-0 bottom-0" ref={cameraRef} facing={facing} />

        {/* Light Warning */}
        {lightWarning && (
          <View className="absolute top-12 self-center bg-black/70 px-3 py-2 rounded-lg">
            <Text className="text-white">More light required</Text>
          </View>
        )}

        {/* Camera Buttons */}
        <View className="absolute bottom-10 w-full flex-row justify-around items-center">
          <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <FontAwesome name="rotate-left" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture}>
            <FontAwesome name="camera" size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode}>
            <FontAwesome name='tag' size={30} color="white" />
            <Text className="text-white mt-1 text-center">{mode === 'measure' ? 'Measure' : 'Level'}</Text>
          </TouchableOpacity>
        </View>

        {/* Measurement Info */}
        {mode === 'measure' && capturedImage && (
          <View className="absolute top-24 self-center">
            <Text className="text-white text-2xl">Captured Image:</Text>
            <Image source={{ uri: capturedImage }} style={{ width: 100, height: 100 }} />
            <Text className="text-white text-2xl">Height: {height} cm</Text>
            <Text className="text-white text-2xl">Width: {width} cm</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}