import { View, Text, Switch, TouchableOpacity, ScrollView, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  NotificationSettings,
  loadNotificationSettings,
  saveNotificationSettings,
  initializeNotifications,
  requestNotificationPermissions,
} from "@/lib/notifications";

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<NotificationSettings>({
    workoutReminders: true,
    dailyMotivation: true,
    vitalSignsAlerts: true,
    reminderTime: "09:00",
  });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermission();
  }, []);

  const loadSettings = async () => {
    const loaded = await loadNotificationSettings();
    setSettings(loaded);
  };

  const checkPermission = async () => {
    const permission = await requestNotificationPermissions();
    setHasPermission(permission);
  };

  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
    await initializeNotifications();
  };

  const handleTimeChange = async (time: string) => {
    const newSettings = { ...settings, reminderTime: time };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
    await initializeNotifications();
  };

  if (Platform.OS === "web") {
    return (
      <ScreenContainer>
        <View className="p-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="chevron.left" size={28} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-bold ml-4">Notificações</Text>
          </View>

          <View className="bg-surface rounded-2xl p-6 items-center">
            <IconSymbol name="bell.slash" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4">
              Notificações push não estão disponíveis na versão web.
              {"\n\n"}
              Use o app mobile para receber lembretes e alertas.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="chevron.left" size={28} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-bold ml-4">Notificações</Text>
          </View>

          {/* Status de Permissão */}
          {!hasPermission && (
            <View className="bg-warning/20 border border-warning rounded-2xl p-4 mb-6">
              <View className="flex-row items-center">
                <IconSymbol name="exclamationmark.triangle" size={24} color={colors.warning} />
                <Text className="text-warning font-bold ml-2">Permissão Necessária</Text>
              </View>
              <Text className="text-foreground text-sm mt-2">
                Ative as notificações nas configurações do seu dispositivo para receber lembretes e alertas.
              </Text>
              <TouchableOpacity
                className="bg-warning rounded-xl p-3 mt-3"
                onPress={checkPermission}
                activeOpacity={0.7}
              >
                <Text className="text-background font-bold text-center">Solicitar Permissão</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lembretes de Treino */}
          <View className="bg-surface rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <IconSymbol name="dumbbell" size={24} color={colors.primary} />
                <View className="ml-3 flex-1">
                  <Text className="text-foreground font-bold">Lembretes de Treino</Text>
                  <Text className="text-muted text-sm">Notificações diárias para treinar</Text>
                </View>
              </View>
              <Switch
                value={settings.workoutReminders}
                onValueChange={(value) => handleToggle("workoutReminders", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            {settings.workoutReminders && (
              <View className="mt-2 pt-3 border-t border-border">
                <Text className="text-muted text-sm mb-2">Horário do lembrete:</Text>
                <View className="flex-row gap-2">
                  {["07:00", "09:00", "12:00", "18:00", "20:00"].map((time) => (
                    <TouchableOpacity
                      key={time}
                      className={`flex-1 rounded-xl p-2 ${
                        settings.reminderTime === time ? "bg-primary" : "bg-background"
                      }`}
                      onPress={() => handleTimeChange(time)}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-center text-sm font-bold ${
                          settings.reminderTime === time ? "text-background" : "text-foreground"
                        }`}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Motivação Diária */}
          <View className="bg-surface rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <IconSymbol name="star.fill" size={24} color={colors.warning} />
                <View className="ml-3 flex-1">
                  <Text className="text-foreground font-bold">Motivação Diária</Text>
                  <Text className="text-muted text-sm">Mensagens inspiradoras às 8h</Text>
                </View>
              </View>
              <Switch
                value={settings.dailyMotivation}
                onValueChange={(value) => handleToggle("dailyMotivation", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          {/* Alertas de Sinais Vitais */}
          <View className="bg-surface rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <IconSymbol name="heart.fill" size={24} color={colors.error} />
                <View className="ml-3 flex-1">
                  <Text className="text-foreground font-bold">Alertas de Saúde</Text>
                  <Text className="text-muted text-sm">Avisos para valores anormais</Text>
                </View>
              </View>
              <Switch
                value={settings.vitalSignsAlerts}
                onValueChange={(value) => handleToggle("vitalSignsAlerts", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          {/* Informações */}
          <View className="bg-primary/10 rounded-2xl p-4 mt-4">
            <Text className="text-primary text-sm">
              💡 Dica: Mantenha as notificações ativadas para não perder seus treinos e acompanhar sua saúde de perto!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
