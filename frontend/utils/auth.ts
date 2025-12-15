import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const CAT_KEY = 'selectedCatId';

export async function getJwt() {
    if (Platform.OS === "web") {
    return window.localStorage.getItem("jwt");
  }
  return await SecureStore.getItemAsync("jwt");
}

export const getSelectedCatId = async (): Promise<number | null> => {
  const value = await AsyncStorage.getItem(CAT_KEY);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const setSelectedCatId = async (id: number | null): Promise<void> => {
  if (id == null) {
    await AsyncStorage.removeItem(CAT_KEY);
  } else {
    await AsyncStorage.setItem(CAT_KEY, String(id));
  }
};
export async function logout() {
  // Clear JWT (web vs native)
  if (Platform.OS === "web") {
    window.localStorage.removeItem("jwt");
  } else {
    await SecureStore.deleteItemAsync("jwt");
  }

  // Clear selected cat
  if (Platform.OS === "web") {
    window.localStorage.removeItem("selectedCatId");
  } else {
    await AsyncStorage.removeItem("selectedCatId");
  }
}

function decodeJwtPayload(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
}

export async function getUserId(): Promise<number | null> {
  const token = await getJwt();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return (
    payload.id ||
    payload.userId ||
    Number(payload.sub) ||
    null
  );
}
