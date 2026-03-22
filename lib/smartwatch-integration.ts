import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SmartwatchData {
  heartRate?: number;
  steps?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
  timestamp: Date;
}

export interface SmartwatchDevice {
  id: string;
  name: string;
  type: "apple_watch" | "wear_os" | "fitbit" | "garmin";
  connected: boolean;
  batteryLevel?: number;
  lastSync?: Date;
}

// Verificar se smartwatch está disponível
export async function isSmartwatchAvailable(): Promise<boolean> {
  if (Platform.OS === "ios") {
    // Em produção, verificaria disponibilidade do Apple Watch via HealthKit
    return true;
  } else if (Platform.OS === "android") {
    // Em produção, verificaria disponibilidade do Wear OS via Google Fit
    return true;
  }
  return false;
}

// Conectar com smartwatch
export async function connectSmartwatch(): Promise<{
  success: boolean;
  device?: SmartwatchDevice;
  error?: string;
}> {
  try {
    console.log("🔗 Conectando com smartwatch...");
    
    // Simular conexão
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const device: SmartwatchDevice = {
      id: `watch_${Date.now()}`,
      name: Platform.OS === "ios" ? "Apple Watch Series 9" : "Galaxy Watch 6",
      type: Platform.OS === "ios" ? "apple_watch" : "wear_os",
      connected: true,
      batteryLevel: 85,
      lastSync: new Date(),
    };
    
    await AsyncStorage.setItem("connectedSmartwatch", JSON.stringify(device));
    
    console.log("✅ Smartwatch conectado:", device.name);
    
    return { success: true, device };
  } catch (error) {
    console.error("❌ Erro ao conectar smartwatch:", error);
    return {
      success: false,
      error: "Não foi possível conectar ao smartwatch. Verifique se está pareado e tente novamente.",
    };
  }
}

// Desconectar smartwatch
export async function disconnectSmartwatch(): Promise<void> {
  await AsyncStorage.removeItem("connectedSmartwatch");
  console.log("🔌 Smartwatch desconectado");
}

// Obter dispositivo conectado
export async function getConnectedSmartwatch(): Promise<SmartwatchDevice | null> {
  try {
    const stored = await AsyncStorage.getItem("connectedSmartwatch");
    if (stored) {
      const device = JSON.parse(stored);
      return {
        ...device,
        lastSync: device.lastSync ? new Date(device.lastSync) : undefined,
      };
    }
  } catch (error) {
    console.error("Erro ao carregar smartwatch:", error);
  }
  return null;
}

// Sincronizar dados do smartwatch
export async function syncSmartwatchData(): Promise<SmartwatchData | null> {
  const device = await getConnectedSmartwatch();
  
  if (!device || !device.connected) {
    console.log("⚠️ Nenhum smartwatch conectado");
    return null;
  }
  
  try {
    console.log("🔄 Sincronizando dados do smartwatch...");
    
    // Em produção, isso consultaria HealthKit (iOS) ou Google Fit (Android)
    // Por enquanto, simula dados realistas
    
    const data: SmartwatchData = {
      heartRate: Math.floor(Math.random() * (180 - 60) + 60), // 60-180 bpm
      steps: Math.floor(Math.random() * 10000), // 0-10000 passos
      calories: Math.floor(Math.random() * 500), // 0-500 kcal
      distance: Math.random() * 8, // 0-8 km
      activeMinutes: Math.floor(Math.random() * 120), // 0-120 min
      timestamp: new Date(),
    };
    
    // Atualizar última sincronização
    device.lastSync = new Date();
    await AsyncStorage.setItem("connectedSmartwatch", JSON.stringify(device));
    
    // Salvar dados históricos
    await saveSmartwatchHistory(data);
    
    console.log("✅ Dados sincronizados:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Erro ao sincronizar dados:", error);
    return null;
  }
}

// Monitorar frequência cardíaca em tempo real
export async function startHeartRateMonitoring(
  callback: (heartRate: number) => void
): Promise<() => void> {
  const device = await getConnectedSmartwatch();
  
  if (!device || !device.connected) {
    throw new Error("Smartwatch não conectado");
  }
  
  console.log("❤️ Iniciando monitoramento de frequência cardíaca...");
  
  // Simular leituras em tempo real a cada 2 segundos
  const interval = setInterval(() => {
    const heartRate = Math.floor(Math.random() * (180 - 60) + 60);
    callback(heartRate);
  }, 2000);
  
  // Retornar função para parar monitoramento
  return () => {
    clearInterval(interval);
    console.log("⏹️ Monitoramento de frequência cardíaca parado");
  };
}

