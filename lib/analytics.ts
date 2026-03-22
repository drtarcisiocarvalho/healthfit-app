import { Platform } from "react-native";

// Analytics service para rastreamento de eventos
// Em produção, isso usaria Firebase Analytics ou similar

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  timestamp: Date;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  // Inicializar analytics
  async initialize() {
    console.log("📊 Analytics inicializado");
    // Em produção: await analytics().setAnalyticsCollectionEnabled(true);
  }

  // Rastrear evento
  logEvent(eventName: string, params?: Record<string, any>) {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      params: {
        ...params,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };

    this.events.push(event);
    console.log(`📊 Event: ${eventName}`, params);

    // Em produção: await analytics().logEvent(eventName, params);
  }

  // Rastrear tela visualizada
  logScreenView(screenName: string, screenClass?: string) {
    this.logEvent("screen_view", {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  // Rastrear login
  logLogin(method: string) {
    this.logEvent("login", { method });
  }

  // Rastrear cadastro
  logSignUp(method: string) {
    this.logEvent("sign_up", { method });
  }

  // Rastrear treino iniciado
  logWorkoutStarted(workoutType: string) {
    this.logEvent("workout_started", {
      workout_type: workoutType,
    });
  }

  // Rastrear treino concluído
  logWorkoutCompleted(workoutType: string, duration: number, distance?: number) {
    this.logEvent("workout_completed", {
      workout_type: workoutType,
      duration_minutes: Math.round(duration / 60),
      distance_km: distance ? Math.round(distance / 1000 * 10) / 10 : undefined,
    });
  }

  // Rastrear refeição registrada
  logMealLogged(mealType: string, calories: number) {
    this.logEvent("meal_logged", {
      meal_type: mealType,
      calories,
    });
  }

  // Rastrear consulta agendada
  logAppointmentBooked(professionalType: string, price: number) {
    this.logEvent("appointment_booked", {
      professional_type: professionalType,
      value: price,
      currency: "BRL",
    });
  }

  // Rastrear plano contratado
  logPlanPurchased(planId: string, price: number) {
    this.logEvent("purchase", {
      item_id: planId,
      value: price,
      currency: "BRL",
    });
  }

  // Rastrear badge desbloqueado
  logAchievementUnlocked(achievementId: string) {
    this.logEvent("unlock_achievement", {
      achievement_id: achievementId,
    });
  }

  // Rastrear nível alcançado
  logLevelUp(level: number) {
    this.logEvent("level_up", {
      level,
      character: "user",
    });
  }

  // Rastrear compartilhamento
  logShare(contentType: string, method: string) {
    this.logEvent("share", {
      content_type: contentType,
      method,
    });
  }

  // Rastrear busca
  logSearch(searchTerm: string) {
    this.logEvent("search", {
      search_term: searchTerm,
    });
  }

  // Definir propriedades do usuário
  setUserProperties(properties: Record<string, any>) {
    console.log("👤 User properties:", properties);
    // Em produção: await analytics().setUserProperties(properties);
  }

  // Definir ID do usuário
  setUserId(userId: string) {
    console.log("👤 User ID:", userId);
    // Em produção: await analytics().setUserId(userId);
  }

  // Obter eventos (para debug)
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  // Limpar eventos
  clearEvents() {
    this.events = [];
  }

  // Habilitar/desabilitar analytics
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    console.log(`📊 Analytics ${enabled ? "habilitado" : "desabilitado"}`);
  }
}

export const analytics = new AnalyticsService();
