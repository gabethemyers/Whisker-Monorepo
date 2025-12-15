// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { brandColor } from '@/styles/globalStyle';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="selectCat" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="loginSuccess" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            contentStyle: { backgroundColor: brandColor },
            headerStyle: { backgroundColor: brandColor },
            headerTintColor: '#fff',
            headerTitleStyle: { color: '#fff', fontWeight: '700' },
          }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor={brandColor} />
    </ThemeProvider>
  );
}