// Obter histórico de dados do smartwatch
export async function getSmartwatchHistory(days: number = 7): Promise<SmartwatchData[]> {
  try {
    const stored = await AsyncStorage.getItem("smartwatchHistory");
    if (stored) {
      const history = JSON.parse(stored);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return history
        .map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        .filter((item: SmartwatchData) => item.timestamp >= cutoffDate)
        .sort((a: SmartwatchData, b: SmartwatchData) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
    }
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
  }
  return [];
}

// Salvar dados no histórico
async function saveSmartwatchHistory(data: SmartwatchData): Promise<void> {
  try {
    const history = await getSmartwatchHistory(30); // Manter 30 dias
    history.unshift(data);
    
    // Limitar a 1000 registros
    const limited = history.slice(0, 1000);
    
    await AsyncStorage.setItem("smartwatchHistory", JSON.stringify(limited));
  } catch (error) {
    console.error("Erro ao salvar histórico:", error);
  }
}

// Calcular estatísticas do smartwatch
export async function getSmartwatchStats(days: number = 7): Promise<{
  avgHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
  totalSteps: number;
  totalCalories: number;
  totalDistance: number;
  totalActiveMinutes: number;
  avgStepsPerDay: number;
}> {
  const history = await getSmartwatchHistory(days);
  
  if (history.length === 0) {
    return {
      avgHeartRate: 0,
      maxHeartRate: 0,
      minHeartRate: 0,
      totalSteps: 0,
      totalCalories: 0,
      totalDistance: 0,
      totalActiveMinutes: 0,
      avgStepsPerDay: 0,
    };
  }
  
  const heartRates = history.filter(d => d.heartRate).map(d => d.heartRate!);
  const steps = history.filter(d => d.steps).map(d => d.steps!);
  const calories = history.filter(d => d.calories).map(d => d.calories!);
  const distances = history.filter(d => d.distance).map(d => d.distance!);
  const activeMinutes = history.filter(d => d.activeMinutes).map(d => d.activeMinutes!);
  
  return {
    avgHeartRate: heartRates.length > 0 
      ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
      : 0,
    maxHeartRate: heartRates.length > 0 ? Math.max(...heartRates) : 0,
    minHeartRate: heartRates.length > 0 ? Math.min(...heartRates) : 0,
    totalSteps: steps.reduce((a, b) => a + b, 0),
    totalCalories: calories.reduce((a, b) => a + b, 0),
    totalDistance: distances.reduce((a, b) => a + b, 0),
    totalActiveMinutes: activeMinutes.reduce((a, b) => a + b, 0),
    avgStepsPerDay: steps.length > 0 
      ? Math.round(steps.reduce((a, b) => a + b, 0) / days)
      : 0,
  };
}

// Configurar sincronização automática
export function setupAutoSync(intervalMinutes: number = 15): () => void {
  console.log(`⚙️ Configurando sincronização automática (${intervalMinutes} min)`);
  
  const interval = setInterval(async () => {
    const device = await getConnectedSmartwatch();
    if (device && device.connected) {
      await syncSmartwatchData();
    }
  }, intervalMinutes * 60 * 1000);
  
  // Retornar função de cleanup
  return () => {
    clearInterval(interval);
    console.log("⏹️ Sincronização automática parada");
  };
}

// Verificar permissões de saúde
export async function requestHealthPermissions(): Promise<boolean> {
  console.log("🔐 Solicitando permissões de saúde...");
  
  // Em produção, isso solicitaria permissões reais do HealthKit/Google Fit
  // Por enquanto, simula aprovação
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("✅ Permissões concedidas");
  return true;
}

// Exportar dados do smartwatch
export async function exportSmartwatchData(days: number = 30): Promise<string> {
  const history = await getSmartwatchHistory(days);
  const stats = await getSmartwatchStats(days);
  
  const exportData = {
    exportDate: new Date().toISOString(),
    period: `${days} days`,
    stats,
    history,
  };
  
  return JSON.stringify(exportData, null, 2);
}
