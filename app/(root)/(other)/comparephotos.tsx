import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const comparephotos = () => {

    const goToBack=()=>{
        router.back()
    }

  return (

    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
       <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-md">
            <TouchableOpacity className='justify-center' onPress={goToBack}>
            <FontAwesome name="arrow-left" size={24} color="#800000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-primary-101">CURRENT</Text>
            <TouchableOpacity>
            
            </TouchableOpacity>
        </View>

      {/* Title */}
 

      {/* Current Photo Section */}
      <View className="items-center mt-4 py-4">
        <Image
          source={require('@/assets/images/costruct1.png')}
          className="w-[90%] h-[250px] rounded-lg border-2 border-[#800000]"
          style={{ resizeMode: 'cover' }}
        />
      </View>

      {/* Date Section */}
      <View className="flex-row items-center justify-center">
        <Text className="text-lg font-bold text-primary-101 px-3">MAR 21, 2024</Text>
        <TouchableOpacity>
          <FontAwesome name="caret-down" size={24} color="#800E13" />
        </TouchableOpacity>
      </View>

      {/* Previous Photo Section */}
      <View className="items-center mt-3">
        <Image
          source={require('@/assets/images/costruct1.png')}
          className="w-[90%] h-[250px] rounded-lg border-2 border-[#800000]"
          style={{ resizeMode: 'cover' }}
        />
      </View>

      {/* Alert Section */}
      <View className="flex-row items-center justify-center mt-10 px-4 py-2 bg-white">
        <View className="w-4 h-4 mr-2 bg-[#9370DB]"></View>
        <Text className="text-lg font-bold text-[#9370DB]">MAJOR CHANGE DETECTED</Text>
      </View>
    </SafeAreaView>
  );
};

export default comparephotos;