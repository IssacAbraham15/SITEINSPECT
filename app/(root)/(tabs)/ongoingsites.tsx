import React from 'react';
import { Link, router } from "expo-router";
import { Text, View, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation


const onGoingSites=() => {

    const goToCompletedSites = () => {
        router.push("/(root)/completedsites")
    };

    const goToConstructDb = () => {
        router.push("/(other)/constructdb")
    }

  
    return (
        <SafeAreaView>
        <ScrollView className="">
            {/* Header Section */}
            <View className="flex-row items-center px-4 py-4 bg-white">
                <Image source={require('@/assets/icons/profile-icon.png')} className=" w-16 h-16 rounded-full bg-gray-100" />
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
                <TouchableOpacity className="px-4 py-2 rounded-lg bg-[#b52424]">
                    <Text className="text-white font-bold">On going sites</Text>
                </TouchableOpacity>
                
                    <TouchableOpacity className="px-4 py-2 rounded-lg bg-[#DCDCDC]" onPress={goToCompletedSites}>
                        <Text className="text-primary-101 font-medium">Completed Sites</Text>
                    </TouchableOpacity>
            </View>

            {/* Project List */}
            <View className="mt-8 px-4">
                {projects.map((project, index) => (
                    <TouchableOpacity onPress={goToConstructDb}>
                        <View key={index} className="flex-row items-center bg-white p-4 mb-4 rounded-lg shadow-sm">
                            <Image source={project.image} className="w-20 h-20 rounded-lg" />
                            
                            <View className="ml-4 flex-1">
                                
                                <Text className="text-lg font-bold">{project.name}</Text>
                           
                                <Text className="text-gray-500">{project.location}</Text>
                            </View>

                            <View className="w-16 h-16 border-4 border-primary-101 rounded-full flex items-center justify-center">
                                <Text className="text-lg font-bold text-primary-101">{project.progress}%</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

const projects = [
    { name: 'Astom House', location: 'Dubai South', progress: 25, image: require('@/assets/images/astrom-house.png') },
    { name: 'Jailum Apartment', location: 'Jumeirah Beach Residence', progress: 50, image: require('@/assets/images/jailubai-apartment.png') },
    { name: 'Marina View', location: 'Marina', progress: 25, image: require('@/assets/images/mina-view.png') },
    { name: 'Astom Villa', location: 'Damac Lagoons', progress: 75, image: require('@/assets/images/astrom-villa.png') },
    { name: 'no.1', location: 'Damac Lagoons', progress: 75, image: require('@/assets/images/astrom-villa.png') },
    { name: 'no.2', location: 'Damac Lagoons', progress: 75, image: require('@/assets/images/astrom-villa.png') },
];

export default onGoingSites;