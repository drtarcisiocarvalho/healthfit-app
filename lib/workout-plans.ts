import AsyncStorage from "@react-native-async-storage/async-storage";

export enum FitnessLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum WorkoutGoal {
  WEIGHT_LOSS = "weight_loss",
  MUSCLE_GAIN = "muscle_gain",
  ENDURANCE = "endurance",
  GENERAL_FITNESS = "general_fitness",
}

export interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: number; // em minutos
  rest?: number; // em segundos
  description: string;
}

export interface WorkoutDay {
  day: number;
  name: string;
  focus: string;
  duration: number; // em minutos
  exercises: WorkoutExercise[];
  completed?: boolean;
  completedAt?: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: FitnessLevel;
  goal: WorkoutGoal;
  durationWeeks: number;
  daysPerWeek: number;
  weeks: WorkoutDay[][];
  currentWeek: number;
  startedAt?: Date;
}

// Planos de treino pré-definidos
const WORKOUT_PLANS: Omit<WorkoutPlan, "currentWeek" | "startedAt">[] = [
  // INICIANTE - PERDA DE PESO
  {
    id: "beginner_weight_loss",
    name: "Iniciante: Queima de Gordura",
    description: "Programa de 4 semanas focado em cardio e exercícios funcionais para perda de peso",
    level: FitnessLevel.BEGINNER,
    goal: WorkoutGoal.WEIGHT_LOSS,
    durationWeeks: 4,
    daysPerWeek: 3,
    weeks: [
      [
        {
          day: 1,
          name: "Cardio Leve + Core",
          focus: "Resistência cardiovascular",
          duration: 30,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Caminhada leve ou polichinelos" },
            { name: "Caminhada Rápida", duration: 15, description: "Ritmo moderado, respiração controlada" },
            { name: "Prancha", sets: 3, reps: "20-30s", rest: 30, description: "Manter posição com abdômen contraído" },
            { name: "Bicicleta no Ar", sets: 3, reps: "15 cada lado", rest: 30, description: "Movimento controlado" },
            { name: "Alongamento", duration: 5, description: "Foco em pernas e core" },
          ],
        },
        {
          day: 3,
          name: "Corpo Inteiro",
          focus: "Força funcional",
          duration: 35,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Mobilidade articular" },
            { name: "Agachamento Livre", sets: 3, reps: "12-15", rest: 45, description: "Peso corporal, postura correta" },
            { name: "Flexão de Joelhos", sets: 3, reps: "8-10", rest: 45, description: "Mãos na largura dos ombros" },
            { name: "Afundo Alternado", sets: 3, reps: "10 cada perna", rest: 45, description: "Joelho não ultrapassa ponta do pé" },
            { name: "Prancha Lateral", sets: 2, reps: "15-20s cada lado", rest: 30, description: "Corpo alinhado" },
            { name: "Alongamento", duration: 5, description: "Relaxamento muscular" },
          ],
        },
        {
          day: 5,
          name: "Cardio Intervalado",
          focus: "Queima calórica",
          duration: 30,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Caminhada + mobilidade" },
            { name: "Intervalos", duration: 15, description: "1min rápido + 2min moderado (repetir 5x)" },
            { name: "Burpees Modificados", sets: 3, reps: "8-10", rest: 60, description: "Sem pulo, ritmo controlado" },
            { name: "Mountain Climbers", sets: 3, reps: "20 total", rest: 45, description: "Alternando pernas" },
            { name: "Alongamento", duration: 5, description: "Recuperação ativa" },
          ],
        },
      ],
    ],
  },
  
  // INTERMEDIÁRIO - GANHO MUSCULAR
  {
    id: "intermediate_muscle_gain",
    name: "Intermediário: Hipertrofia",
    description: "Programa de 6 semanas para ganho de massa muscular com treino dividido",
    level: FitnessLevel.INTERMEDIATE,
    goal: WorkoutGoal.MUSCLE_GAIN,
    durationWeeks: 6,
    daysPerWeek: 4,
    weeks: [
      [
        {
          day: 1,
          name: "Peito e Tríceps",
          focus: "Membros superiores - empurrar",
          duration: 50,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Rotação de ombros e alongamento dinâmico" },
            { name: "Supino Reto", sets: 4, reps: "8-12", rest: 90, description: "Carga progressiva" },
            { name: "Supino Inclinado", sets: 3, reps: "10-12", rest: 75, description: "Foco na parte superior do peito" },
            { name: "Flexão com Peso", sets: 3, reps: "12-15", rest: 60, description: "Mochila com peso ou colete" },
            { name: "Tríceps Testa", sets: 3, reps: "10-12", rest: 60, description: "Controle na descida" },
            { name: "Tríceps Corda", sets: 3, reps: "12-15", rest: 45, description: "Extensão completa" },
            { name: "Alongamento", duration: 5, description: "Peito, ombros e tríceps" },
          ],
        },
        {
          day: 2,
          name: "Costas e Bíceps",
          focus: "Membros superiores - puxar",
          duration: 50,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Mobilidade de ombros" },
            { name: "Barra Fixa", sets: 4, reps: "6-10", rest: 90, description: "Pegada pronada" },
            { name: "Remada Curvada", sets: 4, reps: "8-12", rest: 75, description: "Costas retas" },
            { name: "Pulldown", sets: 3, reps: "10-12", rest: 60, description: "Puxar até o peito" },
            { name: "Rosca Direta", sets: 3, reps: "10-12", rest: 60, description: "Sem balanço" },
            { name: "Rosca Martelo", sets: 3, reps: "12-15", rest: 45, description: "Pegada neutra" },
            { name: "Alongamento", duration: 5, description: "Costas e bíceps" },
          ],
        },
        {
          day: 4,
          name: "Pernas Completo",
          focus: "Membros inferiores",
          duration: 55,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Mobilidade de quadril e joelhos" },
            { name: "Agachamento Livre", sets: 4, reps: "8-12", rest: 120, description: "Profundidade completa" },
            { name: "Leg Press", sets: 4, reps: "10-15", rest: 90, description: "Pés na largura dos ombros" },
            { name: "Stiff", sets: 3, reps: "10-12", rest: 75, description: "Posterior de coxa" },
            { name: "Cadeira Extensora", sets: 3, reps: "12-15", rest: 60, description: "Quadríceps isolado" },
            { name: "Panturrilha em Pé", sets: 4, reps: "15-20", rest: 45, description: "Amplitude completa" },
            { name: "Alongamento", duration: 5, description: "Pernas completas" },
          ],
        },
        {
          day: 6,
          name: "Ombros e Abdômen",
          focus: "Deltoides e core",
          duration: 45,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Rotação de ombros" },
            { name: "Desenvolvimento", sets: 4, reps: "8-12", rest: 90, description: "Barra ou halteres" },
            { name: "Elevação Lateral", sets: 3, reps: "12-15", rest: 60, description: "Deltoides medial" },
            { name: "Elevação Frontal", sets: 3, reps: "12-15", rest: 60, description: "Deltoides anterior" },
            { name: "Prancha", sets: 3, reps: "45-60s", rest: 45, description: "Core estável" },
            { name: "Abdominal Bicicleta", sets: 3, reps: "20 cada lado", rest: 30, description: "Oblíquos" },
            { name: "Alongamento", duration: 5, description: "Ombros e core" },
          ],
        },
      ],
    ],
  },

  // AVANÇADO - RESISTÊNCIA
  {
    id: "advanced_endurance",
    name: "Avançado: Resistência Extrema",
    description: "Programa de 8 semanas para atletas avançados focado em resistência cardiovascular e muscular",
    level: FitnessLevel.ADVANCED,
    goal: WorkoutGoal.ENDURANCE,
    durationWeeks: 8,
    daysPerWeek: 5,
    weeks: [
      [
        {
          day: 1,
          name: "Long Run",
          focus: "Corrida de longa distância",
          duration: 60,
          exercises: [
            { name: "Aquecimento", duration: 10, description: "Trote leve + mobilidade" },
            { name: "Corrida Contínua", duration: 45, description: "Ritmo confortável, zona 2-3" },
            { name: "Desaquecimento", duration: 5, description: "Caminhada + alongamento" },
          ],
        },
        {
          day: 2,
          name: "HIIT Total Body",
          focus: "Alta intensidade",
          duration: 45,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Dinâmico" },
            { name: "Circuito 1", duration: 15, description: "Burpees, box jumps, kettlebell swings (40s on / 20s off)" },
            { name: "Circuito 2", duration: 15, description: "Thruster, renegade rows, mountain climbers (40s on / 20s off)" },
            { name: "Finisher", duration: 5, description: "Assault bike all-out" },
            { name: "Alongamento", duration: 5, description: "Recuperação" },
          ],
        },
        {
          day: 3,
          name: "Tempo Run",
          focus: "Corrida em ritmo",
          duration: 50,
          exercises: [
            { name: "Aquecimento", duration: 10, description: "Progressivo" },
            { name: "Tempo", duration: 30, description: "Ritmo de limiar (zona 4)" },
            { name: "Desaquecimento", duration: 10, description: "Trote leve" },
          ],
        },
        {
          day: 5,
          name: "Strength Endurance",
          focus: "Força resistência",
          duration: 55,
          exercises: [
            { name: "Aquecimento", duration: 5, description: "Mobilidade" },
            { name: "Agachamento", sets: 5, reps: "15-20", rest: 60, description: "Peso moderado" },
            { name: "Deadlift", sets: 5, reps: "12-15", rest: 60, description: "Técnica perfeita" },
            { name: "Flexão", sets: 4, reps: "20-25", rest: 45, description: "Ritmo constante" },
            { name: "Barra", sets: 4, reps: "10-15", rest: 45, description: "Controle total" },
            { name: "Core Circuit", duration: 10, description: "Prancha, russian twist, leg raises" },
            { name: "Alongamento", duration: 5, description: "Completo" },
          ],
        },
        {
          day: 7,
          name: "Recovery Run",
          focus: "Recuperação ativa",
          duration: 40,
          exercises: [
            { name: "Trote Leve", duration: 30, description: "Zona 1-2, conversacional" },
            { name: "Mobilidade", duration: 10, description: "Foam roller + alongamento" },
          ],
        },
      ],
    ],
  },
];

