import { Stack } from 'expo-router';
import 'react-native-reanimated';
const Layout=() => {
  return (

      <Stack>
        <Stack.Screen name="constructdb" options={{ headerShown: false }} />
        <Stack.Screen name="comparephotos" options={{ headerShown: false }} />
        <Stack.Screen name="review" options={{ headerShown: false }} />
        <Stack.Screen name="inspection" options={{ headerShown: false }} />
      </Stack>

  );
}

export default Layout