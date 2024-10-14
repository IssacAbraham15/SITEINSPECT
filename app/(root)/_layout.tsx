import { Stack } from "expo-router";
import { Image,ImageSourcePropType, View } from "react-native";

const Layout = () => {

    return(
        
        <Stack>
             <Stack.Screen name="(tabs)" options={{ headerShown: false}} /> 
             <Stack.Screen name="constructdb" options={{ headerShown: false}} /> 
             
        </Stack>
    );
};

export default Layout; 