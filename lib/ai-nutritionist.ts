import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fats: number; // gramas
  fiber?: number; // gramas
  confidence: number; // 0-100
}

export interface MealAnalysis {
  id: string;
  imageUri?: string;
  timestamp: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  aiSuggestions: string[];
}

export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number; // gramas
  dailyCarbs: number; // gramas
  dailyFats: number; // gramas
  goal: "lose_weight" | "maintain" | "gain_muscle";
}

export interface DailyNutrition {
  date: Date;
  meals: MealAnalysis[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  goalsProgress: {
    calories: number; // percentual
    protein: number;
    carbs: number;
    fats: number;
  };
}

// Analisar foto de refeição com IA
export async function analyzeMealPhoto(
  imageUri: string,
  mealType: MealAnalysis["mealType"]
): Promise<MealAnalysis> {
  console.log("📸 Analisando foto da refeição...");
  
  // Simular processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Em produção, isso enviaria a imagem para o backend com IA real
  // Por enquanto, retorna análise simulada realista
  
  const foods: FoodItem[] = generateMockFoodAnalysis(mealType);
  
  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFats = foods.reduce((sum, f) => sum + f.fats, 0);
  const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);
  
  const aiSuggestions = generateNutritionSuggestions(foods, mealType);
  
  const analysis: MealAnalysis = {
    id: `meal_${Date.now()}`,
    imageUri,
    timestamp: new Date(),
    mealType,
    foods,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    totalFiber,
    aiSuggestions,
  };
  
  // Salvar análise
  await saveMealAnalysis(analysis);
  
  console.log("✅ Análise concluída:", analysis);
  
  return analysis;
}

// Gerar análise simulada de alimentos
function generateMockFoodAnalysis(mealType: MealAnalysis["mealType"]): FoodItem[] {
  const breakfastFoods = [
    { name: "Pão integral", quantity: 2, unit: "fatias", calories: 140, protein: 6, carbs: 24, fats: 2, fiber: 4, confidence: 92 },
    { name: "Ovo mexido", quantity: 2, unit: "unidades", calories: 180, protein: 14, carbs: 2, fats: 13, fiber: 0, confidence: 95 },
    { name: "Abacate", quantity: 50, unit: "g", calories: 80, protein: 1, carbs: 4, fats: 7, fiber: 3, confidence: 88 },
    { name: "Café com leite", quantity: 200, unit: "ml", calories: 60, protein: 3, carbs: 6, fats: 2, fiber: 0, confidence: 90 },
  ];
  
  const lunchFoods = [
    { name: "Arroz integral", quantity: 150, unit: "g", calories: 180, protein: 4, carbs: 38, fats: 1, fiber: 2, confidence: 93 },
    { name: "Feijão preto", quantity: 100, unit: "g", calories: 120, protein: 8, carbs: 20, fats: 1, fiber: 7, confidence: 91 },
    { name: "Frango grelhado", quantity: 150, unit: "g", calories: 240, protein: 36, carbs: 0, fats: 9, fiber: 0, confidence: 96 },
    { name: "Salada verde", quantity: 100, unit: "g", calories: 25, protein: 2, carbs: 4, fats: 0, fiber: 2, confidence: 85 },
    { name: "Brócolis cozido", quantity: 80, unit: "g", calories: 30, protein: 3, carbs: 5, fats: 0, fiber: 3, confidence: 89 },
  ];
  
  const dinnerFoods = [
    { name: "Batata doce", quantity: 200, unit: "g", calories: 180, protein: 2, carbs: 41, fats: 0, fiber: 4, confidence: 94 },
    { name: "Salmão grelhado", quantity: 150, unit: "g", calories: 280, protein: 32, carbs: 0, fats: 16, fiber: 0, confidence: 97 },
    { name: "Aspargos", quantity: 100, unit: "g", calories: 20, protein: 2, carbs: 4, fats: 0, fiber: 2, confidence: 87 },
  ];
  
  const snackFoods = [
    { name: "Banana", quantity: 1, unit: "unidade", calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3, confidence: 96 },
    { name: "Pasta de amendoim", quantity: 20, unit: "g", calories: 120, protein: 5, carbs: 4, fats: 10, fiber: 2, confidence: 90 },
  ];
  
  switch (mealType) {
    case "breakfast":
      return breakfastFoods;
    case "lunch":
      return lunchFoods;
    case "dinner":
      return dinnerFoods;
    case "snack":
      return snackFoods;
    default:
      return lunchFoods;
  }
}

