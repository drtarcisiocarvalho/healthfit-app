import "@/global.css";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { offlineSyncService } from "@/lib/offline-sync";
import { View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Inicializar serviço de sincronização offline
        await offlineSyncService.syncPendingData();

        // Check if PIN is set (requires login)
        const storedPin = await AsyncStorage.getItem("userPin");
        setNeedsAuth(!!storedPin);

        // Aguardar um pouco para garantir que tudo carregou
        await new Promise(resolve => setTimeout(resolve, 1000));

        setAppIsReady(true);
      } catch (e) {
        console.error("Error loading app:", e);
        setError(e instanceof Error ? e.message : "Erro ao carregar o app");
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && needsAuth) {
      // Redirect to login if PIN is configured
      setTimeout(() => router.replace("/login" as any), 100);
    }
  }, [appIsReady, needsAuth]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Splash screen ainda visível
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#EF4444" }}>
          Erro ao carregar
        </Text>
        <Text style={{ textAlign: "center", color: "#687076" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="oauth/callback" />
          </Stack>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
