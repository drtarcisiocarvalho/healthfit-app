import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendAchievementNotification } from "./notifications";

// Tipos de badges
export enum BadgeType {
  FIRST_WORKOUT = "first_workout",
  WEEK_STREAK = "week_streak",
  MONTH_STREAK = "month_streak",
  DISTANCE_10KM = "distance_10km",
  DISTANCE_50KM = "distance_50km",
  DISTANCE_100KM = "distance_100km",
  WORKOUTS_10 = "workouts_10",
  WORKOUTS_50 = "workouts_50",
  WORKOUTS_100 = "workouts_100",
  CALORIES_1000 = "calories_1000",
  CALORIES_5000 = "calories_5000",
  CALORIES_10000 = "calories_10000",
  EARLY_BIRD = "early_bird",
  NIGHT_OWL = "night_owl",
  WEEKEND_WARRIOR = "weekend_warrior",
  HEALTH_MONITOR = "health_monitor",
  WEIGHT_GOAL = "weight_goal",
}

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalWorkouts: number;
  totalDistance: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  challenges: Challenge[];
}

// XP necessário para cada nível (progressão exponencial)
function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calcular nível baseado no XP total
function calculateLevel(totalXP: number): { level: number; xp: number; xpToNextLevel: number } {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = getXPForLevel(1);

  while (totalXP >= xpForNextLevel) {
    xpForCurrentLevel = xpForNextLevel;
    level++;
    xpForNextLevel = getXPForLevel(level);
  }

  return {
    level,
    xp: totalXP - xpForCurrentLevel,
    xpToNextLevel: xpForNextLevel - xpForCurrentLevel,
  };
}

// Definição de todos os badges
const ALL_BADGES: Badge[] = [
  {
    id: BadgeType.FIRST_WORKOUT,
    name: "Primeiro Passo",
    description: "Complete seu primeiro treino",
    icon: "🏃",
    xpReward: 50,
  },
  {
    id: BadgeType.WEEK_STREAK,
    name: "Semana Forte",
    description: "7 dias consecutivos de treino",
    icon: "🔥",
    xpReward: 200,
  },
  {
    id: BadgeType.MONTH_STREAK,
    name: "Mês Imparável",
    description: "30 dias consecutivos de treino",
    icon: "💪",
    xpReward: 1000,
  },
  {
    id: BadgeType.DISTANCE_10KM,
    name: "10km Conquistados",
    description: "Percorra 10km acumulados",
    icon: "🎯",
    xpReward: 100,
  },
  {
    id: BadgeType.DISTANCE_50KM,
    name: "Maratonista",
    description: "Percorra 50km acumulados",
    icon: "🏅",
    xpReward: 500,
  },
  {
    id: BadgeType.DISTANCE_100KM,
    name: "Ultra Maratonista",
    description: "Percorra 100km acumulados",
    icon: "🏆",
    xpReward: 1500,
  },
  {
    id: BadgeType.WORKOUTS_10,
    name: "Iniciante Dedicado",
    description: "Complete 10 treinos",
    icon: "⭐",
    xpReward: 150,
  },
  {
    id: BadgeType.WORKOUTS_50,
    name: "Atleta Consistente",
    description: "Complete 50 treinos",
    icon: "🌟",
    xpReward: 750,
  },
  {
    id: BadgeType.WORKOUTS_100,
    name: "Lenda do Fitness",
    description: "Complete 100 treinos",
    icon: "✨",
    xpReward: 2000,
  },
  {
    id: BadgeType.CALORIES_1000,
    name: "Queimador Iniciante",
    description: "Queime 1.000 calorias acumuladas",
    icon: "🔥",
    xpReward: 100,
  },
  {
    id: BadgeType.CALORIES_5000,
    name: "Fornalha Humana",
    description: "Queime 5.000 calorias acumuladas",
    icon: "🌋",
    xpReward: 500,
  },
  {
    id: BadgeType.CALORIES_10000,
    name: "Incinerador",
    description: "Queime 10.000 calorias acumuladas",
    icon: "☄️",
    xpReward: 1200,
  },
  {
    id: BadgeType.EARLY_BIRD,
    name: "Madrugador",
    description: "Complete 5 treinos antes das 7h",
    icon: "🌅",
    xpReward: 300,
  },
  {
    id: BadgeType.NIGHT_OWL,
    name: "Coruja Noturna",
    description: "Complete 5 treinos após as 21h",
    icon: "🦉",
    xpReward: 300,
  },
  {
    id: BadgeType.WEEKEND_WARRIOR,
    name: "Guerreiro de Fim de Semana",
    description: "Complete treinos em 4 fins de semana seguidos",
    icon: "⚔️",
    xpReward: 400,
  },
  {
    id: BadgeType.HEALTH_MONITOR,
    name: "Monitor de Saúde",
    description: "Registre sinais vitais por 7 dias seguidos",
    icon: "❤️",
    xpReward: 250,
  },
  {
    id: BadgeType.WEIGHT_GOAL,
    name: "Meta de Peso",
    description: "Alcance sua meta de peso",
    icon: "🎖️",
    xpReward: 500,
  },
];

