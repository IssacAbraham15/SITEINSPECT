import { Stack } from "expo-router";
import { Image,ImageSourcePropType, View } from "react-native";

const Layout = () => {

    return(
        
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} /> 
            <Stack.Screen name="(other)" options={{ headerShown: false}} />
        </Stack>
    );
};

export default Layout; 