// Obter todos os planos disponíveis
export function getAllWorkoutPlans(): Omit<WorkoutPlan, "currentWeek" | "startedAt">[] {
  return WORKOUT_PLANS;
}

// Filtrar planos por nível e objetivo
export function getFilteredPlans(level?: FitnessLevel, goal?: WorkoutGoal): Omit<WorkoutPlan, "currentWeek" | "startedAt">[] {
  return WORKOUT_PLANS.filter((plan) => {
    if (level && plan.level !== level) return false;
    if (goal && plan.goal !== goal) return false;
    return true;
  });
}

// Iniciar um plano de treino
export async function startWorkoutPlan(planId: string): Promise<WorkoutPlan | null> {
  const template = WORKOUT_PLANS.find((p) => p.id === planId);
  if (!template) return null;

  const activePlan: WorkoutPlan = {
    ...template,
    currentWeek: 0,
    startedAt: new Date(),
  };

  await AsyncStorage.setItem("activeWorkoutPlan", JSON.stringify(activePlan));
  return activePlan;
}

// Obter plano ativo
export async function getActiveWorkoutPlan(): Promise<WorkoutPlan | null> {
  try {
    const stored = await AsyncStorage.getItem("activeWorkoutPlan");
    if (stored) {
      const plan = JSON.parse(stored);
      // Converter datas
      if (plan.startedAt) plan.startedAt = new Date(plan.startedAt);
      plan.weeks.forEach((week: WorkoutDay[]) => {
        week.forEach((day) => {
          if (day.completedAt) day.completedAt = new Date(day.completedAt);
        });
      });
      return plan;
    }
  } catch (error) {
    console.error("Erro ao carregar plano ativo:", error);
  }
  return null;
}

