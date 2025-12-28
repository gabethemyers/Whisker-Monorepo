import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";

export default function LoginSuccess() {
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const router = useRouter();

  useEffect(() => {
    const storeToken = async () => {
      if (!token) {
        console.error("No token found in redirect URL");
        return;
      }

      const tokenString = Array.isArray(token) ? token[0] : token;
      if (!tokenString || typeof tokenString !== "string") {
        console.error("Invalid token value from redirect URL");
        return;
      }

      try {
        if (Platform.OS === "web") {
          // WEB: store token in localStorage and hard-redirect to /home
          if (typeof window !== "undefined") {
            window.localStorage.setItem("jwt", tokenString);
            window.location.href = "/home";
          }
        } else {
          // NATIVE: use SecureStore + expo-router
          await SecureStore.setItemAsync("jwt", tokenString);
          router.replace("/(tabs)/home");
        }
      } catch (err) {
        console.error("Error storing token", err);
      }
    };

    storeToken();
  }, [token, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16, fontSize: 16 }}>Signing you in…</Text>
    </View>
  );
}