// Gerar sugestões nutricionais
function generateNutritionSuggestions(
  foods: FoodItem[],
  mealType: MealAnalysis["mealType"]
): string[] {
  const suggestions: string[] = [];
  
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFats = foods.reduce((sum, f) => sum + f.fats, 0);
  const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);
  
  // Análise de proteína
  if (totalProtein < 20 && (mealType === "lunch" || mealType === "dinner")) {
    suggestions.push("💪 Adicione mais proteína (frango, peixe, ovos ou leguminosas) para melhor saciedade e recuperação muscular.");
  } else if (totalProtein >= 30) {
    suggestions.push("✅ Excelente quantidade de proteína nesta refeição!");
  }
  
  // Análise de carboidratos
  if (totalCarbs > 60 && mealType !== "breakfast") {
    suggestions.push("⚠️ Alto teor de carboidratos. Considere reduzir para evitar picos de glicose.");
  }
  
  // Análise de gorduras
  if (totalFats < 5) {
    suggestions.push("🥑 Adicione gorduras saudáveis (abacate, azeite, castanhas) para melhor absorção de vitaminas.");
  }
  
  // Análise de fibras
  if (totalFiber < 5) {
    suggestions.push("🥗 Aumente a ingestão de fibras com vegetais, frutas ou grãos integrais.");
  } else if (totalFiber >= 8) {
    suggestions.push("✅ Ótima quantidade de fibras para a saúde digestiva!");
  }
  
  // Sugestões específicas por refeição
  if (mealType === "breakfast") {
    suggestions.push("☀️ Café da manhã equilibrado ajuda a manter energia durante a manhã.");
  } else if (mealType === "dinner") {
    suggestions.push("🌙 Jantar mais leve facilita o sono e a digestão noturna.");
  }
  
  return suggestions;
}

// Salvar análise de refeição
async function saveMealAnalysis(analysis: MealAnalysis): Promise<void> {
  try {
    const history = await getMealHistory(30);
    history.unshift(analysis);
    
    // Limitar a 500 registros
    const limited = history.slice(0, 500);
    
    await AsyncStorage.setItem("mealHistory", JSON.stringify(limited));
  } catch (error) {
    console.error("Erro ao salvar análise:", error);
  }
}

// Obter histórico de refeições
export async function getMealHistory(days: number = 7): Promise<MealAnalysis[]> {
  try {
    const stored = await AsyncStorage.getItem("mealHistory");
    if (stored) {
      const history = JSON.parse(stored);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return history
        .map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        .filter((item: MealAnalysis) => item.timestamp >= cutoffDate)
        .sort((a: MealAnalysis, b: MealAnalysis) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
    }
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
  }
  return [];
}

// Obter nutrição diária
export async function getDailyNutrition(date: Date = new Date()): Promise<DailyNutrition> {
  const history = await getMealHistory(30);
  
  // Filtrar refeições do dia
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  const meals = history.filter(
    m => m.timestamp >= dayStart && m.timestamp <= dayEnd
  );
  
  const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.totalProtein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.totalCarbs, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.totalFats, 0);
  
  // Obter metas
  const goals = await getNutritionGoals();
  
  return {
    date,
    meals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    goalsProgress: {
      calories: (totalCalories / goals.dailyCalories) * 100,
      protein: (totalProtein / goals.dailyProtein) * 100,
      carbs: (totalCarbs / goals.dailyCarbs) * 100,
      fats: (totalFats / goals.dailyFats) * 100,
    },
  };
}

