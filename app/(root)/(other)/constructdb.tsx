import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // For icons in the bottom navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from "@/components/BackButton"
import { router } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import { getConstructsBySiteId } from '@/lib/appwrite';



const goBack=()=>{
    router.back()
}

const gotoInspect=()=>{
    router.push('/(other)/inspection')
}

const goToReview = (constructId: string, siteName: string) => {
    router.push({
        pathname: '/(other)/review',
        params: { constructId, siteName },
    });
};

interface ConstructData {
    id: string;
    constructType: string;
    lastInspection: Date | null;
    progress: number | null;
}

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
};


export default function constructdb() {
    const { siteData} = useLocalSearchParams();
    const site = siteData ? JSON.parse(Array.isArray(siteData) ? siteData[0] : siteData) : null;
    const [constructData, setConstructData] = useState<ConstructData[]>([]);

    useEffect(() => {
    const fetchConstructData = async () => {
        if (site && site.Name) {
            try {
                const constructs = await getConstructsBySiteId(site.Name);
                setConstructData(constructs); // Assuming `setConstructs` updates state
            } catch (error) {
                console.log(error);
            }
        }
    };

    fetchConstructData();
    }, [site]);

    return (
        <ScrollView>
            {/* Header Section */}
            <View className="flex items-center px-6 py bg-white">
                 {site?.Image ? (
                    <Image 
                        source={{ uri: site.Image }} 
                        className="w-16 h-16 rounded bg-gray-100" 
                        style={{ width: 400, height: 250 }}
                        blurRadius={4} 
                    />
                ) : (
                    <Image 
                        source={require('@/assets/icons/profile-icon.png')} 
                        className="w-16 h-16 rounded bg-gray-100" 
                        style={{ width: 400, height: 250 }}
                        blurRadius={4}  
                    />
                )}
                <Text className="text-2xl text-white font-bold absolute bottom-5 left-5 ">
                 {site?.Name || "Site Name"}
                </Text>
                <BackButton onPress={goBack} className="absolute top-12 left-5 w-9 h-9 bg-primary-101 items-center justify-center rounded-full" title={'<'}/>
                    
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
              {constructData.map((data, index) =>(
                <TouchableOpacity onPress={() => goToReview(data.id, site.Name)} key={data.id}>
                <View className={`flex-row justify-center p-4 items-center ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-b border-gray-200`}>
                  <Text className="flex-1 right-3 text-center text-xs">{data.id}</Text>
                  <Text className="flex-1 right-3 text-center text-xs">{data.constructType}</Text>
                  <Text className="flex-1 text-center text-xs">{data.lastInspection ? formatDate(new Date(data.lastInspection)) : 'N/A'}</Text>
                  <Text className="flex-1 text-center text-xs">{data.progress ?? 'N/A'}</Text>
                  
                </View>
                </TouchableOpacity>
              ))}
            </View>


        </ScrollView>
    );
}
