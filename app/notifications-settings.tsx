import { View, Text, TouchableOpacity, ScrollView, Switch, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationsSettingsScreen() {
  const colors = useColors();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [weeklyChallenge, setWeeklyChallenge] = useState(true);
  const [healthSync, setHealthSync] = useState(false);

  useEffect(() => {
    checkPermissions();
    loadSettings();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === "granted");
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionGranted(status === "granted");
    
    if (status === "granted") {
      Alert.alert("Sucesso", "Permissões de notificação concedidas!");
      scheduleDefaultNotifications();
    } else {
      Alert.alert("Aviso", "Você precisa permitir notificações nas configurações do dispositivo");
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("notificationSettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        setWorkoutReminders(parsed.workoutReminders ?? true);
        setGoalAlerts(parsed.goalAlerts ?? true);
        setAchievementNotifications(parsed.achievementNotifications ?? true);
        setStreakReminders(parsed.streakReminders ?? true);
        setWeeklyChallenge(parsed.weeklyChallenge ?? true);
        setHealthSync(parsed.healthSync ?? false);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        workoutReminders,
        goalAlerts,
        achievementNotifications,
        streakReminders,
        weeklyChallenge,
        healthSync,
      };
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const scheduleDefaultNotifications = async () => {
    // Cancelar todas as notificações agendadas
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Agendar lembrete de treino diário às 18h
    if (workoutReminders) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora do Treino! 💪",
          body: "Não esqueça de fazer seu treino hoje. Mantenha seu streak!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: 18,
          minute: 0,
          repeats: true,
        },
      });
    }

    // Agendar lembrete de peso semanal (segunda-feira às 8h)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pesagem Semanal ⚖️",
        body: "Registre seu peso para acompanhar seu progresso!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: 2, // Segunda-feira
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    Alert.alert("Notificações Agendadas", "Você receberá lembretes personalizados!");
  };

  useEffect(() => {
    if (permissionGranted) {
      saveSettings();
      scheduleDefaultNotifications();
    }
  }, [workoutReminders, goalAlerts, achievementNotifications, streakReminders, weeklyChallenge, healthSync]);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Notificações</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Permission Status */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: permissionGranted ? colors.success + "20" : colors.muted + "20" }}
              >
                <IconSymbol
                  name="bell.fill"
                  size={24}
                  color={permissionGranted ? colors.success : colors.muted}
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">Status das Notificações</Text>
                <Text className="text-muted text-sm">
                  {permissionGranted ? "Ativadas" : "Desativadas"}
                </Text>
              </View>
            </View>

            {!permissionGranted && (
              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.health }}
                activeOpacity={0.8}
                onPress={requestPermissions}
              >
                <Text className="text-white font-semibold">Ativar Notificações</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notification Settings */}
          {permissionGranted && (
            <View className="bg-surface rounded-2xl p-5 border border-border gap-4">
              <Text className="text-foreground text-lg font-bold mb-2">Tipos de Notificação</Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Lembretes de Treino</Text>
                  <Text className="text-muted text-sm">Diariamente às 18h</Text>
                </View>
                <Switch
                  value={workoutReminders}
                  onValueChange={setWorkoutReminders}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={workoutReminders ? colors.health : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Alertas de Metas</Text>
                  <Text className="text-muted text-sm">Quando próximo de alcançar</Text>
                </View>
                <Switch
                  value={goalAlerts}
                  onValueChange={setGoalAlerts}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={goalAlerts ? colors.health : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Conquistas</Text>
                  <Text className="text-muted text-sm">Ao desbloquear badges</Text>
                </View>
                <Switch
                  value={achievementNotifications}
                  onValueChange={setAchievementNotifications}
                  trackColor={{ false: colors.border, true: colors.success + "80" }}
                  thumbColor={achievementNotifications ? colors.success : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Streak em Risco</Text>
                  <Text className="text-muted text-sm">Se não treinar por 2 dias</Text>
                </View>
                <Switch
                  value={streakReminders}
                  onValueChange={setStreakReminders}
                  trackColor={{ false: colors.border, true: colors.warning + "80" }}
                  thumbColor={streakReminders ? colors.warning : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Desafio Semanal</Text>
                  <Text className="text-muted text-sm">Toda segunda-feira</Text>
                </View>
                <Switch
                  value={weeklyChallenge}
                  onValueChange={setWeeklyChallenge}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={weeklyChallenge ? colors.health : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Sincronização Apple Health</Text>
                  <Text className="text-muted text-sm">Confirmação de sync</Text>
                </View>
                <Switch
                  value={healthSync}
                  onValueChange={setHealthSync}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={healthSync ? colors.health : colors.muted}
                />
              </View>
            </View>
          )}

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-2">Sobre as Notificações</Text>
            <Text className="text-muted text-sm leading-relaxed">
              Receba lembretes personalizados para manter sua rotina de saúde e fitness. As
              notificações são enviadas com base nos seus padrões de uso e podem ser ajustadas a
              qualquer momento.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
