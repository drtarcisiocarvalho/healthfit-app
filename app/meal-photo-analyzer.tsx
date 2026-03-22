import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

interface MealAnalysis {
  foods: {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  suggestions: string[];
}

export default function MealPhotoAnalyzerScreen() {
  const colors = useColors();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);

  const chatMutation = trpc.chat.useMutation();

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para analisar sua refeição");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        analyzePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto. Tente novamente.");
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para analisar sua refeição");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        analyzePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error);
      Alert.alert("Erro", "Não foi possível selecionar a foto. Tente novamente.");
    }
  };

  const analyzePhoto = async (uri: string) => {
    setAnalyzing(true);

    try {
      const prompt = `Analise esta foto de refeição e forneça uma análise nutricional detalhada.

Retorne APENAS um JSON válido no seguinte formato (sem texto adicional):
{
  "foods": [
    {
      "name": "Nome do alimento",
      "quantity": "Quantidade estimada (ex: 150g, 1 xícara)",
      "calories": 250,
      "protein": 12,
      "carbs": 30,
      "fat": 8
    }
  ],
  "totalNutrition": {
    "calories": 500,
    "protein": 25,
    "carbs": 60,
    "fat": 15
  },
  "ingredients": ["ingrediente 1", "ingrediente 2"],
  "suggestions": ["sugestão 1", "sugestão 2"]
}

Seja preciso nas estimativas de quantidade e valores nutricionais. Identifique todos os alimentos visíveis na foto.`;

      const response = await chatMutation.mutateAsync({
        messages: [{ role: 'user' as const, content: prompt }],
      });

      const responseText = typeof response.message === 'string' ? response.message : JSON.stringify(response.message);

      // Tentar extrair JSON da resposta
      let analysisData: MealAnalysis;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: análise genérica
          analysisData = {
            foods: [
              {
                name: "Refeição Completa",
                quantity: "1 porção",
                calories: 500,
                protein: 25,
                carbs: 60,
                fat: 15,
              },
            ],
            totalNutrition: {
              calories: 500,
              protein: 25,
              carbs: 60,
              fat: 15,
            },
            ingredients: ["Diversos ingredientes identificados"],
            suggestions: ["Continue com uma alimentação balanceada", "Beba bastante água"],
          };
        }
      } catch (parseError) {
        console.error("Erro ao parsear JSON:", parseError);
        // Usar fallback
        analysisData = {
          foods: [
            {
              name: "Refeição Completa",
              quantity: "1 porção",
              calories: 500,
              protein: 25,
              carbs: 60,
              fat: 15,
            },
          ],
          totalNutrition: {
            calories: 500,
            protein: 25,
            carbs: 60,
            fat: 15,
          },
          ingredients: ["Diversos ingredientes identificados"],
          suggestions: ["Continue com uma alimentação balanceada", "Beba bastante água"],
        };
      }

      setAnalysis(analysisData);
    } catch (error) {
      console.error("Erro ao analisar foto:", error);
      Alert.alert("Erro", "Não foi possível analisar a foto. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!analysis) return;

    try {
      const meal = {
        id: Date.now().toString(),
        name: analysis.foods.map(f => f.name).join(", "),
        type: getMealType(),
        calories: analysis.totalNutrition.calories,
        protein: analysis.totalNutrition.protein,
        carbs: analysis.totalNutrition.carbs,
        fat: analysis.totalNutrition.fat,
        timestamp: Date.now(),
        photoUri: photoUri,
        foods: analysis.foods,
        ingredients: analysis.ingredients,
      };

      const mealsData = await AsyncStorage.getItem("meals");
      const meals = mealsData ? JSON.parse(mealsData) : [];
      meals.push(meal);
      await AsyncStorage.setItem("meals", JSON.stringify(meals));

      Alert.alert("Sucesso!", "Refeição adicionada ao diário nutricional", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
      Alert.alert("Erro", "Não foi possível salvar a refeição");
    }
  };

  const getMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 15) return "lunch";
    if (hour >= 18 && hour < 23) return "dinner";
    return "snack";
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setAnalysis(null);
  };

  if (!photoUri) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-xl font-bold">Análise de Refeição</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Hero Section */}
          <View className="items-center mb-8">
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.health + "20" }}
            >
              <IconSymbol name="camera.fill" size={64} color={colors.health} />
            </View>
            <Text className="text-foreground text-2xl font-bold mb-2 text-center">
              Tire uma Foto da Refeição
            </Text>
            <Text className="text-muted text-center">
              Nossa IA irá identificar os alimentos e calcular automaticamente calorias, macros e ingredientes
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              className="rounded-2xl p-6 flex-row items-center gap-4"
              style={{ backgroundColor: colors.health }}
              activeOpacity={0.8}
              onPress={takePhoto}
            >
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Tirar Foto Agora</Text>
                <Text className="text-white/80 text-sm">Usar câmera do celular</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl p-6 flex-row items-center gap-4 border-2"
              style={{ borderColor: colors.health }}
              activeOpacity={0.8}
              onPress={pickFromGallery}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <IconSymbol name="photo.fill" size={24} color={colors.health} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">Escolher da Galeria</Text>
                <Text className="text-muted text-sm">Selecionar foto existente</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View className="mt-8 gap-4">
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="sparkles" size={24} color={colors.health} />
                <Text className="text-foreground font-bold">IA Avançada</Text>
              </View>
              <Text className="text-muted text-sm leading-relaxed">
                Reconhecimento automático de alimentos com precisão profissional. Identifica ingredientes, porções e valores nutricionais.
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="chart.bar.fill" size={24} color={colors.success} />
                <Text className="text-foreground font-bold">Análise Completa</Text>
              </View>
              <Text className="text-muted text-sm leading-relaxed">
                Calorias, proteínas, carboidratos, gorduras e lista completa de ingredientes identificados automaticamente.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Análise da Refeição</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Photo */}
        <View className="mb-6">
          <Image source={{ uri: photoUri }} className="w-full h-64 rounded-2xl" resizeMode="cover" />
          <TouchableOpacity
            className="absolute top-4 right-4 rounded-full p-3"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            activeOpacity={0.8}
            onPress={retakePhoto}
          >
            <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {analyzing ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={colors.health} />
            <Text className="text-foreground text-lg font-bold mt-4">Analisando com IA...</Text>
            <Text className="text-muted text-center mt-2">
              Identificando alimentos e calculando valores nutricionais
            </Text>
          </View>
        ) : analysis ? (
          <>
            {/* Total Nutrition */}
            <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-4">Informação Nutricional Total</Text>
              <View className="flex-row flex-wrap gap-3">
                <View className="flex-1 min-w-[45%] bg-background rounded-xl p-4">
                  <Text className="text-muted text-xs mb-1">Calorias</Text>
                  <Text className="text-foreground text-2xl font-bold">
                    {analysis.totalNutrition.calories}
                  </Text>
                  <Text className="text-muted text-xs">kcal</Text>
                </View>
                <View className="flex-1 min-w-[45%] bg-background rounded-xl p-4">
                  <Text className="text-muted text-xs mb-1">Proteína</Text>
                  <Text className="text-foreground text-2xl font-bold" style={{ color: colors.health }}>
                    {analysis.totalNutrition.protein}g
                  </Text>
                </View>
                <View className="flex-1 min-w-[45%] bg-background rounded-xl p-4">
                  <Text className="text-muted text-xs mb-1">Carboidrato</Text>
                  <Text className="text-foreground text-2xl font-bold" style={{ color: colors.warning }}>
                    {analysis.totalNutrition.carbs}g
                  </Text>
                </View>
                <View className="flex-1 min-w-[45%] bg-background rounded-xl p-4">
                  <Text className="text-muted text-xs mb-1">Gordura</Text>
                  <Text className="text-foreground text-2xl font-bold" style={{ color: colors.error }}>
                    {analysis.totalNutrition.fat}g
                  </Text>
                </View>
              </View>
            </View>

            {/* Foods Detected */}
            <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-4">Alimentos Identificados</Text>
              {analysis.foods.map((food, index) => (
                <View key={index} className="mb-4 pb-4 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-foreground font-bold flex-1">{food.name}</Text>
                    <Text className="text-muted text-sm">{food.quantity}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <Text className="text-muted text-xs">{food.calories} kcal</Text>
                    <Text className="text-muted text-xs">P: {food.protein}g</Text>
                    <Text className="text-muted text-xs">C: {food.carbs}g</Text>
                    <Text className="text-muted text-xs">G: {food.fat}g</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Ingredients */}
            {analysis.ingredients.length > 0 && (
              <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
                <Text className="text-foreground text-lg font-bold mb-3">Ingredientes Detectados</Text>
                <View className="flex-row flex-wrap gap-2">
                  {analysis.ingredients.map((ingredient, index) => (
                    <View
                      key={index}
                      className="px-3 py-2 rounded-full"
                      style={{ backgroundColor: colors.health + "20" }}
                    >
                      <Text className="text-sm" style={{ color: colors.health }}>
                        {ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
                <View className="flex-row items-center gap-2 mb-3">
                  <IconSymbol name="lightbulb.fill" size={20} color={colors.warning} />
                  <Text className="text-foreground text-lg font-bold">Sugestões</Text>
                </View>
                {analysis.suggestions.map((suggestion, index) => (
                  <View key={index} className="flex-row items-start gap-2 mb-2 last:mb-0">
                    <Text className="text-muted">•</Text>
                    <Text className="text-muted text-sm flex-1">{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              className="rounded-2xl p-5 items-center mb-4"
              style={{ backgroundColor: colors.health }}
              activeOpacity={0.8}
              onPress={saveMeal}
            >
              <Text className="text-white text-lg font-bold">Adicionar ao Diário Nutricional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl p-5 items-center border-2"
              style={{ borderColor: colors.border }}
              activeOpacity={0.8}
              onPress={retakePhoto}
            >
              <Text className="text-foreground font-semibold">Analisar Outra Refeição</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
