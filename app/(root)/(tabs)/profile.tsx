
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import { getCurrentUser, Logout } from "@/lib/appwrite";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect } from "react";

const Profile = () => {
  const { user, setUser, setIsLoggedIn,isLoggedIn } = useGlobalContext(); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        const currentUser = await getCurrentUser(); // Fetch user if not already loaded
        setUser(currentUser);
      }
    };

    fetchUserData();
    }, []);

    const firstname = user.username.split(" ")[0]
    const lastname = user.username.split(" ").pop()

 const onLogout = async () => {
  try {
      await Logout(); // Await the logout function
      setUser(null); // Clear the user state
      setIsLoggedIn(false); // Set the login state to false
      router.replace("/(auth)/sign-in"); // Navigate to sign-in page

    } catch (err: any) {
        Alert.alert('Error', err.message);
    }
        
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5 text-primary-101">My profile</Text>

        <View className="flex items-center justify-center my-5">
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }} // This should point to the avatar URL
              style={{ width: 100, height: 100, borderRadius: 50 }} // Customize size and shape
            />
            ) : (
            <Image
              source={require('@/assets/icons/profile-icon.png')} // Fallback avatar
              style={{ width: 50, height: 50, borderRadius: 50 }} // Customize size and shape
            />
          )}
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="First name"
              placeholder={firstname}
              placeholderTextColor='black'
              containerStyle="w-full"
              inputStyle="p-4"
              editable={false}
              underlineColorAndroid="transparent"
            />
            

            <InputField
              label="Last name"
              placeholder={lastname}
              placeholderTextColor='black'
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              underlineColorAndroid="transparent"
            />

            <InputField
              label="Email"
              placeholder={user.email}
              placeholderTextColor='black'
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              underlineColorAndroid="transparent"
            />

            <InputField
              label="Phone"
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
        <CustomButton title="Logout" onPress={onLogout} className="mt-6 bg-primary-101" />
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default Profile;