// Obter progresso do usuário
export async function getUserProgress(): Promise<UserProgress> {
  try {
    const stored = await AsyncStorage.getItem("userProgress");
    if (stored) {
      const data = JSON.parse(stored);
      // Converter datas de string para Date
      if (data.badges) {
        data.badges = data.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
        }));
      }
      if (data.challenges) {
        data.challenges = data.challenges.map((challenge: any) => ({
          ...challenge,
          startDate: new Date(challenge.startDate),
          endDate: new Date(challenge.endDate),
        }));
      }
      return data;
    }
  } catch (error) {
    console.error("Erro ao carregar progresso:", error);
  }

  // Progresso inicial
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: getXPForLevel(1),
    totalWorkouts: 0,
    totalDistance: 0,
    totalCalories: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    challenges: generateWeeklyChallenges(),
  };
}

// Salvar progresso
async function saveProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem("userProgress", JSON.stringify(progress));
}

// Adicionar XP
export async function addXP(amount: number, reason: string): Promise<{ leveledUp: boolean; newLevel?: number }> {
  const progress = await getUserProgress();
  const oldLevel = progress.level;

  // Adicionar XP
  progress.xp += amount;

  // Verificar se subiu de nível
  while (progress.xp >= progress.xpToNextLevel) {
    progress.xp -= progress.xpToNextLevel;
    progress.level++;
    progress.xpToNextLevel = getXPForLevel(progress.level);
  }

  await saveProgress(progress);

  const leveledUp = progress.level > oldLevel;
  if (leveledUp) {
    await sendAchievementNotification(`🎉 Nível ${progress.level} alcançado! Continue assim!`);
  }

  return { leveledUp, newLevel: leveledUp ? progress.level : undefined };
}

// Desbloquear badge
export async function unlockBadge(badgeId: BadgeType): Promise<boolean> {
  const progress = await getUserProgress();

  // Verificar se já tem o badge
  if (progress.badges.some((b) => b.id === badgeId)) {
    return false;
  }

  // Encontrar badge
  const badge = ALL_BADGES.find((b) => b.id === badgeId);
  if (!badge) {
    return false;
  }

  // Adicionar badge
  const unlockedBadge = { ...badge, unlockedAt: new Date() };
  progress.badges.push(unlockedBadge);

  // Adicionar XP do badge
  await addXP(badge.xpReward, `Badge desbloqueado: ${badge.name}`);

  await saveProgress(progress);

  // Enviar notificação
  await sendAchievementNotification(`🏆 Badge desbloqueado: ${badge.icon} ${badge.name}!`);

  return true;
}

// Registrar treino completo
export async function recordWorkout(workout: {
  duration: number;
  distance: number;
  calories: number;
  date: Date;
}): Promise<void> {
  const progress = await getUserProgress();

  // Atualizar estatísticas
  progress.totalWorkouts++;
  progress.totalDistance += workout.distance;
  progress.totalCalories += workout.calories;

  // Atualizar streak
  const lastWorkout = await AsyncStorage.getItem("lastWorkoutDate");
  const today = new Date().toDateString();

  if (lastWorkout) {
    const lastDate = new Date(lastWorkout);
    const diffDays = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      progress.currentStreak++;
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }
    } else if (diffDays > 1) {
      progress.currentStreak = 1;
    }
  } else {
    progress.currentStreak = 1;
    progress.longestStreak = 1;
  }

  await AsyncStorage.setItem("lastWorkoutDate", today);

  // Adicionar XP base
  const xpGained = Math.floor(workout.duration * 2 + workout.calories * 0.1);
  await addXP(xpGained, "Treino completado");

  // Verificar badges
  await checkAndUnlockBadges(progress);

  // Atualizar desafios
  await updateChallenges(progress, workout);

  await saveProgress(progress);
}

