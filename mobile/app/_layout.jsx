import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import {
  saveAccountToRecent,
  getRecentAccounts,
} from "../utils/accountStorage";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

function RootLayoutContent() {
  const { themeName, isLoaded: themeLoaded } = useTheme();

  if (!themeLoaded) return null;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      key={themeName}
    >
      <SafeScreen>
        <InitialLayout />
      </SafeScreen>
    </ClerkProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const hasNavigated = useRef(false);

  // Lưu tài khoản vào danh sách gần đây khi đăng nhập
  useEffect(() => {
    if (isSignedIn && user) {
      saveAccountToRecent(user);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isRoot = !segments[0];

    if (isSignedIn && (inAuthGroup || isRoot)) {
      // Đã đăng nhập nhưng đang ở màn auth hoặc root → vào app
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      // Chưa đăng nhập và không ở màn auth → về sign-in
      router.replace("/(auth)/sign-in");
    }
  }, [isSignedIn, isLoaded, segments[0]]);

  // Hiển thị màn loading trong khi Clerk đang kiểm tra auth
  // Tránh flash màn sign-in trước khi biết đã đăng nhập chưa
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
