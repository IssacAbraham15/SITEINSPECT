import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider'
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {Alert, Image,ScrollView, Text, View,} from "react-native"
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context"
import {createUser} from '../../lib/appwrite'


const Signup =() =>{
  const [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext();
  
  const onSignUpPress = async () => {
        if (!form.username || !form.email || !form.password ){
          Alert.alert('Error', 'Please fill in all fields')
        }

        setIsSubmitting(true);

        try {
          const result = await createUser(form.email, form.password, form.username);
          
          router.replace("/(root)/(tabs)/home")
        } catch (err : any) {
          Alert.alert('Error',err.message)
        } finally {
          setIsSubmitting(false); 
        }
      }


return (
  
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white"></View>
      <View className="relative w-full h-[250px]">
        <Image source={images.dubaiskyline} className="z-0 w-full h-[250px]" />
        <Text className="text-3xl text-white font-JakartaSemiBold absolute bottom-5 left-5 ">
          Welcome👋
        </Text>
      </View>

      <View className="p-5">
        <InputField
          label="Name"
          placeholder="Enter name"
          icon={icons.person}
          value={form.username}
          onChangeText={(value: any) => setForm({ ...form, username: value })}
        />
        <InputField
          label="Email"
          placeholder="Enter email"
          icon={icons.email}
          textContentType="emailAddress"
          value={form.email}
          onChangeText={(value: any) => setForm({ ...form, email: value })}
        />
        <InputField
          label="Password"
          placeholder="Enter password"
          icon={icons.lock}
          secureTextEntry={true}
          textContentType="password"
          value={form.password}
          onChangeText={(value: any) => setForm({ ...form, password: value })}
          
        />
        <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6 bg-primary-101" />

        <OAuth/>

        <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
          <Text>Already have an account? </Text>
          <Text className="text-primary-101">Log In</Text>
        </Link>
      </View>

       
    </ScrollView>
);

}

export default Signup