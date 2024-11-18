import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { getLatestInspectionData, getAllInspectionDates, getInspectionDataByDate } from '@/lib/appwrite';
import { icons } from '@/constants';

interface InspectionData {
  id: string;
  height: number;
  width: number;
  date: string;
  progress: number;
  notes: string;
  image: string | null;
}


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Review() {
  const { constructId, siteName } = useLocalSearchParams();
  const siteNameString = Array.isArray(siteName) ? siteName[0] : siteName ?? '';
  const constructIdString = Array.isArray(constructId) ? constructId[0] : constructId ?? '';

  const [latestInspection, setLatestInspection] = useState<InspectionData | null>(null);
  const [secondLatestInspection, setSecondLatestInspection] = useState<InspectionData | null>(null);
  const [inspectionDates, setInspectionDates] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchInspectionData = async () => {
      if (constructIdString && siteNameString) {
        try {
          const { latest, secondLatest } = await getLatestInspectionData(siteNameString, constructIdString);
          setLatestInspection(latest);
          setSecondLatestInspection(secondLatest || null);

          // Fetch all inspection dates for the construct
          const dates = await getAllInspectionDates(siteNameString, constructIdString);
          setInspectionDates(dates);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchInspectionData();
  }, [constructIdString, siteNameString]);

  const handleDateSelection = async (date: string) => {
  setIsModalVisible(false);
  console.log(date)
  try {
    // Fetch the latest inspection data for the selected date
    const inspectionData = await getInspectionDataByDate(siteNameString, constructIdString, date);
    
    // Check if inspectionData is not null
    if (inspectionData) {
      setLatestInspection(inspectionData); // Set latest inspection if data is available
    } else {
      console.warn('No inspection data found for the selected date.');
      // Optionally handle the case where there is no data for the selected date
    }
  } catch (error) {
    console.error('Error fetching inspection data for selected date:', error);
  }
};

  return (
    <SafeAreaView className="flex-1 p-6 bg-white">
      {/* Header Section with Date */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="items-center justify-center">
          <FontAwesome name="arrow-left" size={24} color="#800000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">
          {latestInspection ? formatDate(latestInspection.date) : "Date not available"}
        </Text>
        <TouchableOpacity onPress={() =>setIsModalVisible(true)}>
          <FontAwesome name="caret-down" size={24} color="#800000" />
        </TouchableOpacity>
      </View>

      {/* Modal for Date Selection */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white w-3/4 rounded-lg p-4">
            <Text className="text-lg font-bold text-center mb-4">Select Inspection Date</Text>
            <FlatList
              data={inspectionDates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleDateSelection(item)}
                  className="p-2 border-b border-gray-200"
                >
                  <Text className="text-gray-700 text-center">{formatDate(item)}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="mt-4 p-2 bg-[#800000] rounded-full">
              <Text className="text-center text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Photo Section */}
      <View className="mt-6 p-4 flex-row justify-between">
        <View className="w-1/2 items-center justify-center border-2 border-[#800000] p-1 rounded-lg" style={{ width: 150, height: 150 }}>
          <TouchableOpacity 
            onPress={() =>
            router.push({
              pathname: '/comparephotos',
              params: {
                currentPhoto: latestInspection?.image,
                previousPhoto: secondLatestInspection?.image,
                previousPhotoDate: secondLatestInspection?.date, // Pass the date for the previous photo
                constructId: constructIdString,
                siteName: siteNameString,
              },
            })} 
            className="justify-center items-center w-full h-full"
          >
            {latestInspection?.image ? (
              <Image 
                source={{ uri: latestInspection.image }} 
                className="w-full h-full rounded-lg" 
                style={{ resizeMode: 'cover' }} // Ensures the image covers the entire box
              />
            ) : (
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

      {/* Description Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold text-[#800000] mb-4">Description</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">ID: <Text className="font-medium color-gray-700">{constructIdString || "N/A"}</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Height: <Text className="font-medium color-gray-700">{latestInspection?.height || "N/A"} cm</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Width: <Text className="font-medium color-gray-700">{latestInspection?.width || "N/A"} cm</Text></Text>
          </View>
          <View>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Last Inspection: <Text className="font-medium color-gray-700">{secondLatestInspection?.date ? formatDate(secondLatestInspection.date) : "N/A"}</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Progress: <Text className="font-medium color-gray-700">{latestInspection?.progress || "N/A"}%</Text></Text>
          </View>
        </View>
      </View>

      <View className="mt-6 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push({
              pathname: '/(root)/(other)/radar',
              params: {
                constructId: constructIdString,
                siteName: siteNameString,
            },
          })} className="bg-[#800000] px-10 py-4 rounded-full items-center justify-center m-auto">
            <Text className="text-white font-bold">LOCATE</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Notes Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold text-[#800000] mb-0">Notes</Text>
        <Text className="border border-gray-300 rounded py-2 text-gray-700">{latestInspection?.notes || "..."}</Text>
      </View>

      {/* Inspect Button */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/(root)/(other)/inspection',
            params: {
              constructId: constructIdString,
              siteName: siteNameString,
            },
          })
        }
        className="bg-[#800000] p-3 rounded-full mt-10 mx-20"
      >
        <Text className="text-white text-center font-bold text-lg">INSPECT</Text>
      </TouchableOpacity>

      <View className='items-center justify-center'>
        <TouchableOpacity onPress={()=>router.replace("/(root)/(tabs)/ongoingsites")}>
        <View className='bg-primary-101 mt-12 p-4 rounded-full'>
        <Image source={icons.home} tintColor="white"
        resizeMode="contain"
        className="w-8 h-8"/>
        </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
