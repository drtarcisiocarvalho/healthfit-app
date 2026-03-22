import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
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

export interface NotificationSettings {
  workoutReminders: boolean;
  dailyMotivation: boolean;
  vitalSignsAlerts: boolean;
  reminderTime: string; // HH:MM format
}

const DEFAULT_SETTINGS: NotificationSettings = {
  workoutReminders: true,
  dailyMotivation: true,
  vitalSignsAlerts: true,
  reminderTime: "09:00",
};

// Solicitar permissões de notificação
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

// Obter token de push notification
export async function getPushToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id", // Será configurado via app.config.ts
    });
    return token.data;
  } catch (error) {
    console.error("Erro ao obter push token:", error);
    return null;
  }
}

// Salvar configurações de notificação
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  await AsyncStorage.setItem("notificationSettings", JSON.stringify(settings));
}

// Carregar configurações de notificação
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem("notificationSettings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return DEFAULT_SETTINGS;
  }
}

// Agendar lembrete de treino
export async function scheduleWorkoutReminder(time: string): Promise<void> {
  if (Platform.OS === "web") return;

  // Cancelar lembretes anteriores
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [hours, minutes] = time.split(":").map(Number);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🏃 Hora do Treino!",
      body: "Não se esqueça de fazer seu treino hoje. Seu corpo agradece!",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });
}

// Agendar motivação diária
export async function scheduleDailyMotivation(): Promise<void> {
  if (Platform.OS === "web") return;

  const motivationalMessages = [
    "💪 Você está mais forte a cada dia!",
    "🌟 Seu progresso é incrível!",
    "🔥 Continue assim, campeão!",
    "⚡ Energia positiva para hoje!",
    "🎯 Foco nos seus objetivos!",
  ];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "HealthFit",
      body: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

// Enviar alerta de sinal vital anormal
export async function sendVitalSignAlert(type: string, value: number): Promise<void> {
  if (Platform.OS === "web") return;

  const settings = await loadNotificationSettings();
  if (!settings.vitalSignsAlerts) return;

  let message = "";
  let isAbnormal = false;

  switch (type) {
    case "bloodPressure":
      if (value > 140 || value < 90) {
        message = `⚠️ Pressão arterial ${value > 140 ? "alta" : "baixa"}: ${value} mmHg. Consulte um médico.`;
        isAbnormal = true;
      }
      break;
    case "glucose":
      if (value > 140 || value < 70) {
        message = `⚠️ Glicemia ${value > 140 ? "alta" : "baixa"}: ${value} mg/dL. Atenção necessária.`;
        isAbnormal = true;
      }
      break;
    case "heartRate":
      if (value > 100 || value < 60) {
        message = `⚠️ Frequência cardíaca ${value > 100 ? "elevada" : "baixa"}: ${value} bpm.`;
        isAbnormal = true;
      }
      break;
  }

  if (isAbnormal) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alerta de Saúde",
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // Enviar imediatamente
    });
  }
}

// Enviar notificação de conquista
export async function sendAchievementNotification(achievement: string): Promise<void> {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🏆 Nova Conquista!",
      body: achievement,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

// Inicializar notificações
export async function initializeNotifications(): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  
  if (!hasPermission) {
    console.log("Permissão de notificação negada");
    return;
  }

  const settings = await loadNotificationSettings();

  if (settings.workoutReminders) {
    await scheduleWorkoutReminder(settings.reminderTime);
  }

  if (settings.dailyMotivation) {
    await scheduleDailyMotivation();
  }
}
