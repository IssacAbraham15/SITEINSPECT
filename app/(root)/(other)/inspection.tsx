import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addInspectionData, getInspectionDataByDate } from '@/lib/appwrite';
import { Picker } from '@react-native-picker/picker'

const Inspection = () => {
  const { siteName, constructId, photourl } = useLocalSearchParams();
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [progress, setProgress] = useState('0');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [photoNotFound, setPhotoNotFound] = useState(false);
  const [checklistIndex, setChecklistIndex] = useState(0);
  const checklistItems = ["Foundation Check", "Pillar Inspection", "Roof Assessment"]; // Sample checklist items

  
  const siteNameString = Array.isArray(siteName) ? siteName[0] : siteName ?? '';
  const constructIdString = Array.isArray(constructId) ? constructId[0] : constructId ?? '';

  const photourlString = Array.isArray(photourl) ? photourl[0] : photourl ?? '';

    const fetchImageForCurrentDate = async () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const currentDatestring = currentDate.toString()// Get current date in YYYY-MM-DD format
    try {
      const inspectionData = await getInspectionDataByDate(siteNameString, constructIdString, currentDatestring);
      if (inspectionData && inspectionData.image) {
        setImageUri(inspectionData.image);
        setPhotoNotFound(false);
      } else {
        setPhotoNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching inspection data:", error);
      setPhotoNotFound(true);
    }
  };

  useEffect(() => {
    if (photourlString) {
      setImageUri(photourlString);
      console.log(photourlString) // Set the imageUri to the photourl from the camera screen
    } else {
      fetchImageForCurrentDate(); // Fallback to fetching the image from the database
    }
  }, [photourlString]);
  


  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  const goToReview = (constructId: string, siteName: string) => {
    router.replace({
        pathname: '/(root)/(other)/review',
        params: { constructId, siteName },
    });
  };

  const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAddInspection = async () => {
    const inspectionData = {
      ID: constructIdString,
      Height: parseFloat(height),
      Width: parseFloat(width),
      inspectionDate: new Date().toISOString(), // Current date in ISO 8601 format
      Notes: notes,
      Image: imageUri || null,
      Progress: parseInt(progress,10),
    };

    try {
      const response = await addInspectionData(siteNameString, constructIdString, inspectionData);
      if (response) {
        console.log("Inspection data added successfully:", response);
        alert("Inspection data saved!");
        await delay(1000);
        goToReview(constructIdString,siteNameString)
      }
    } catch (error) {
      console.error("Error adding inspection data:", error);
    }
  };

  const currentDate = formatDate(new Date());

  const goBack = () => {
    router.back();
  };

  function goToCamera(siteName: string,constructId: string){
    router.push({
            pathname: "/(root)/(other)/camera",
            params: {siteName,constructId},
        });
  };

  const handleNext = () => {
    setChecklistIndex((prevIndex) => (prevIndex + 1) % checklistItems.length);
  };

  const handlePrevious = () => {
    setChecklistIndex((prevIndex) => (prevIndex - 1 + checklistItems.length) % checklistItems.length);
  };

  return (
    <SafeAreaView className="flex p-6 bg-white">
      <ScrollView className="">
        {/* Header Section with Date */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-md">
          <TouchableOpacity onPress={goBack}>
            <FontAwesome name="arrow-left" size={24} color="#800000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-700">{currentDate}</Text>
          <TouchableOpacity>
            <FontAwesome name="caret-down" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-3">


          {/* Photo Section */}
        <View className="mt-6 p-4 flex-row justify-between">
        <View className="w-1/2 items-center justify-center border-2 border-[#800000] p-1 rounded-lg" style={{ width: 150, height: 150 }}>
          <TouchableOpacity 
            className="justify-center items-center w-full h-full"
          >
             {imageUri ? ( // Check if the image from the database exists
        <Image
            source={{ uri: imageUri }}
            className="w-full h-full rounded-lg border-2 border-[#800000]"
            style={{ resizeMode: 'cover' }}
          />
        ) : ( // Default "Photo Not Taken" UI
          <>
            <FontAwesome name="camera" size={50} color="#800000" />
            <Text className="text-[#800000] mt-2">Photo Not Taken</Text>
          </>
        )}
          </TouchableOpacity>
        </View>
        <Image 
          source={require('@/assets/images/sample-floor-plan.png')} 
          className="w-1/2 h-40 rounded-lg" 
          style={{ resizeMode: 'contain' }} 
        />
      </View>

          {/* Add Information Section */}
          <View className="mt-6 px-2">
            <Text className="text-lg font-bold text-[#800000] mb-2">Add Information</Text>

            {/* ID and Progress */}
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">ID:</Text>
                <TextInput 
                  value={constructIdString}
                  editable={false}
                  className="border border-gray-300 rounded p-2 text-gray-700"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Progress (%):</Text>
                <TouchableOpacity onPress={() => setShowPicker(!showPicker)} className="border border-gray-300 rounded p-2">
                  <Text className="text-gray-700">{progress}%</Text>
                </TouchableOpacity>
                {showPicker && (
                  <Picker
                    
                    selectedValue={progress}
                    onValueChange={(itemValue) => {
                      setProgress(itemValue);
                      console.log(itemValue)
                      setShowPicker(false); // Hide the picker after selection
                    }}
                    style={{ height: 200, width: 150 }} // Adjust style for size
                  >
                    {[...Array(11)].map((_, i) => (
                      <Picker.Item key={i} label={`${i * 10}%`} value={i * 10} color='black' />
                    ))}
                  </Picker>
                )}
              </View>
            </View>

            {/* Height and Width */}
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Height:</Text>
                <TextInput
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Width:</Text>
                <TextInput
                  keyboardType="numeric"
                  value={width}
                  onChangeText={setWidth}
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </View>
            </View>
          </View>

          {/* Checklist Section */}
          <View className="mt-6 px-2">
            <Text className="text-lg font-bold text-[#800000] mb-2">Checklist</Text>
            <View className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3">
              <TouchableOpacity onPress={handlePrevious} className="p-2">
                <FontAwesome name="chevron-left" size={20} color="#800000" />
              </TouchableOpacity>
              <Text className="text-gray-700">{checklistItems[checklistIndex]}</Text>
              <TouchableOpacity onPress={handleNext} className="p-2">
                <FontAwesome name="chevron-right" size={20} color="#800000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes Section */}
          <View className="mt-6 px-2">
            <Text className="text-lg font-bold text-[#800000] mb-2">Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              className="border border-gray-300 rounded px-4 py-2"
              multiline
            />
          </View>

          {/* Action Buttons Section */}
          <View className="mt-6 flex-row justify-between px-2">
            <TouchableOpacity onPress={()=>goToCamera(siteNameString,constructIdString)} className="flex-1 bg-white border border-[#800000] p-4 rounded-lg mr-2 items-center">
              <FontAwesome name="camera" size={24} color="#800000" />
              <Text className="text-[#800000] mt-2">Take Photo</Text>
            </TouchableOpacity>

          </View>

          {/* Done Button */}
          <TouchableOpacity onPress={handleAddInspection} className="bg-[#800000] p-4 rounded-full mt-6 mx-2">
            <Text className="text-white text-center font-bold text-lg">Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inspection;
