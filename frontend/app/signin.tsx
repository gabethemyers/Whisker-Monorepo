import { View, Text, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '@/styles/globalStyle';
import Header from '@/components/signInHeader';
import { Stack } from 'expo-router';
import { API_BASE_URL } from '@/utils/api';

export default function SignInScreen() {
  const router = useRouter();

  const githubAuthUrl = `${API_BASE_URL}/oauth2/authorization/github`;
  const googleAuthUrl = `${API_BASE_URL}/oauth2/authorization/google`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Sign in to Whiskr</Text>

        {/* GitHub Login */}
        <Pressable
          onPress={() => Linking.openURL(githubAuthUrl)}
          style={({ pressed }) => [
            globalStyles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={globalStyles.buttonText}>Sign in with GitHub</Text>
        </Pressable>

        {/* Google Login */}
        <Pressable
          onPress={() => Linking.openURL(googleAuthUrl)}
          style={({ pressed }) => [
            globalStyles.button,
            { opacity: pressed ? 0.7 : 1, marginTop: 12 },
          ]}
        >
          <Text style={globalStyles.buttonText}>Sign in with Google</Text>
        </Pressable>



        <Text style={{ marginTop: 12, color: '#666' }}>
          You can still browse cats without signing in.
        </Text>
      </View>
    </>
  );
}




