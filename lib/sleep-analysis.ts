import AsyncStorage from "@react-native-async-storage/async-storage";

export enum SleepStage {
  AWAKE = "awake",
  LIGHT = "light",
  DEEP = "deep",
  REM = "rem",
}

export interface SleepCycle {
  stage: SleepStage;
  startTime: Date;
  endTime: Date;
  duration: number; // em minutos
}

export interface SleepSession {
  id: string;
  date: Date;
  bedTime: Date;
  wakeTime: Date;
  totalDuration: number; // em minutos
  sleepDuration: number; // tempo real dormindo
  cycles: SleepCycle[];
  quality: number; // 0-100
  interruptions: number;
  heartRateAvg?: number;
  heartRateMin?: number;
  heartRateMax?: number;
  respiratoryRate?: number;
  notes?: string;
}

export interface SleepInsights {
  averageQuality: number;
  averageDuration: number;
  averageBedTime: string;
  averageWakeTime: string;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  lightSleepPercentage: number;
  consistency: number; // 0-100
  recommendations: string[];
}

// Gerar ciclos de sono simulados (em produção viria de wearable)
function generateSleepCycles(bedTime: Date, wakeTime: Date): SleepCycle[] {
  const cycles: SleepCycle[] = [];
  const totalMinutes = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60);
  
  let currentTime = new Date(bedTime);
  let minutesProcessed = 0;
  
  // Padrão típico de ciclos de sono (90 minutos cada)
  const cyclePattern = [
    { stage: SleepStage.LIGHT, duration: 10 },
    { stage: SleepStage.DEEP, duration: 20 },
    { stage: SleepStage.LIGHT, duration: 30 },
    { stage: SleepStage.REM, duration: 20 },
    { stage: SleepStage.LIGHT, duration: 10 },
  ];
  
  while (minutesProcessed < totalMinutes) {
    for (const pattern of cyclePattern) {
      if (minutesProcessed >= totalMinutes) break;
      
      const duration = Math.min(pattern.duration, totalMinutes - minutesProcessed);
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime.getTime() + duration * 60 * 1000);
      
      cycles.push({
        stage: pattern.stage,
        startTime,
        endTime,
        duration,
      });
      
      currentTime = endTime;
      minutesProcessed += duration;
    }
  }
  
  return cycles;
}

// Calcular qualidade do sono
function calculateSleepQuality(session: SleepSession): number {
  let quality = 100;
  
  // Penalizar por duração inadequada (ideal: 7-9h)
  const hours = session.sleepDuration / 60;
  if (hours < 6) quality -= (6 - hours) * 10;
  if (hours > 9) quality -= (hours - 9) * 5;
  
  // Penalizar por interrupções
  quality -= session.interruptions * 5;
  
  // Bonus por sono profundo adequado (20-25% é ideal)
  const deepPercentage = (session.cycles
    .filter(c => c.stage === SleepStage.DEEP)
    .reduce((sum, c) => sum + c.duration, 0) / session.sleepDuration) * 100;
  
  if (deepPercentage < 15) quality -= 10;
  if (deepPercentage > 30) quality -= 5;
  
  // Bonus por REM adequado (20-25% é ideal)
  const remPercentage = (session.cycles
    .filter(c => c.stage === SleepStage.REM)
    .reduce((sum, c) => sum + c.duration, 0) / session.sleepDuration) * 100;
  
  if (remPercentage < 15) quality -= 10;
  if (remPercentage > 30) quality -= 5;
  
  return Math.max(0, Math.min(100, quality));
}

