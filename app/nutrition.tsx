import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const MEAL_TYPES = {
  breakfast: { name: "Café da Manhã", icon: "sunrise.fill", color: "#FF9800" },
  lunch: { name: "Almoço", icon: "sun.max.fill", color: "#FF5722" },
  dinner: { name: "Jantar", icon: "moon.stars.fill", color: "#673AB7" },
  snack: { name: "Lanche", icon: "fork.knife", color: "#4CAF50" },
};

export default function NutritionScreen() {
  const colors = useColors();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const mealsData = await AsyncStorage.getItem("meals");
      if (mealsData) {
        const allMeals = JSON.parse(mealsData);
        // Filtrar refeições de hoje
        const today = new Date().setHours(0, 0, 0, 0);
        const todayMeals = allMeals.filter((meal: Meal) => {
          const mealDate = new Date(meal.timestamp).setHours(0, 0, 0, 0);
          return mealDate === today;
        });
        setMeals(todayMeals);
      }
    } catch (error) {
      console.error("Erro ao carregar refeições:", error);
    }
  };

  const calculateTotals = () => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totals = calculateTotals();

  const renderMacroCard = (name: string, current: number, goal: number, unit: string, color: string) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <View className="flex-1 bg-surface rounded-xl p-4">
        <Text className="text-muted text-xs mb-2">{name}</Text>
        <Text className="text-foreground text-2xl font-bold mb-1">
          {Math.round(current)}
          <Text className="text-sm text-muted">/{goal}{unit}</Text>
        </Text>
        <View className="h-2 bg-border rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ backgroundColor: color, width: `${percentage}%` }}
          />
        </View>
      </View>
    );
  };

  const renderMeal = ({ item }: { item: Meal }) => {
    const mealType = MEAL_TYPES[item.type];
    return (
      <TouchableOpacity
        className="bg-surface rounded-xl p-4 mb-3 border border-border"
        activeOpacity={0.7}
        onPress={() => {}}
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-row items-center gap-2 flex-1">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: mealType.color + "20" }}
            >
              <IconSymbol name={mealType.icon as any} size={20} color={mealType.color} />
            </View>
            <View className="flex-1">
              <Text className="text-muted text-xs">{mealType.name}</Text>
              <Text className="text-foreground font-bold">{item.name}</Text>
            </View>
          </View>
          <Text className="text-foreground font-bold">{item.calories} kcal</Text>
        </View>
        <View className="flex-row gap-4 ml-12">
          <Text className="text-muted text-xs">P: {item.protein}g</Text>
          <Text className="text-muted text-xs">C: {item.carbs}g</Text>
          <Text className="text-muted text-xs">G: {item.fat}g</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Nutrição</Text>
          <TouchableOpacity onPress={() => router.push("/food-scanner")} activeOpacity={0.7}>
            <IconSymbol name="barcode.viewfinder" size={28} color={colors.health} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6 gap-6">
            {/* Calories Card */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="items-center mb-4">
                <Text className="text-muted text-sm mb-2">Calorias Hoje</Text>
                <Text className="text-foreground text-5xl font-bold">
                  {Math.round(totals.calories)}
                </Text>
                <Text className="text-muted">de {dailyGoals.calories} kcal</Text>
              </View>
              <View className="h-3 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: colors.health,
                    width: `${Math.min((totals.calories / dailyGoals.calories) * 100, 100)}%`,
                  }}
                />
              </View>
              <Text className="text-muted text-xs text-center mt-2">
                {dailyGoals.calories - totals.calories > 0
                  ? `Restam ${Math.round(dailyGoals.calories - totals.calories)} kcal`
                  : "Meta atingida!"}
              </Text>
            </View>

            {/* Macros */}
            <View className="flex-row gap-3">
              {renderMacroCard("Proteína", totals.protein, dailyGoals.protein, "g", "#FF5722")}
              {renderMacroCard("Carboidrato", totals.carbs, dailyGoals.carbs, "g", "#2196F3")}
              {renderMacroCard("Gordura", totals.fat, dailyGoals.fat, "g", "#FF9800")}
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-surface rounded-xl p-4 items-center border border-border"
                activeOpacity={0.7}
                onPress={() => router.push("/food-scanner")}
              >
                <IconSymbol name="barcode.viewfinder" size={32} color={colors.health} />
                <Text className="text-foreground font-semibold mt-2">Scanner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-surface rounded-xl p-4 items-center border border-border"
                activeOpacity={0.7}
                onPress={() => Alert.alert("Buscar Alimentos", "Funcionalidade em desenvolvimento")}
              >
                <IconSymbol name="magnifyingglass" size={32} color={colors.health} />
                <Text className="text-foreground font-semibold mt-2">Buscar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-surface rounded-xl p-4 items-center border border-border"
                activeOpacity={0.7}
                onPress={() => router.push("/meal-photo-analyzer")}
              >
                <IconSymbol name="camera.fill" size={32} color={colors.health} />
                <Text className="text-foreground font-semibold mt-2">Foto IA</Text>
              </TouchableOpacity>
            </View>

            {/* Meals List */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Refeições de Hoje</Text>
              {meals.length > 0 ? (
                <FlatList
                  data={meals}
                  renderItem={renderMeal}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View className="bg-surface rounded-xl p-8 items-center border border-border">
                  <IconSymbol name="fork.knife.circle" size={48} color={colors.muted} />
                  <Text className="text-muted text-center mt-4">
                    Nenhuma refeição registrada hoje
                  </Text>
                  <Text className="text-muted text-sm text-center mt-2">
                    Use o scanner ou busca para adicionar alimentos
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* FAB */}
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={() => Alert.alert("Adicionar Refeição", "Funcionalidade em desenvolvimento")}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
