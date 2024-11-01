import { Stack } from "expo-router";
import signin from './auth/signin/index'
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown:false
      }}/>
      
    </Stack>
  );
}
