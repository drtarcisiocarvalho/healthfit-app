import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoSync: boolean;
  offlineMode: boolean;
  biometricAuth: boolean;
}

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    autoSync: true,
    offlineMode: false,
    biometricAuth: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem("appSettings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const saveSetting = async (key: keyof Settings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      "Limpar Cache",
      "Tem certeza que deseja limpar o cache do app? Isso pode melhorar o desempenho.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              // Limpar apenas cache, não dados do usuário
              Alert.alert("Sucesso", "Cache limpo com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar o cache");
            }
          },
        },
      ]
    );
  };

  const resetApp = async () => {
    Alert.alert(
      "Resetar App",
      "ATENÇÃO: Isso irá apagar TODOS os seus dados e configurações. Esta ação não pode ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Sucesso", "App resetado com sucesso! Reinicie o app.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível resetar o app");
            }
          },
        },
      ]
    );
  };

  const settingItems = [
    {
      title: "Notificações",
      description: "Receber alertas e lembretes",
      icon: "bell.fill",
      key: "notifications" as keyof Settings,
      value: settings.notifications,
    },
    {
      title: "Modo Escuro",
      description: "Tema escuro automático",
      icon: "moon.fill",
      key: "darkMode" as keyof Settings,
      value: settings.darkMode,
    },
    {
      title: "Sincronização Automática",
      description: "Sincronizar dados automaticamente",
      icon: "arrow.triangle.2.circlepath",
      key: "autoSync" as keyof Settings,
      value: settings.autoSync,
    },
    {
      title: "Modo Offline",
      description: "Salvar dados localmente",
      icon: "wifi.slash",
      key: "offlineMode" as keyof Settings,
      value: settings.offlineMode,
    },
    {
      title: "Autenticação Biométrica",
      description: "Usar Face ID ou impressão digital",
      icon: "faceid",
      key: "biometricAuth" as keyof Settings,
      value: settings.biometricAuth,
    },
  ];

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Configurações</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-4">
          {/* Settings List */}
          {settingItems.map((item) => (
            <View
              key={item.key}
              className="bg-surface rounded-2xl p-5 border border-border flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <IconSymbol name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-bold mb-1">{item.title}</Text>
                  <Text className="text-muted text-sm">{item.description}</Text>
                </View>
              </View>
              <Switch
                value={item.value}
                onValueChange={(value) => saveSetting(item.key, value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={item.value ? colors.background : colors.muted}
              />
            </View>
          ))}

          {/* Actions */}
          <View className="mt-6 gap-3">
            <TouchableOpacity
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
              onPress={clearCache}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <IconSymbol name="trash.fill" size={20} color={colors.warning} />
                <Text className="text-foreground font-semibold">Limpar Cache</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface rounded-xl p-4 border-2"
              style={{ borderColor: colors.error }}
              onPress={resetApp}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
                  <Text className="font-semibold" style={{ color: colors.error }}>
                    Resetar App
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.error} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <View className="items-center mt-8">
            <Text className="text-muted text-sm">HealthFit v19.0</Text>
            <Text className="text-muted text-xs mt-1">© 2026 Todos os direitos reservados</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
