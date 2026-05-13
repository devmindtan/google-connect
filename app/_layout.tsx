import { Stack } from 'expo-router';
import { AuthProvider } from "@/context/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" /> 
        <Stack.Screen name="profile" />
      </Stack>
    </AuthProvider>
  );
}