// Registrar sessão de sono
export async function recordSleepSession(
  bedTime: Date,
  wakeTime: Date,
  interruptions: number = 0,
  notes?: string
): Promise<SleepSession> {
  const totalDuration = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60);
  const sleepDuration = totalDuration - (interruptions * 10); // Estima 10min por interrupção
  
  const cycles = generateSleepCycles(bedTime, wakeTime);
  
  const session: SleepSession = {
    id: Date.now().toString(),
    date: new Date(bedTime.toDateString()),
    bedTime,
    wakeTime,
    totalDuration,
    sleepDuration,
    cycles,
    quality: 0,
    interruptions,
    notes,
  };
  
  session.quality = calculateSleepQuality(session);
  
  // Salvar sessão
  const sessions = await getAllSleepSessions();
  sessions.push(session);
  await AsyncStorage.setItem("sleepSessions", JSON.stringify(sessions));
  
  return session;
}

// Obter todas as sessões de sono
export async function getAllSleepSessions(): Promise<SleepSession[]> {
  try {
    const stored = await AsyncStorage.getItem("sleepSessions");
    if (stored) {
      const sessions = JSON.parse(stored);
      // Converter strings para Date
      return sessions.map((s: any) => ({
        ...s,
        date: new Date(s.date),
        bedTime: new Date(s.bedTime),
        wakeTime: new Date(s.wakeTime),
        cycles: s.cycles.map((c: any) => ({
          ...c,
          startTime: new Date(c.startTime),
          endTime: new Date(c.endTime),
        })),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar sessões de sono:", error);
  }
  return [];
}

// Obter sessões dos últimos N dias
export async function getRecentSleepSessions(days: number = 7): Promise<SleepSession[]> {
  const all = await getAllSleepSessions();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return all
    .filter(s => s.date >= cutoffDate)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Calcular insights de sono
export async function getSleepInsights(days: number = 30): Promise<SleepInsights> {
  const sessions = await getRecentSleepSessions(days);
  
  if (sessions.length === 0) {
    return {
      averageQuality: 0,
      averageDuration: 0,
      averageBedTime: "00:00",
      averageWakeTime: "00:00",
      deepSleepPercentage: 0,
      remSleepPercentage: 0,
      lightSleepPercentage: 0,
      consistency: 0,
      recommendations: ["Registre pelo menos 7 dias de sono para receber insights personalizados."],
    };
  }
  
  // Calcular médias
  const avgQuality = sessions.reduce((sum, s) => sum + s.quality, 0) / sessions.length;
  const avgDuration = sessions.reduce((sum, s) => sum + s.sleepDuration, 0) / sessions.length;
  
  // Calcular horários médios
  const avgBedTimeMinutes = sessions.reduce((sum, s) => {
    const hours = s.bedTime.getHours();
    const minutes = s.bedTime.getMinutes();
    return sum + (hours * 60 + minutes);
  }, 0) / sessions.length;
  
  const avgWakeTimeMinutes = sessions.reduce((sum, s) => {
    const hours = s.wakeTime.getHours();
    const minutes = s.wakeTime.getMinutes();
    return sum + (hours * 60 + minutes);
  }, 0) / sessions.length;
  
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Calcular percentuais de estágios
  let totalDeep = 0;
  let totalRem = 0;
  let totalLight = 0;
  let totalSleep = 0;
  
  sessions.forEach(s => {
    s.cycles.forEach(c => {
      totalSleep += c.duration;
      if (c.stage === SleepStage.DEEP) totalDeep += c.duration;
      if (c.stage === SleepStage.REM) totalRem += c.duration;
      if (c.stage === SleepStage.LIGHT) totalLight += c.duration;
    });
  });
  
  const deepPercentage = (totalDeep / totalSleep) * 100;
  const remPercentage = (totalRem / totalSleep) * 100;
  const lightPercentage = (totalLight / totalSleep) * 100;
  
  // Calcular consistência (variação nos horários)
  const bedTimeVariance = sessions.reduce((sum, s) => {
    const hours = s.bedTime.getHours();
    const minutes = s.bedTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return sum + Math.abs(totalMinutes - avgBedTimeMinutes);
  }, 0) / sessions.length;
  
  const consistency = Math.max(0, 100 - (bedTimeVariance / 60) * 10);
  
  // Gerar recomendações
  const recommendations: string[] = [];
  
  if (avgDuration < 420) { // < 7h
    recommendations.push("⏰ Tente dormir pelo menos 7 horas por noite para melhor recuperação.");
  }
  
  if (avgQuality < 70) {
    recommendations.push("💤 Sua qualidade de sono está abaixo do ideal. Evite cafeína 6h antes de dormir.");
  }
  
  if (deepPercentage < 15) {
    recommendations.push("🌙 Aumente seu sono profundo: evite telas 1h antes de dormir e mantenha o quarto escuro.");
  }
  
  if (remPercentage < 15) {
    recommendations.push("🧠 Sono REM baixo pode afetar memória. Mantenha horários regulares e evite álcool.");
  }
  
  if (consistency < 70) {
    recommendations.push("📅 Melhore a consistência dormindo e acordando no mesmo horário todos os dias.");
  }
  
  if (sessions.some(s => s.interruptions > 3)) {
    recommendations.push("🔕 Reduza interrupções: silencie notificações e mantenha temperatura confortável (18-21°C).");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("✨ Excelente! Seu padrão de sono está ótimo. Continue assim!");
  }
  
  return {
    averageQuality: Math.round(avgQuality),
    averageDuration: Math.round(avgDuration),
    averageBedTime: formatTime(avgBedTimeMinutes),
    averageWakeTime: formatTime(avgWakeTimeMinutes),
    deepSleepPercentage: Math.round(deepPercentage),
    remSleepPercentage: Math.round(remPercentage),
    lightSleepPercentage: Math.round(lightPercentage),
    consistency: Math.round(consistency),
    recommendations,
  };
}

// Obter melhor horário para acordar (fim de ciclo)
export function getOptimalWakeTime(bedTime: Date): Date[] {
  const optimalTimes: Date[] = [];
  
  // Ciclos de 90 minutos
  for (let cycles = 4; cycles <= 6; cycles++) {
    const wakeTime = new Date(bedTime.getTime() + cycles * 90 * 60 * 1000);
    optimalTimes.push(wakeTime);
  }
  
  return optimalTimes;
}

// Calcular déficit de sono
export async function getSleepDebt(days: number = 7): Promise<number> {
  const sessions = await getRecentSleepSessions(days);
  const idealMinutesPerNight = 480; // 8 horas
  
  const totalDebt = sessions.reduce((debt, s) => {
    const deficit = idealMinutesPerNight - s.sleepDuration;
    return debt + (deficit > 0 ? deficit : 0);
  }, 0);
  
  return Math.round(totalDebt);
}

// Exportar dados de sono
export async function exportSleepData(): Promise<string> {
  const sessions = await getAllSleepSessions();
  
  let csv = "Data,Horário Dormir,Horário Acordar,Duração Total (min),Duração Sono (min),Qualidade,Interrupções,Sono Profundo (%),REM (%),Sono Leve (%)\n";
  
  sessions.forEach(s => {
    const deepPercentage = (s.cycles
      .filter(c => c.stage === SleepStage.DEEP)
      .reduce((sum, c) => sum + c.duration, 0) / s.sleepDuration) * 100;
    
    const remPercentage = (s.cycles
      .filter(c => c.stage === SleepStage.REM)
      .reduce((sum, c) => sum + c.duration, 0) / s.sleepDuration) * 100;
    
    const lightPercentage = (s.cycles
      .filter(c => c.stage === SleepStage.LIGHT)
      .reduce((sum, c) => sum + c.duration, 0) / s.sleepDuration) * 100;
    
    csv += `${s.date.toLocaleDateString()},`;
    csv += `${s.bedTime.toLocaleTimeString()},`;
    csv += `${s.wakeTime.toLocaleTimeString()},`;
    csv += `${s.totalDuration},`;
    csv += `${s.sleepDuration},`;
    csv += `${s.quality},`;
    csv += `${s.interruptions},`;
    csv += `${deepPercentage.toFixed(1)},`;
    csv += `${remPercentage.toFixed(1)},`;
    csv += `${lightPercentage.toFixed(1)}\n`;
  });
  
  return csv;
}
