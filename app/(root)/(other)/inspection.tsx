import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const Inspection = () => {
  const [checklistIndex, setChecklistIndex] = useState(0);
  const checklistItems = ["Foundation Check", "Pillar Inspection", "Roof Assessment"]; // Sample checklist items

  const goBack = () => {
    router.back();
  };

  const goToCamera = () => {
    router.push('/(root)/(other)/camera');
  };

  const goToMeasure = () => {
    router.push('/(root)/(other)/measure');
  };

  const handleNext = () => {
    setChecklistIndex((prevIndex) => (prevIndex + 1) % checklistItems.length);
  };

  const handlePrevious = () => {
    setChecklistIndex((prevIndex) => (prevIndex - 1 + checklistItems.length) % checklistItems.length);
  };

  return (
    <SafeAreaView className="flex p-6 bg-gray-50">
      <ScrollView className="">
        {/* Header Section with Date */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-md">
          <TouchableOpacity onPress={goBack}>
            <FontAwesome name="arrow-left" size={24} color="#800000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-700">MAR 22, 2024</Text>
          <TouchableOpacity>
            <FontAwesome name="caret-down" size={24} color="#800000" />
          </TouchableOpacity>
        </View>

        <View className="px-3">
          {/* Photo Section */}
          <View className="mt-6 flex-row justify-between">
            <Image 
              source={require('@/assets/images/costruct1.png')} 
              className="w-1/2 h-40 rounded-lg border-2 border-[#800000]" 
              style={{ resizeMode: 'contain' }} 
            />
            <Image 
              source={require('@/assets/images/sample-floor-plan.png')} 
              className="w-1/2 h-40 rounded-lg border-2 border-[#800000]" 
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
                  value="C1"
                  editable={false}
                  className="border border-gray-300 rounded p-2 text-gray-700"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Progress:</Text>
                <View className="border border-gray-300 rounded">
                  <TextInput 
                    value="50%" 
                    editable={true}
                    className="text-center text-gray-700 py-2"
                  />
                </View>
              </View>
            </View>

            {/* Height and Width */}
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Height (CM):</Text>
                <TextInput 
                  value="300"
                  className="border border-gray-300 rounded p-2"
                  keyboardType="numeric"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Width (CM):</Text>
                <TextInput 
                  placeholder="Enter width"
                  className="border border-gray-300 rounded p-2"
                  keyboardType="numeric"
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
              className="border border-gray-300 rounded p-4"
              placeholder="Enter notes here..."
              multiline
            />
          </View>

          {/* Action Buttons Section */}
          <View className="mt-6 flex-row justify-between px-2">
            <TouchableOpacity onPress={goToCamera} className="flex-1 bg-white border border-[#800000] p-4 rounded-lg mr-2 items-center">
              <FontAwesome name="camera" size={24} color="#800000" />
              <Text className="text-[#800000] mt-2">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToMeasure} className="flex-1 bg-white border border-[#800000] p-4 rounded-lg ml-2 items-center">
              <FontAwesome name="ruler" size={24} color="#800000" />
              <Text className="text-[#800000] mt-2">Measure</Text>
            </TouchableOpacity>
          </View>

          {/* Done Button */}
          <TouchableOpacity className="bg-[#800000] p-4 rounded-full mt-6 mx-2">
            <Text className="text-white text-center font-bold text-lg">Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inspection;
