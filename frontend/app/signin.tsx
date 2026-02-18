import { View, Text, Pressable, Linking, StyleSheet, Image } from 'react-native';
import { globalStyles } from '@/styles/globalStyle';
import { Stack } from 'expo-router';
import { API_BASE_URL } from '@/utils/api';
import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function SignInScreen() {
  const githubAuthUrl = `${API_BASE_URL}/oauth2/authorization/github`;
  const googleAuthUrl = `${API_BASE_URL}/oauth2/authorization/google`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.page}>
        <View style={styles.leftPanel}>
          <View style={styles.leftPanelInner}>
            <View style={styles.brandContent}>
              <Text style={styles.brandTitle}>Whiskr</Text>
              <Text style={styles.tagline}>A home for your cats on the internet.</Text>
            </View>

            <View style={styles.previewCard}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
                }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <Text style={globalStyles.title}>Sign in to Whiskr</Text>

            <Pressable
              onPress={() => Linking.openURL(googleAuthUrl)}
              style={({ pressed }) => [
                styles.buttonBase,
                styles.primaryButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="google" size={16} color="#fff" />
                <Text style={styles.primaryButtonText}>Sign in with Google</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => Linking.openURL(githubAuthUrl)}
              style={({ pressed }) => [
                styles.buttonBase,
                styles.secondaryButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="github" size={16} color={Colors.light.background} />
                <Text style={styles.secondaryButtonText}>Sign in with GitHub</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftPanel: {
    width: '50%',
    backgroundColor: Colors.light.background,
    height: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftPanelInner: {
    width: '100%',
    maxWidth: 520,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContent: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 56,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.6,
  },
  tagline: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    maxWidth: 380,
    textAlign: 'center',
  },
  previewCard: {
    width: '100%',
    height: '58%',
    maxHeight: 560,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  rightPanel: {
    width: '50%',
    backgroundColor: '#fff',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  buttonBase: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.light.background,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  secondaryButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
