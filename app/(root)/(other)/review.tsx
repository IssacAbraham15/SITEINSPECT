
import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';

export default function review(){
    function goToRadar() {
    router.push('/(other)/radar')
  }

    const goToCompare=()=>{
        router.push("/(root)/(other)/comparephotos")
    }

    const goBack=()=>{
        router.back()
    }

    const goToInpect=()=>{
        router.push('/(root)/(other)/inspection')
    }
  return (

        <SafeAreaView className="flex-1 p-6 bg-white">
        {/* Header Section with Date */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm">
            <TouchableOpacity className='items-center justify-center' onPress={goBack}>
            <FontAwesome name="arrow-left" size={24} color="#800000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-700">MAR 22, 2024</Text>
            <TouchableOpacity>
            <FontAwesome name="caret-down" size={24} color="#800000" />
            </TouchableOpacity>
        </View>

        {/* Photo Section */}
        <View className="mt-6 p-4 flex-row justify-between">
            
            <View className="w-1/2 items-center justify-center border-2 border-[#800000] p-4 rounded-lg">
                <TouchableOpacity onPress={goToCompare} className='justify-center items-center'>
                <FontAwesome name="camera" size={50} color="#800000" />
                <Text className="text-[#800000] mt-2">Photo Not Taken</Text>
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
                <Text className="text-gray-700 font-bold color-primary-101 mb-1">ID: <Text className="font-medium color-gray-700">C-1</Text></Text>
                <Text className="text-gray-700 font-bold color-primary-101 mb-1">Height: <Text className="font-medium color-gray-700">150 cm</Text></Text>
                <Text className="text-gray-700 font-bold color-primary-101 mb-1">Width: <Text className="font-medium color-gray-700">65 cm</Text></Text>
            </View>
            <View>
                <Text className="text-gray-700 font-bold color-primary-101 mb-1">Last Inspection: <Text className="font-medium color-gray-700">MAR 21, 2024</Text></Text>
                <Text className="text-gray-700 font-bold color-primary-101 mb-1">Progress: <Text className="font-medium color-gray-700">50%</Text></Text>
            </View>
            </View>
        </View>

        {/* Tags Section */}
        <View className="mt-6 px-4">
            <Text className="text-lg font-bold text-[#800000] mb-2">Tags</Text>
            <View className="flex-row items-center">
            <Text className="bg-gray-200 px-4 py-2 rounded-full text-gray-700 mr-2">Foundation</Text>
            <Text className="bg-gray-200 px-4 py-2 rounded-full text-gray-700 mr-2">Pillar</Text>
            <TouchableOpacity onPress={goToRadar}className="bg-[#800000] px-6 py-2 rounded-full items-center justify-center m-auto">
                <Text className="text-white font-medium">Locate</Text>
            </TouchableOpacity>
            </View>
        </View>

        {/* Notes Section */}
        <View className="mt-6 px-4">
            <Text className="text-lg font-bold text-[#800000] mb-0">Notes</Text>
            <Text className="border border-gray-300 rounded">...</Text>
        </View>

        {/* Inspect Button */}
        <TouchableOpacity className="bg-[#800000] p-3 rounded-full mt-20 mx-20" onPress={goToInpect}>
            <Text className="text-white text-center font-bold text-lg">INSPECT</Text>
        </TouchableOpacity>
        </SafeAreaView>

  );
};

