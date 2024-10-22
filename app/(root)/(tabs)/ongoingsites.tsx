import React, { useEffect, useState } from 'react';
import { Link, router } from "expo-router";
import { Text, View, Image, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation
import { getCurrentUser, getOnGoingSites, getUsername } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '@/lib/useAppwrite';

const OnGoingSites = () => {
    const { user, setUser } = useGlobalContext();
    
    const { data: onGoingSitesData, refetch } = useAppwrite(getOnGoingSites);
    const [Refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch(); // Refetch the data
        setRefreshing(false); // Set refreshing to false after fetching
    };

    const goToCompletedSites = () => {
        router.push("/(root)/(tabs)/completedsites");
    };

    const goToConstructDb = () => {
        router.push("/(other)/constructdb");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                const currentUser = await getCurrentUser(); // Fetch user if not already loaded
                setUser(currentUser);
            }
        };
        fetchUserData();
    }, []);

    return (
        <SafeAreaView className='bg-white'>
            <ScrollView className="bg-gray-100">
                {/* Header Section */}
                <View className="flex-row items-center px-4 py-4 bg-white">
                    {user.avatar ? (
                        <Image
                            source={{ uri: user.avatar }} // This should point to the avatar URL
                            style={{ width: 50, height: 50, borderRadius: 50 }} // Customize size and shape
                        />
                    ) : (
                        <Image
                            source={require('@/assets/icons/profile-icon.png')} // Fallback avatar
                            style={{ width: 50, height: 50, borderRadius: 50 }} // Customize size and shape
                        />
                    )}
                    <Text className="text-2xl font-bold ml-4 color-primary-101">Hello, {user.username.split(" ")[0]} 👋</Text>
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
                <FlatList
                    className="mt-8 px-4"
                    data={onGoingSitesData}
                    keyExtractor={item => item.$id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={goToConstructDb}>
                            <View className="flex-row items-center bg-white p-4 mb-4 rounded-lg shadow-sm">
                                {item.Image ? (
                                    <Image
                                        className="w-20 h-20 rounded-lg"
                                        source={{ uri: item.Image }} // This should point to the avatar URL
                                        
                                    />
                                ) : (
                                    <Image
                                        className="w-20 h-20 rounded-lg"
                                        source={require('@/assets/icons/profile-icon.png')} // Fallback avatar

                                    />
                                )}
                                <View className="ml-4 flex-1">
                                    <Text className="text-lg font-bold">{item.Name}</Text>
                                    <Text className="text-gray-500">{item.Location}</Text>
                                </View>
                                <View className="w-16 h-16 border-4 border-primary-101 rounded-full flex items-center justify-center">
                                    <Text className="text-lg font-bold text-primary-101">{item.Progress}%</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    onRefresh={onRefresh}
                    refreshing={Refreshing} // Pass the refreshing state to FlatList
                />
                <View className='p-10'></View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OnGoingSites;
