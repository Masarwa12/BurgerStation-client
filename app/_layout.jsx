import { HeaderTitle } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
  screenOptions={{
    headerShown: false,
    gestureEnabled: false}}>
<Stack.Screen name="index"/>
<Stack.Screen name="Register"/>
<Stack.Screen name ="DrawerDir" />
  </Stack>;
}
