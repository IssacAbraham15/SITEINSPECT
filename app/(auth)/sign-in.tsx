import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import {Alert, Image,ScrollView, Text, View} from "react-native"
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context"

const SignIn =() =>{
  const [form, setForm] = useState({
      email: "",
      password: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setIsLoggedIn,isLoggedIn } = useGlobalContext();
  
  const onSignInPress = async () => {
        if (!form.email || !form.password ){
          Alert.alert('Error', 'Please fill in all fields')
        }

        setIsSubmitting(true);

        try {
          await signIn(form.email, form.password)
          const result = await getCurrentUser();
          setUser(result)
          console.log(result)
          setIsLoggedIn(true)
          console.log("message after logging in",isLoggedIn)
          router.replace("/(root)/(tabs)/ongoingsites")
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
        <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6 bg-primary-101" />

        <OAuth/>

        <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
          <Text>Don't have an account? </Text>
          <Text className="text-primary-101">Sign Up</Text>
        </Link>
      </View>

       
    </ScrollView>
);

}

export default SignIn