// Verificar e desbloquear badges automaticamente
async function checkAndUnlockBadges(progress: UserProgress): Promise<void> {
  // Primeiro treino
  if (progress.totalWorkouts === 1) {
    await unlockBadge(BadgeType.FIRST_WORKOUT);
  }

  // Treinos totais
  if (progress.totalWorkouts === 10) {
    await unlockBadge(BadgeType.WORKOUTS_10);
  }
  if (progress.totalWorkouts === 50) {
    await unlockBadge(BadgeType.WORKOUTS_50);
  }
  if (progress.totalWorkouts === 100) {
    await unlockBadge(BadgeType.WORKOUTS_100);
  }

  // Distância
  if (progress.totalDistance >= 10) {
    await unlockBadge(BadgeType.DISTANCE_10KM);
  }
  if (progress.totalDistance >= 50) {
    await unlockBadge(BadgeType.DISTANCE_50KM);
  }
  if (progress.totalDistance >= 100) {
    await unlockBadge(BadgeType.DISTANCE_100KM);
  }

  // Calorias
  if (progress.totalCalories >= 1000) {
    await unlockBadge(BadgeType.CALORIES_1000);
  }
  if (progress.totalCalories >= 5000) {
    await unlockBadge(BadgeType.CALORIES_5000);
  }
  if (progress.totalCalories >= 10000) {
    await unlockBadge(BadgeType.CALORIES_10000);
  }

  // Streaks
  if (progress.currentStreak >= 7) {
    await unlockBadge(BadgeType.WEEK_STREAK);
  }
  if (progress.currentStreak >= 30) {
    await unlockBadge(BadgeType.MONTH_STREAK);
  }
}

// Gerar desafios semanais
function generateWeeklyChallenges(): Challenge[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return [
    {
      id: "weekly_workouts",
      name: "Treinos Semanais",
      description: "Complete 5 treinos esta semana",
      type: "weekly",
      target: 5,
      current: 0,
      xpReward: 300,
      startDate: startOfWeek,
      endDate: endOfWeek,
      completed: false,
    },
    {
      id: "weekly_distance",
      name: "Distância Semanal",
      description: "Percorra 20km esta semana",
      type: "weekly",
      target: 20,
      current: 0,
      xpReward: 400,
      startDate: startOfWeek,
      endDate: endOfWeek,
      completed: false,
    },
    {
      id: "weekly_calories",
      name: "Calorias Semanais",
      description: "Queime 2000 calorias esta semana",
      type: "weekly",
      target: 2000,
      current: 0,
      xpReward: 350,
      startDate: startOfWeek,
      endDate: endOfWeek,
      completed: false,
    },
  ];
}

// Atualizar desafios
async function updateChallenges(progress: UserProgress, workout: { distance: number; calories: number }): Promise<void> {
  let challengesUpdated = false;

  for (const challenge of progress.challenges) {
    if (challenge.completed) continue;

    // Verificar se o desafio expirou
    if (new Date() > challenge.endDate) {
      continue;
    }

    // Atualizar progresso do desafio
    switch (challenge.id) {
      case "weekly_workouts":
        challenge.current++;
        challengesUpdated = true;
        break;
      case "weekly_distance":
        challenge.current += workout.distance;
        challengesUpdated = true;
        break;
      case "weekly_calories":
        challenge.current += workout.calories;
        challengesUpdated = true;
        break;
    }

    // Verificar se completou
    if (challenge.current >= challenge.target && !challenge.completed) {
      challenge.completed = true;
      await addXP(challenge.xpReward, `Desafio completado: ${challenge.name}`);
      await sendAchievementNotification(`🎯 Desafio completado: ${challenge.name}!`);
    }
  }

  if (challengesUpdated) {
    await saveProgress(progress);
  }
}

// Obter todos os badges disponíveis
export function getAllBadges(): Badge[] {
  return ALL_BADGES;
}

// Obter badges desbloqueados
export async function getUnlockedBadges(): Promise<Badge[]> {
  const progress = await getUserProgress();
  return progress.badges;
}

// Obter desafios ativos
export async function getActiveChallenges(): Promise<Challenge[]> {
  const progress = await getUserProgress();
  return progress.challenges.filter((c) => !c.completed && new Date() <= c.endDate);
}