// Marcar dia como completo
export async function completeWorkoutDay(weekIndex: number, dayIndex: number): Promise<void> {
  const plan = await getActiveWorkoutPlan();
  if (!plan) return;

  if (plan.weeks[weekIndex] && plan.weeks[weekIndex][dayIndex]) {
    plan.weeks[weekIndex][dayIndex].completed = true;
    plan.weeks[weekIndex][dayIndex].completedAt = new Date();

    await AsyncStorage.setItem("activeWorkoutPlan", JSON.stringify(plan));
  }
}

// Avançar para próxima semana
export async function advanceToNextWeek(): Promise<boolean> {
  const plan = await getActiveWorkoutPlan();
  if (!plan) return false;

  if (plan.currentWeek < plan.weeks.length - 1) {
    plan.currentWeek++;
    await AsyncStorage.setItem("activeWorkoutPlan", JSON.stringify(plan));
    return true;
  }

  return false;
}

// Calcular progresso do plano
export async function getPlanProgress(): Promise<{
  completedDays: number;
  totalDays: number;
  percentage: number;
  currentWeek: number;
  totalWeeks: number;
} | null> {
  const plan = await getActiveWorkoutPlan();
  if (!plan) return null;

  let completedDays = 0;
  let totalDays = 0;

  plan.weeks.forEach((week) => {
    week.forEach((day) => {
      totalDays++;
      if (day.completed) completedDays++;
    });
  });

  return {
    completedDays,
    totalDays,
    percentage: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
    currentWeek: plan.currentWeek + 1,
    totalWeeks: plan.weeks.length,
  };
}

// Cancelar plano ativo
export async function cancelWorkoutPlan(): Promise<void> {
  await AsyncStorage.removeItem("activeWorkoutPlan");
}

// Recomendar plano baseado em histórico
export async function recommendWorkoutPlan(): Promise<Omit<WorkoutPlan, "currentWeek" | "startedAt"> | null> {
  // Lógica simples de recomendação
  // Em produção, isso analisaria histórico de treinos, nível atual, etc.
  
  try {
    const workouts = await AsyncStorage.getItem("workouts");
    const totalWorkouts = workouts ? JSON.parse(workouts).length : 0;

    let level: FitnessLevel;
    if (totalWorkouts < 10) {
      level = FitnessLevel.BEGINNER;
    } else if (totalWorkouts < 50) {
      level = FitnessLevel.INTERMEDIATE;
    } else {
      level = FitnessLevel.ADVANCED;
    }

    const plansForLevel = WORKOUT_PLANS.filter((p) => p.level === level);
    return plansForLevel[0] || WORKOUT_PLANS[0];
  } catch (error) {
    return WORKOUT_PLANS[0];
  }
}
