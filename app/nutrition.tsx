import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert, Modal, TextInput } from "react-native";
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

const FOOD_DATABASE = [
  { name: "Arroz branco (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Feijão preto (100g)", calories: 77, protein: 5, carbs: 14, fat: 0.5 },
  { name: "Frango grelhado (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Ovo cozido (1 un)", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Banana (1 un)", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Pão francês (1 un)", calories: 150, protein: 5, carbs: 28, fat: 1.5 },
  { name: "Batata doce (100g)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "Leite integral (200ml)", calories: 120, protein: 6, carbs: 10, fat: 6 },
  { name: "Iogurte natural (170g)", calories: 100, protein: 6, carbs: 12, fat: 3.5 },
  { name: "Aveia (30g)", calories: 117, protein: 4, carbs: 20, fat: 2.4 },
  { name: "Salmão (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Brócolis (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
];

export default function NutritionScreen() {
  const colors = useColors();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addMealName, setAddMealName] = useState("");
  const [addMealCalories, setAddMealCalories] = useState("");
  const [addMealType, setAddMealType] = useState<Meal["type"]>("lunch");
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

  const getMealTypeForTime = (): Meal["type"] => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 15) return "lunch";
    if (hour >= 18 && hour < 23) return "dinner";
    return "snack";
  };

  const addFoodFromSearch = async (food: typeof FOOD_DATABASE[0]) => {
    const meal: Meal = {
      id: Date.now().toString(),
      name: food.name,
      type: getMealTypeForTime(),
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      timestamp: Date.now(),
    };
    const mealsData = await AsyncStorage.getItem("meals");
    const allMeals = mealsData ? JSON.parse(mealsData) : [];
    allMeals.push(meal);
    await AsyncStorage.setItem("meals", JSON.stringify(allMeals));
    setMeals((prev) => [...prev, meal]);
    setShowSearchModal(false);
    setSearchQuery("");
    Alert.alert("Adicionado!", `${food.name} registrado com sucesso.`);
  };

  const addManualMeal = async () => {
    if (!addMealName.trim() || !addMealCalories.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha o nome e as calorias");
      return;
    }
    const meal: Meal = {
      id: Date.now().toString(),
      name: addMealName,
      type: addMealType,
      calories: parseInt(addMealCalories) || 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      timestamp: Date.now(),
    };
    const mealsData = await AsyncStorage.getItem("meals");
    const allMeals = mealsData ? JSON.parse(mealsData) : [];
    allMeals.push(meal);
    await AsyncStorage.setItem("meals", JSON.stringify(allMeals));
    setMeals((prev) => [...prev, meal]);
    setAddMealName("");
    setAddMealCalories("");
    setShowAddModal(false);
    Alert.alert("Adicionado!", `${meal.name} registrado com sucesso.`);
  };

  const filteredFoods = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onPress={() => setShowSearchModal(true)}
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
            onPress={() => setShowAddModal(true)}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Food Modal */}
        <Modal visible={showSearchModal} animationType="slide" transparent>
          <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background, maxHeight: "80%" }}>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-foreground text-xl font-bold">Buscar Alimentos</Text>
                <TouchableOpacity onPress={() => { setShowSearchModal(false); setSearchQuery(""); }}>
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              <View className="bg-surface rounded-xl px-4 py-3 flex-row items-center border border-border mb-4">
                <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
                <TextInput
                  className="flex-1 ml-2"
                  placeholder="Buscar alimento..."
                  placeholderTextColor={colors.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  style={{ color: colors.foreground }}
                />
              </View>

              <FlatList
                data={filteredFoods}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="bg-surface rounded-xl p-4 mb-2 border border-border"
                    activeOpacity={0.7}
                    onPress={() => addFoodFromSearch(item)}
                  >
                    <Text className="text-foreground font-bold mb-1">{item.name}</Text>
                    <View className="flex-row gap-4">
                      <Text className="text-muted text-xs">{item.calories} kcal</Text>
                      <Text className="text-muted text-xs">P: {item.protein}g</Text>
                      <Text className="text-muted text-xs">C: {item.carbs}g</Text>
                      <Text className="text-muted text-xs">G: {item.fat}g</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text className="text-muted text-center py-8">Nenhum alimento encontrado</Text>
                }
              />
            </View>
          </View>
        </Modal>

        {/* Add Meal Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background }}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-foreground text-xl font-bold">Adicionar Refeição</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              <Text className="text-muted text-sm mb-2">Tipo de refeição</Text>
              <View className="flex-row gap-2 mb-4">
                {(Object.entries(MEAL_TYPES) as [Meal["type"], typeof MEAL_TYPES["breakfast"]][]).map(([key, val]) => (
                  <TouchableOpacity
                    key={key}
                    className="flex-1 py-2 rounded-xl items-center"
                    style={{
                      backgroundColor: addMealType === key ? val.color + "30" : colors.surface,
                      borderWidth: 1,
                      borderColor: addMealType === key ? val.color : colors.border,
                    }}
                    onPress={() => setAddMealType(key)}
                  >
                    <Text className="text-xs font-semibold" style={{ color: addMealType === key ? val.color : colors.foreground }}>
                      {val.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-muted text-sm mb-2">Nome *</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Ex: Arroz com feijão"
                placeholderTextColor={colors.muted}
                value={addMealName}
                onChangeText={setAddMealName}
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Calorias (kcal) *</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-6"
                placeholder="500"
                placeholderTextColor={colors.muted}
                value={addMealCalories}
                onChangeText={setAddMealCalories}
                keyboardType="numeric"
                style={{ color: colors.foreground }}
              />

              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.health }}
                activeOpacity={0.8}
                onPress={addManualMeal}
              >
                <Text className="text-white font-bold text-lg">Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
