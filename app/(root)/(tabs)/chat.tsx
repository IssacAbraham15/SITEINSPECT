import { View, Text, SafeAreaView, Alert } from 'react-native'
import React from 'react'
import { Logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';

const Chat = () => {
            
    const onLogout = async () => {
        try {
          Logout();
          router.replace("/(auth)/sign-in")
        } catch (err : any) {
          Alert.alert('Error',err.message)
        } finally {
          
        }
      }
return(
    <SafeAreaView>
         <CustomButton title="Logout" onPress={onLogout} className="mt-6 bg-primary-101" />
    </SafeAreaView>
)
}



export default Chat