import React from 'react';

import { SignedIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Text, View, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation



export default function CompletedSites() {

    const goToOnGoingSites = () => {
        router.push("/(root)/(tabs)/ongoingsites")
  };

    return (
        <SafeAreaView>
        <ScrollView className="">
            {/* Header Section */}
            <View className="flex-row items-center px-4 py-4 bg-white">
                <Image source={require('@/assets/icons/profile-icon.png')} className="w-16 h-16 rounded-full bg-gray-100" />
                <Text className="text-2xl font-bold ml-4">username</Text>
            </View>

            {/* Search bar */}
            <View className="flex-row items-center px-4 py-2 mt-6 mx-6 bg-[#f2e0d0] rounded-lg">
                <TextInput 
                    className="flex-1 p-2 text-base" 
                    placeholder="Search construction sites" 
                    placeholderTextColor="#a1a1a1"
                />
                <FontAwesome name="search" size={20} color="#a1a1a1" />
            </View>

            {/* Tabs for Site Progress */}
            <View className="flex-row justify-evenly mt-6">
                
                    <TouchableOpacity className="px-4 py-2 rounded-lg bg-[#DCDCDC]" onPressOut={goToOnGoingSites} >
                        <Text className="text-primary-101 font-medium">On going sites</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity className="px-4 py-2 rounded-lg bg-[#b52424]">
                        <Text className="text-white font-bold">Completed Sites</Text>
                    </TouchableOpacity>
            </View>

            {/* Project List */}
            <View className="mt-8 px-4">
                {projects.map((project, index) => (
                    <View key={index} className="flex-row items-center bg-white p-4 mb-4 rounded-lg shadow-sm">
                        <Image source={project.image} className="w-20 h-20 rounded-lg" />
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold">{project.name}</Text>
                            <Text className="text-gray-500">{project.location}</Text>
                        </View>
                        <View className="w-16 h-16 border-4 border-red-600 rounded-full flex items-center justify-center">
                            <Text className="text-lg font-bold text-red-600">{project.progress}%</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
    );
}

const projects = [
    { name: 'GardenView', location: 'Mudon', progress: 100, image: require('@/assets/images/GardenView.png') },
   
];
