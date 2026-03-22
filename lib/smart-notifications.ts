import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class SmartNotifications {
  private static instance: SmartNotifications;

  private constructor() {}

  static getInstance(): SmartNotifications {
    if (!SmartNotifications.instance) {
      SmartNotifications.instance = new SmartNotifications();
    }
    return SmartNotifications.instance;
  }

  async checkAndScheduleIntelligent() {
    const workoutsData = await AsyncStorage.getItem("workouts");
    const workouts = workoutsData ? JSON.parse(workoutsData) : [];

    // Check last workout date
    if (workouts.length > 0) {
      const lastWorkout = workouts[workouts.length - 1];
      const lastWorkoutDate = new Date(lastWorkout.date);
      const daysSinceLastWorkout = Math.floor(
        (Date.now() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // If no workout in 2 days, send reminder
      if (daysSinceLastWorkout >= 2) {
        await this.scheduleWorkoutReminder();
      }
    }

    // Check for intense workouts and suggest supplements
    const recentWorkouts = workouts.slice(-3);
    const hasIntenseWorkout = recentWorkouts.some(
      (w: any) => w.calories && w.calories > 400
    );

    if (hasIntenseWorkout) {
      await this.scheduleSupplementSuggestion();
    }

    // Check sleep quality
    const sleepData = await AsyncStorage.getItem("sleepRecords");
    const sleepRecords = sleepData ? JSON.parse(sleepData) : [];

    if (sleepRecords.length > 0) {
      const lastSleep = sleepRecords[sleepRecords.length - 1];
      if (lastSleep.quality === "poor" || lastSleep.duration < 6) {
        await this.scheduleSleepTip();
      }
    }
  }

  private async scheduleWorkoutReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏃‍♂️ Hora de se Movimentar!",
        body: "Você não treina há 2 dias. Que tal uma caminhada rápida de 20 minutos?",
        data: { type: "workout_reminder" },
      },
      trigger: null,
    });
  }

  private async scheduleSupplementSuggestion() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💪 Potencialize Seus Resultados",
        body: "Treino intenso detectado! Confira suplementos para recuperação muscular na loja.",
        data: { type: "supplement_suggestion", route: "/store" },
      },
      trigger: null,
    });
  }

  private async scheduleSleepTip() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "😴 Melhore Seu Sono",
        body: "Sono irregular detectado. Veja dicas personalizadas para melhorar sua qualidade de sono.",
        data: { type: "sleep_tip", route: "/sleep" },
      },
      trigger: null,
    });
  }

  async scheduleMotivationalNotification() {
    const messages = [
      {
        title: "🔥 Continue Firme!",
        body: "Você está fazendo um ótimo trabalho. Cada treino te aproxima do seu objetivo!",
      },
      {
        title: "💪 Força e Foco",
        body: "Grandes resultados vêm de pequenas ações diárias. Continue assim!",
      },
      {
        title: "⭐ Você é Incrível",
        body: "Sua dedicação é inspiradora. Mantenha o ritmo e os resultados virão!",
      },
      {
        title: "🎯 Foco no Objetivo",
        body: "Lembre-se: você começou por um motivo. Não desista agora!",
      },
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        data: { type: "motivational" },
      },
      trigger: null,
    });
  }

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const smartNotifications = SmartNotifications.getInstance();
