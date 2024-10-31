import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { getLatestInspectionData } from '@/lib/appwrite'; // Assume this function fetches the latest two documents

interface InspectionData {
  id: string;
  height: number;
  width: number;
  date: string;
  progress: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
};

export default function Review() {
  const { constructId, siteName } = useLocalSearchParams();
  const siteNameString = Array.isArray(siteName) ? siteName[0] : siteName; // Ensures siteName is a string
  const [latestInspection, setLatestInspection] = useState<InspectionData | null>(null);
  const [secondLatestInspectionDate, setSecondLatestInspectionDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchInspectionData = async () => {
      if (constructId && siteNameString) {
        try {
          // Fetch the latest and second-latest inspection records
          const { latest, secondLatest } = await getLatestInspectionData(siteNameString, constructId as string);
          setLatestInspection(latest);
          setSecondLatestInspectionDate(secondLatest?.date || null);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchInspectionData();
  }, [constructId, siteNameString]);


  return (
    <SafeAreaView className="flex-1 p-6 bg-white">
      {/* Header Section with Date */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="items-center justify-center">
          <FontAwesome name="arrow-left" size={24} color="#800000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-700">{latestInspection ? formatDate(latestInspection.date) : "Date not available"}</Text>
        <TouchableOpacity>
          <FontAwesome name="caret-down" size={24} color="#800000" />
        </TouchableOpacity>
      </View>

      {/* Photo Section */}
      <View className="mt-6 p-4 flex-row justify-between">
        <View className="w-1/2 items-center justify-center border-2 border-[#800000] p-4 rounded-lg">
          <TouchableOpacity onPress={() => router.push('/(root)/(other)/comparephotos')} className="justify-center items-center">
            <FontAwesome name="camera" size={50} color="#800000" />
            <Text className="text-[#800000] mt-2">Photo Not Taken</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('@/assets/images/sample-floor-plan.png')} className="w-1/2 h-40 rounded-lg" style={{ resizeMode: 'contain' }} />
      </View>

      {/* Description Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold text-[#800000] mb-4">Description</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">ID: <Text className="font-medium color-gray-700">{constructId || "N/A"}</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Height: <Text className="font-medium color-gray-700">{latestInspection?.height || "N/A"} cm</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Width: <Text className="font-medium color-gray-700">{latestInspection?.width || "N/A"} cm</Text></Text>
          </View>
          <View>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Last Inspection: <Text className="font-medium color-gray-700">{secondLatestInspectionDate ? formatDate(secondLatestInspectionDate) : "N/A"}</Text></Text>
            <Text className="text-gray-700 font-bold color-primary-101 mb-1">Progress: <Text className="font-medium color-gray-700">{latestInspection?.progress || "N/A"}%</Text></Text>
          </View>
        </View>
      </View>

      {/* Tags and Notes Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold text-[#800000] mb-2">Tags</Text>
        <View className="flex-row items-center">
          <Text className="bg-gray-200 px-4 py-2 rounded-full text-gray-700 mr-2">Foundation</Text>
          <Text className="bg-gray-200 px-4 py-2 rounded-full text-gray-700 mr-2">Pillar</Text>
          <TouchableOpacity onPress={() => router.push('/(other)/radar')} className="bg-[#800000] px-6 py-2 rounded-full items-center justify-center m-auto">
            <Text className="text-white font-medium">Locate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notes Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-bold text-[#800000] mb-0">Notes</Text>
        <Text className="border border-gray-300 rounded p-2 text-gray-700">...</Text>
      </View>

      {/* Inspect Button */}
      <TouchableOpacity onPress={() => router.push('/(root)/(other)/inspection')} className="bg-[#800000] p-3 rounded-full mt-20 mx-20">
        <Text className="text-white text-center font-bold text-lg">INSPECT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
