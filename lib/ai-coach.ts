import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutPattern {
  averageFrequency: number; // treinos por semana
  averageDuration: number; // minutos
  averageDistance: number; // km
  averageCalories: number;
  preferredTime: "morning" | "afternoon" | "evening" | "night";
  preferredDays: number[]; // 0-6 (domingo-sábado)
  consistency: number; // 0-100
  progressionRate: number; // % de melhora por semana
}

export interface CoachingInsight {
  id: string;
  type: "warning" | "tip" | "achievement" | "suggestion";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  timestamp: Date;
  actionable?: {
    label: string;
    action: string;
  };
}

export interface PerformanceAnalysis {
  overall: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  recommendations: string[];
}

// Analisar padrões de treino
export async function analyzeWorkoutPatterns(days: number = 30): Promise<WorkoutPattern> {
  // Em produção, isso consultaria histórico real de treinos
  // Por enquanto, simula análise
  
  const workouts = await getRecentWorkouts(days);
  
  if (workouts.length === 0) {
    return {
      averageFrequency: 0,
      averageDuration: 0,
      averageDistance: 0,
      averageCalories: 0,
      preferredTime: "morning",
      preferredDays: [],
      consistency: 0,
      progressionRate: 0,
    };
  }
  
  // Calcular frequência (treinos por semana)
  const weeks = days / 7;
  const averageFrequency = workouts.length / weeks;
  
  // Calcular médias
  const averageDuration = workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length;
  const averageDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0) / workouts.length;
  const averageCalories = workouts.reduce((sum, w) => sum + w.calories, 0) / workouts.length;
  
  // Identificar horário preferido
  const timeDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  workouts.forEach(w => {
    const hour = new Date(w.date).getHours();
    if (hour >= 5 && hour < 12) timeDistribution.morning++;
    else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
    else if (hour >= 17 && hour < 21) timeDistribution.evening++;
    else timeDistribution.night++;
  });
  
  const preferredTime = Object.entries(timeDistribution).reduce((a, b) => 
    timeDistribution[a[0] as keyof typeof timeDistribution] > timeDistribution[b[0] as keyof typeof timeDistribution] ? a : b
  )[0] as "morning" | "afternoon" | "evening" | "night";
  
  // Identificar dias preferidos
  const dayDistribution = [0, 0, 0, 0, 0, 0, 0];
  workouts.forEach(w => {
    const day = new Date(w.date).getDay();
    dayDistribution[day]++;
  });
  
  const preferredDays = dayDistribution
    .map((count, day) => ({ day, count }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(d => d.day);
  
  // Calcular consistência (baseado em intervalos entre treinos)
  let consistency = 100;
  for (let i = 1; i < workouts.length; i++) {
    const daysBetween = Math.abs(
      (new Date(workouts[i].date).getTime() - new Date(workouts[i - 1].date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysBetween > 7) consistency -= 10;
    if (daysBetween > 14) consistency -= 20;
  }
  consistency = Math.max(0, consistency);
  
  // Calcular taxa de progressão
  const firstHalf = workouts.slice(0, Math.floor(workouts.length / 2));
  const secondHalf = workouts.slice(Math.floor(workouts.length / 2));
  
  const avgFirst = firstHalf.reduce((sum, w) => sum + (w.distance || w.duration), 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, w) => sum + (w.distance || w.duration), 0) / secondHalf.length;
  
  const progressionRate = avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;
  
  return {
    averageFrequency,
    averageDuration,
    averageDistance,
    averageCalories,
    preferredTime,
    preferredDays,
    consistency,
    progressionRate,
  };
}

// Gerar insights de coaching
export async function generateCoachingInsights(): Promise<CoachingInsight[]> {
  const patterns = await analyzeWorkoutPatterns();
  const insights: CoachingInsight[] = [];
  
  // Análise de frequência
  if (patterns.averageFrequency < 2) {
    insights.push({
      id: "low_frequency",
      type: "warning",
      title: "Frequência Baixa",
      message: `Você está treinando ${patterns.averageFrequency.toFixed(1)}x por semana. Para melhores resultados, tente aumentar para 3-4x.`,
      priority: "high",
      timestamp: new Date(),
      actionable: {
        label: "Ver Planos de Treino",
        action: "navigate_workout_plans",
      },
    });
  } else if (patterns.averageFrequency >= 5) {
    insights.push({
      id: "high_frequency",
      type: "achievement",
      title: "Consistência Excelente!",
      message: `Parabéns! Você está treinando ${patterns.averageFrequency.toFixed(1)}x por semana. Continue assim!`,
      priority: "low",
      timestamp: new Date(),
    });
  }
  
  // Análise de consistência
  if (patterns.consistency < 50) {
    insights.push({
      id: "low_consistency",
      type: "warning",
      title: "Intervalos Irregulares",
      message: "Seus treinos estão muito espaçados. Tente manter intervalos mais regulares para melhores resultados.",
      priority: "high",
      timestamp: new Date(),
      actionable: {
        label: "Ativar Lembretes",
        action: "enable_reminders",
      },
    });
  }
  
  // Análise de progressão
  if (patterns.progressionRate < -10) {
    insights.push({
      id: "declining_performance",
      type: "warning",
      title: "Desempenho em Queda",
      message: "Seu desempenho diminuiu nas últimas semanas. Considere revisar sua rotina de treino e descanso.",
      priority: "high",
      timestamp: new Date(),
      actionable: {
        label: "Falar com Coach IA",
        action: "open_ai_chat",
      },
    });
  } else if (patterns.progressionRate > 10) {
    insights.push({
      id: "improving_performance",
      type: "achievement",
      title: "Progresso Incrível!",
      message: `Seu desempenho melhorou ${patterns.progressionRate.toFixed(1)}%! Continue nesse ritmo!`,
      priority: "low",
      timestamp: new Date(),
    });
  }
  
  // Dicas baseadas em horário
  if (patterns.preferredTime === "night") {
    insights.push({
      id: "late_workouts",
      type: "tip",
      title: "Treinos Noturnos",
      message: "Treinar à noite pode afetar seu sono. Se possível, tente treinar até 3h antes de dormir.",
      priority: "medium",
      timestamp: new Date(),
    });
  }
  
  // Sugestões de melhoria
  if (patterns.averageDuration < 30) {
    insights.push({
      id: "short_workouts",
      type: "suggestion",
      title: "Aumente a Duração",
      message: "Seus treinos duram em média ${patterns.averageDuration.toFixed(0)} minutos. Tente aumentar gradualmente para 45-60 minutos.",
      priority: "medium",
      timestamp: new Date(),
    });
  }
  
  return insights;
}

// Analisar desempenho geral
export async function analyzePerformance(): Promise<PerformanceAnalysis> {
  const patterns = await analyzeWorkoutPatterns();
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Avaliar pontos fortes
  if (patterns.averageFrequency >= 4) {
    strengths.push("Frequência de treino excelente");
  }
  if (patterns.consistency >= 70) {
    strengths.push("Alta consistência nos treinos");
  }
  if (patterns.progressionRate > 5) {
    strengths.push("Progresso constante no desempenho");
  }
  if (patterns.averageDuration >= 45) {
    strengths.push("Duração adequada dos treinos");
  }
  
  // Avaliar pontos fracos
  if (patterns.averageFrequency < 3) {
    weaknesses.push("Frequência de treino abaixo do ideal");
  }
  if (patterns.consistency < 50) {
    weaknesses.push("Falta de consistência nos intervalos");
  }
  if (patterns.progressionRate < 0) {
    weaknesses.push("Desempenho em declínio");
  }
  if (patterns.averageDuration < 30) {
    weaknesses.push("Treinos muito curtos");
  }
  
  // Calcular score geral
  let overall = 50; // Base
  overall += Math.min(patterns.averageFrequency * 5, 20); // +20 máximo
  overall += Math.min(patterns.consistency * 0.2, 20); // +20 máximo
  overall += Math.min(patterns.progressionRate, 10); // +10 máximo
  overall = Math.max(0, Math.min(100, overall));
  
  // Gerar recomendações
  const recommendations: string[] = [];
  
  if (patterns.averageFrequency < 3) {
    recommendations.push("Aumente a frequência de treinos para 3-4x por semana");
  }
  if (patterns.consistency < 70) {
    recommendations.push("Mantenha intervalos regulares entre os treinos (2-3 dias)");
  }
  if (patterns.progressionRate < 5) {
    recommendations.push("Aumente gradualmente a intensidade ou duração dos treinos");
  }
  if (patterns.averageDuration < 45) {
    recommendations.push("Estenda seus treinos para 45-60 minutos para melhores resultados");
  }
  
  recommendations.push("Combine diferentes tipos de treino (cardio, força, flexibilidade)");
  recommendations.push("Garanta 7-8 horas de sono por noite para recuperação adequada");
  
  return {
    overall: Math.round(overall),
    strengths,
    weaknesses,
    trends: {
      improving: patterns.progressionRate > 0 ? ["Desempenho geral"] : [],
      declining: patterns.progressionRate < 0 ? ["Desempenho geral"] : [],
      stable: patterns.progressionRate === 0 ? ["Desempenho geral"] : [],
    },
    recommendations,
  };
}

// Feedback em tempo real durante treino
export async function getRealtimeFeedback(workout: {
  duration: number;
  distance?: number;
  pace?: number;
  heartRate?: number;
}): Promise<string[]> {
  const feedback: string[] = [];
  
  // Análise de pace
  if (workout.pace) {
    if (workout.pace < 4) {
      feedback.push("🔥 Ritmo excelente! Mantenha esse pace!");
    } else if (workout.pace > 7) {
      feedback.push("💪 Ritmo moderado. Tente acelerar um pouco se possível.");
    }
  }
  
  // Análise de frequência cardíaca
  if (workout.heartRate) {
    if (workout.heartRate > 180) {
      feedback.push("⚠️ Frequência cardíaca muito alta! Reduza a intensidade.");
    } else if (workout.heartRate > 160) {
      feedback.push("🔥 Zona de alta intensidade! Ótimo para queima de gordura.");
    } else if (workout.heartRate < 100) {
      feedback.push("💡 Frequência cardíaca baixa. Aumente a intensidade para melhores resultados.");
    }
  }
  
  // Análise de duração
  if (workout.duration >= 30 && workout.duration % 10 === 0) {
    feedback.push(`⏱️ ${workout.duration} minutos! Continue assim!`);
  }
  
  // Análise de distância
  if (workout.distance) {
    if (workout.distance >= 5) {
      feedback.push(`🎯 ${workout.distance.toFixed(1)}km percorridos! Excelente!`);
    }
  }
  
  return feedback;
}

// Sugerir próximo treino
export async function suggestNextWorkout(): Promise<{
  type: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  reason: string;
}> {
  const patterns = await analyzeWorkoutPatterns(14); // Últimas 2 semanas
  const lastWorkout = await getLastWorkout();
  
  // Calcular dias desde último treino
  const daysSinceLastWorkout = lastWorkout
    ? Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24))
    : 7;
  
  // Lógica de sugestão
  if (daysSinceLastWorkout >= 3) {
    return {
      type: "Corrida Leve",
      duration: 30,
      intensity: "low",
      reason: "Você está há alguns dias sem treinar. Comece com algo leve para retomar o ritmo.",
    };
  }
  
  if (patterns.progressionRate < 0) {
    return {
      type: "Treino de Força",
      duration: 45,
      intensity: "medium",
      reason: "Seu desempenho está em queda. Um treino de força pode ajudar a recuperar.",
    };
  }
  
  if (patterns.averageDuration < 40) {
    return {
      type: "Cardio Moderado",
      duration: 50,
      intensity: "medium",
      reason: "Seus treinos têm sido curtos. Tente aumentar a duração gradualmente.",
    };
  }
  
  return {
    type: "HIIT",
    duration: 30,
    intensity: "high",
    reason: "Você está consistente! Desafie-se com um treino de alta intensidade.",
  };
}

// Funções auxiliares (simuladas)
async function getRecentWorkouts(days: number): Promise<any[]> {
  // Em produção, consultaria AsyncStorage ou backend
  return [];
}

async function getLastWorkout(): Promise<any | null> {
  // Em produção, consultaria AsyncStorage ou backend
  return null;
}
