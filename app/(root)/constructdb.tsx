import React from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation
import { SafeAreaView } from 'react-native-safe-area-context';

const datas = [
    { id: 'C-1', construct: 'COLUMN', lastInspection: 'MAR 21, 2024', progress: '50%' },
    { id: 'C-2', construct: 'COLUMN', lastInspection: 'MAR 21, 2024', progress: '25%' },
    { id: 'P-1', construct: 'PIPE', lastInspection: 'MAR 22, 2024', progress: '75%' },
    { id: 'P-2', construct: 'PIPE', lastInspection: 'MAR 22, 2024', progress: '10%' },
];


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
              {datas.map((data, index) =>(
                <View className={`flex-row justify-between p-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-200`}>
                  <Text className="flex-1 text-center text-xs">{data.id}</Text>
                  <Text className="flex-1 text-center text-xs">{data.construct}</Text>
                  <Text className="flex-1 text-center text-xs">{data.lastInspection}</Text>
                  <Text className="flex-1 text-center text-xs">{data.progress}</Text>
                  
                </View>
              ))}
            </View>


        </ScrollView>
      
    );
}
