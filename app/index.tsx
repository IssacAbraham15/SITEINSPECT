import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect } from "expo-router"
import {Text,View} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Home =() =>{
    const {isLoading,isLoggedIn} = useGlobalContext();
    console.log("index logged in")
    console.log(isLoggedIn)
    if(isLoggedIn)
        return <Redirect href ="/(root)/(tabs)/home"/>
    else
        return <Redirect href="/(auth)/sign-in"/>


}

export default Home