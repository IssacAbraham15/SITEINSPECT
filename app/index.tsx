import { useGlobalContext } from "@/context/GlobalProvider";
import { Logout } from "@/lib/appwrite";
import { Redirect, router } from "expo-router"
import { useEffect } from "react";
import {ActivityIndicator, Text,View} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const index =() =>{
    const { isLoggedIn, isLoading } = useGlobalContext(); // Get login state and loading status
    
     useEffect(() => {
    if (!isLoading) {
      // Check if the app has finished loading the global state
      if (isLoggedIn) {
        // If logged in, navigate to ongoing sites
        router.replace("/(root)/(tabs)/ongoingsites");
      } else {
        // If not logged in, navigate to the sign-in page
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoading, isLoggedIn]); // Trigger redirection when login state or loading status changes
  
  if (isLoading) {
    // Show a loading spinner while the global state is loading
    return (
      <View className= 'flex-1 justify-center items-center bg-primary-101' >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return null;
}

export default index