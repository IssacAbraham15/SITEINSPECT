import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'; // For saving extracted files
import JSZip from 'jszip'; // JavaScript library for handling ZIP files
import { useLocalSearchParams, router } from 'expo-router';

const ComparePhotos = () => {
  const { currentPhoto, previousPhoto } = useLocalSearchParams();
  const prevphotoString = Array.isArray(previousPhoto) ? previousPhoto[0] : previousPhoto ?? '';
  const currentPhotoString = Array.isArray(currentPhoto) ? currentPhoto[0] : currentPhoto ?? '';

  const [processedImage, setProcessedImage] = useState<string | null>(null); // Path for the processed image
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message for processing errors

  const processPhotos = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!currentPhoto) {
      setErrorMessage("No current photo available.");
      setLoading(false);
      return;
    }

    // If there's no previous photo, directly display the current photo without processing
    if (!previousPhoto) {
      setProcessedImage(currentPhotoString); // Display the current photo directly
      setErrorMessage("No previous photo to compare.");
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('currentPhoto', {
        uri: currentPhoto,
        name: 'currentPhoto.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('previousPhoto', {
        uri: previousPhoto,
        name: 'previousPhoto.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch('http://192.168.0.138:5000/compare-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const zipBlob = await response.blob(); // Get the zip file as a blob

        // Convert Blob to ArrayBuffer using FileReader
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(zipBlob);
        });

        const jszip = new JSZip();
        const zip = await jszip.loadAsync(arrayBuffer); // Load the zip file

        // Extract processed image from the zip
        const processedImageBase64 = await zip.file('processed_current.jpg')?.async('base64');

        if (processedImageBase64) {
          const processedImagePath = `${FileSystem.cacheDirectory}processed_current.jpg`;

          // Save the processed file to the cache directory
          await FileSystem.writeAsStringAsync(processedImagePath, processedImageBase64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Update state with the file path
          setProcessedImage(processedImagePath);
        }
      } else {
        const errorText = await response.text();
        console.error('Error processing photos:', errorText);
        setErrorMessage("Failed to process photos. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("An error occurred while processing the photos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processPhotos();
  }, [currentPhoto, previousPhoto]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-md">
        <TouchableOpacity className="justify-center" onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#800000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary-101">Compare Photos</Text>
        <TouchableOpacity></TouchableOpacity>
      </View>

      {/* Processed and Previous Images */}
      <View className="flex-1 items-center justify-center space-y-4">
        {loading ? (
          <ActivityIndicator size="large" color="#800000" />
        ) : (
          <>
            {processedImage ? (
              <View className="items-center">
                <Text className="text-gray-700 font-bold mb-2">Current Image</Text>
                <Image
                  source={{ uri: processedImage }}
                  style={{
                    width: 250,
                    height: 250,
                    resizeMode: 'cover',
                    borderColor: '#800000',
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                />
              </View>
            ) : (
              <Text className="text-gray-500 text-center">No processed photo available.</Text>
            )}

            {previousPhoto && (
              <View className="items-center">
                <Text className="text-gray-700 font-bold mb-2">Previous Image</Text>
                <Image
                  source={{ uri: prevphotoString }}
                  style={{
                    width: 250,
                    height: 250,
                    resizeMode: 'cover',
                    borderColor: '#800000',
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                />
              </View>
            )}

            {!previousPhoto && !loading && (
              <Text className="text-gray-500 text-center">No previous photo to compare.</Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ComparePhotos;