// Obter/definir metas nutricionais
export async function getNutritionGoals(): Promise<NutritionGoals> {
  try {
    const stored = await AsyncStorage.getItem("nutritionGoals");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar metas:", error);
  }
  
  // Metas padrão
  return {
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFats: 65,
    goal: "maintain",
  };
}

export async function setNutritionGoals(goals: NutritionGoals): Promise<void> {
  await AsyncStorage.setItem("nutritionGoals", JSON.stringify(goals));
  console.log("✅ Metas nutricionais atualizadas");
}

// Calcular metas baseadas em objetivo
export function calculateNutritionGoals(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: "male" | "female",
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active",
  goal: NutritionGoals["goal"]
): NutritionGoals {
  // Calcular TMB (Taxa Metabólica Basal) usando fórmula de Harris-Benedict
  let bmr: number;
  if (gender === "male") {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Multiplicador de atividade
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  let dailyCalories = bmr * activityMultipliers[activityLevel];
  
  // Ajustar baseado no objetivo
  if (goal === "lose_weight") {
    dailyCalories -= 500; // Déficit de 500 kcal
  } else if (goal === "gain_muscle") {
    dailyCalories += 300; // Superávit de 300 kcal
  }
  
  // Calcular macros (40% carbs, 30% protein, 30% fats)
  const dailyProtein = (dailyCalories * 0.3) / 4; // 4 kcal por grama
  const dailyCarbs = (dailyCalories * 0.4) / 4;
  const dailyFats = (dailyCalories * 0.3) / 9; // 9 kcal por grama
  
  return {
    dailyCalories: Math.round(dailyCalories),
    dailyProtein: Math.round(dailyProtein),
    dailyCarbs: Math.round(dailyCarbs),
    dailyFats: Math.round(dailyFats),
    goal,
  };
}

// Gerar plano alimentar personalizado
export async function generateMealPlan(days: number = 7): Promise<{
  days: Array<{
    date: Date;
    meals: Array<{
      type: MealAnalysis["mealType"];
      name: string;
      foods: FoodItem[];
      totalCalories: number;
    }>;
  }>;
}> {
  console.log(`📋 Gerando plano alimentar para ${days} dias...`);
  
  // Em produção, isso usaria IA para gerar plano personalizado
  // Por enquanto, retorna plano simulado
  
  const plan = {
    days: [] as any[],
  };
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    plan.days.push({
      date,
      meals: [
        {
          type: "breakfast",
          name: "Café da Manhã Energético",
          foods: generateMockFoodAnalysis("breakfast"),
          totalCalories: 460,
        },
        {
          type: "lunch",
          name: "Almoço Balanceado",
          foods: generateMockFoodAnalysis("lunch"),
          totalCalories: 595,
        },
        {
          type: "snack",
          name: "Lanche Saudável",
          foods: generateMockFoodAnalysis("snack"),
          totalCalories: 225,
        },
        {
          type: "dinner",
          name: "Jantar Leve",
          foods: generateMockFoodAnalysis("dinner"),
          totalCalories: 480,
        },
      ],
    });
  }
  
  console.log("✅ Plano alimentar gerado");
  
  return plan;
}

// Obter insights nutricionais
export async function getNutritionInsights(): Promise<string[]> {
  const dailyNutrition = await getDailyNutrition();
  const goals = await getNutritionGoals();
  const insights: string[] = [];
  
  // Análise de calorias
  if (dailyNutrition.goalsProgress.calories < 80) {
    insights.push("⚠️ Você está abaixo da meta de calorias. Adicione mais refeições para atingir seu objetivo.");
  } else if (dailyNutrition.goalsProgress.calories > 120) {
    insights.push("⚠️ Você ultrapassou a meta de calorias. Considere porções menores ou alimentos menos calóricos.");
  } else {
    insights.push("✅ Você está dentro da meta de calorias!");
  }
  
  // Análise de proteína
  if (dailyNutrition.goalsProgress.protein < 80) {
    insights.push("💪 Aumente a ingestão de proteína para melhor recuperação muscular.");
  }
  
  // Análise de hidratação (simulada)
  insights.push("💧 Lembre-se de beber pelo menos 2L de água por dia!");
  
  return insights;
}
