import React from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from "@/components/BackButton"
import { router } from 'expo-router';

const datas = [
    { id: 'C-1', construct: 'COLUMN', lastInspection: 'MAR 21, 2024', progress: '50%' },
    { id: 'C-2', construct: 'COLUMN', lastInspection: 'MAR 21, 2024', progress: '25%' },
    { id: 'P-1', construct: 'PIPE', lastInspection: 'MAR 22, 2024', progress: '75%' },
    { id: 'P-2', construct: 'PIPE', lastInspection: 'MAR 22, 2024', progress: '10%' },
];

const goBack=()=>{
    router.back()
}

const gotoInspect=()=>{
    router.push('/(other)/inspection')
}

const goToReview=()=>{
    router.push('/(other)/review')
}

export default function constructdb() {
    return (
     
        <ScrollView className="flex-0">
            {/* Header Section */}
            <View className="flex items-center px-6 py bg-white">
                <Image 
                    source={require('@/assets/images/astrom-house.png')} 
                    className="w-16 h-16 rounded bg-gray-100" 
                    style={{ width: 400, height: 250 }} // Ensure dimensions are set
                />
                <Text className="text-2xl text-white font-JakartaSemiBold absolute bottom-5 left-5 ">
                  Astom House
                </Text>
                <BackButton onPress={goBack} className="absolute w-9 h-9 top-10 left-4 bg-primary-101" title={'<'}/>
                    
            </View>

            {/* Search bar */}
            <View className="flex-row items-center px-4 py-2 mt-6 mx-6 bg-[#f2e0d0] rounded-lg">
                <TextInput 
                    className="flex-1 p-2 text-base" 
                    placeholder="Search construct" 
                    placeholderTextColor="#a1a1a1"
                />
                <FontAwesome name="search" size={20} color="#a1a1a1" />
            </View>

            <View className='mt-4 py-3'>
                <View className={`flex-row justify-between items-center p-2 bg-secondary-101 border-b border-gray-200`}>
                    <Text className="flex-1 right-2 text-center text-xs font-bold">ID</Text>
                    <Text className="flex-1 right-2 text-center text-xs font-bold">CONSTRUCT</Text>
                    <Text className="flex-1 text-center text-xs font-bold">LAST INSPECTION</Text>
                    <Text className="flex-1 text-center text-xs font-bold">PROGRESS</Text>
                </View>
              {datas.map((data, index) =>(
                <TouchableOpacity onPress={goToReview}>
                <View className={`flex-row justify-center p-4 items-center ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-200`}>
                  <Text className="flex-1 right-3 text-center text-xs">{data.id}</Text>
                  <Text className="flex-1 right-3 text-center text-xs">{data.construct}</Text>
                  <Text className="flex-1 text-center text-xs">{data.lastInspection}</Text>
                  <Text className="flex-1 text-center text-xs">{data.progress}</Text>
                  
                </View>
                </TouchableOpacity>
              ))}
            </View>


        </ScrollView>
      
    );
}
