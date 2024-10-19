import { useGlobalContext } from "@/context/GlobalProvider";
import { Logout } from "@/lib/appwrite";
import { Redirect } from "expo-router"
import {Text,View} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const index =() =>{
    Logout();
    return <Redirect href="/(root)/(other)/review"/>


}

export default index