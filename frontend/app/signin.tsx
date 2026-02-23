import { View, Text, Pressable, Linking, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { globalStyles } from '@/styles/globalStyle';
import { Stack } from 'expo-router';
import { API_BASE_URL } from '@/utils/api';
import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';

const MOBILE_BREAKPOINT = 768;

export default function SignInScreen() {
  const githubAuthUrl = `${API_BASE_URL}/oauth2/authorization/github`;
  const googleAuthUrl = `${API_BASE_URL}/oauth2/authorization/google`;
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  if (isMobile) {
    // ── MOBILE: single-screen vertical layout ──
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={mobileStyles.page}>
          {/* Brand section */}
          <View style={mobileStyles.brandSection}>
            <Text style={mobileStyles.brandTitle}>Whiskr</Text>
            <Text style={mobileStyles.tagline}>A home for your cats on the internet.</Text>
            <View style={mobileStyles.imageWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
                }}
                style={mobileStyles.catImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Sign-in section */}
          <View style={mobileStyles.formSection}>
            <Text style={mobileStyles.signInTitle}>Sign in to Whiskr</Text>

            <Pressable
              onPress={() => Linking.openURL(googleAuthUrl)}
              style={({ pressed }) => [
                mobileStyles.buttonBase,
                mobileStyles.primaryButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={mobileStyles.buttonContent}>
                <FontAwesome name="google" size={16} color="#fff" />
                <Text style={mobileStyles.primaryButtonText}>Sign in with Google</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => Linking.openURL(githubAuthUrl)}
              style={({ pressed }) => [
                mobileStyles.buttonBase,
                mobileStyles.secondaryButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={mobileStyles.buttonContent}>
                <FontAwesome name="github" size={16} color={Colors.light.background} />
                <Text style={mobileStyles.secondaryButtonText}>Sign in with GitHub</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  // ── DESKTOP: original side-by-side layout (unchanged) ──
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
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>Sign in to Whiskr</Text>

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

// ── Desktop styles (original, untouched) ──
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

// ── Mobile styles (completely separate) ──
const mobileStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Top brand area with blue background
  brandSection: {
    backgroundColor: Colors.light.background,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  tagline: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  // Bottom form area
  formSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    alignItems: 'center',
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  buttonBase: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    width: '100%',
    maxWidth: 320,
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