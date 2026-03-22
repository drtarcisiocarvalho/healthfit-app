import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos de dados suportados
export enum HealthDataType {
  STEPS = "steps",
  DISTANCE = "distance",
  CALORIES = "calories",
  HEART_RATE = "heartRate",
  BLOOD_PRESSURE = "bloodPressure",
  WEIGHT = "weight",
  HEIGHT = "height",
  BODY_FAT = "bodyFat",
  SLEEP = "sleep",
  WORKOUT = "workout",
}

export interface HealthData {
  type: HealthDataType;
  value: number;
  unit: string;
  timestamp: Date;
  source: "appleHealth" | "googleFit" | "manual";
}

export interface HealthSyncData {
  steps: number;
  distance: number;
  calories: number;
  weight: number | null;
  timestamp: string;
}

// Verificar se Apple Health está disponível
export async function isAppleHealthAvailable(): Promise<boolean> {
  // Apple Health só está disponível no iOS
  return Platform.OS === "ios";
}

// Verificar se Google Fit está disponível
export async function isGoogleFitAvailable(): Promise<boolean> {
  // Google Fit só está disponível no Android
  return Platform.OS === "android";
}

// Inicializar integração de saúde
export async function initializeHealthSync(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  // Verificar se já foi inicializado
  const initialized = await AsyncStorage.getItem("healthSyncInitialized");
  if (initialized === "true") {
    return true;
  }

  // Marcar como inicializado
  await AsyncStorage.setItem("healthSyncInitialized", "true");
  return true;
}

// Solicitar permissões
export async function requestHealthPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  // Em produção, aqui seria chamado o método real de permissões
  // Por enquanto, simulamos sucesso
  await AsyncStorage.setItem("healthPermissionsGranted", "true");
  return true;
}

// Obter dados do dia (simulado - em produção usaria APIs nativas)
export async function getTodayHealthData(): Promise<{
  steps: number;
  distance: number;
  calories: number;
}> {
  // Em produção, isso consultaria Apple Health ou Google Fit
  // Por enquanto, retorna dados simulados ou do cache
  try {
    const cached = await AsyncStorage.getItem("lastHealthSync");
    if (cached) {
      const data = JSON.parse(cached);
      return {
        steps: data.steps || 0,
        distance: data.distance || 0,
        calories: data.calories || 0,
      };
    }
  } catch (error) {
    console.error("Erro ao obter dados de saúde:", error);
  }

  return { steps: 0, distance: 0, calories: 0 };
}

// Obter peso mais recente
export async function getLatestWeight(): Promise<number | null> {
  try {
    const cached = await AsyncStorage.getItem("lastHealthSync");
    if (cached) {
      const data = JSON.parse(cached);
      return data.weight || null;
    }
  } catch (error) {
    console.error("Erro ao obter peso:", error);
  }

  return null;
}

// Salvar treino no app de saúde nativo
export async function saveWorkoutToHealth(workout: {
  type: string;
  duration: number;
  distance?: number;
  calories: number;
  startDate: Date;
}): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  // Em produção, isso salvaria no Apple Health ou Google Fit
  console.log("Treino salvo no app de saúde:", workout);
  return true;
}

// Sincronizar dados do dia
export async function syncTodayData(): Promise<HealthSyncData> {
  const healthData = await getTodayHealthData();
  const weight = await getLatestWeight();

  const syncData: HealthSyncData = {
    steps: healthData.steps,
    distance: healthData.distance,
    calories: healthData.calories,
    weight,
    timestamp: new Date().toISOString(),
  };

  // Salvar dados sincronizados
  await AsyncStorage.setItem("lastHealthSync", JSON.stringify(syncData));

  return syncData;
}

// Verificar se sincronização está ativada
export async function isHealthSyncEnabled(): Promise<boolean> {
  try {
    const enabled = await AsyncStorage.getItem("healthSyncEnabled");
    return enabled === "true";
  } catch (error) {
    return false;
  }
}

// Ativar/desativar sincronização
export async function setHealthSyncEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem("healthSyncEnabled", enabled ? "true" : "false");
  
  if (enabled) {
    // Inicializar e solicitar permissões
    await initializeHealthSync();
    await requestHealthPermissions();
  }
}

// Obter última sincronização
export async function getLastSync(): Promise<Date | null> {
  try {
    const data = await AsyncStorage.getItem("lastHealthSync");
    if (data) {
      const parsed: HealthSyncData = JSON.parse(data);
      return new Date(parsed.timestamp);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Obter dados da última sincronização
export async function getLastSyncData(): Promise<HealthSyncData | null> {
  try {
    const data = await AsyncStorage.getItem("lastHealthSync");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Importar treinos do app de saúde
export async function importWorkoutsFromHealth(days: number = 7): Promise<any[]> {
  // Em produção, isso consultaria os treinos do Apple Health ou Google Fit
  // Por enquanto, retorna array vazio
  return [];
}

// Exportar dados de saúde
export async function exportHealthData(): Promise<HealthData[]> {
  const syncData = await getLastSyncData();
  if (!syncData) {
    return [];
  }

  const healthDataArray: HealthData[] = [];
  const timestamp = new Date(syncData.timestamp);

  if (syncData.steps > 0) {
    healthDataArray.push({
      type: HealthDataType.STEPS,
      value: syncData.steps,
      unit: "steps",
      timestamp,
      source: Platform.OS === "ios" ? "appleHealth" : "googleFit",
    });
  }

  if (syncData.distance > 0) {
    healthDataArray.push({
      type: HealthDataType.DISTANCE,
      value: syncData.distance,
      unit: "km",
      timestamp,
      source: Platform.OS === "ios" ? "appleHealth" : "googleFit",
    });
  }

  if (syncData.calories > 0) {
    healthDataArray.push({
      type: HealthDataType.CALORIES,
      value: syncData.calories,
      unit: "kcal",
      timestamp,
      source: Platform.OS === "ios" ? "appleHealth" : "googleFit",
    });
  }

  if (syncData.weight) {
    healthDataArray.push({
      type: HealthDataType.WEIGHT,
      value: syncData.weight,
      unit: "kg",
      timestamp,
      source: Platform.OS === "ios" ? "appleHealth" : "googleFit",
    });
  }

  return healthDataArray;
}
