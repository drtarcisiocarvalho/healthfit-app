import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FoodData {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

// Banco de dados simulado de alimentos
const FOOD_DATABASE: Record<string, FoodData> = {
  "7891000100103": {
    name: "Leite Integral",
    brand: "Marca Exemplo",
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    serving: "100ml",
  },
  "7896024700001": {
    name: "Arroz Branco",
    brand: "Marca Exemplo",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    serving: "100g",
  },
  "7891000053508": {
    name: "Feijão Preto",
    brand: "Marca Exemplo",
    calories: 77,
    protein: 4.5,
    carbs: 14,
    fat: 0.5,
    serving: "100g",
  },
};

export default function FoodScannerScreen() {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-foreground text-center">Carregando câmera...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <IconSymbol name="barcode.viewfinder" size={64} color={colors.muted} />
          <Text className="text-foreground text-xl font-bold mt-4 text-center">
            Permissão de Câmera Necessária
          </Text>
          <Text className="text-muted text-center mt-2 mb-6">
            Para escanear códigos de barras, precisamos acessar sua câmera
          </Text>
          <TouchableOpacity
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={requestPermission}
          >
            <Text className="text-white font-semibold">Permitir Câmera</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Buscar alimento no banco de dados
    const food = FOOD_DATABASE[data];
    
    if (food) {
      Alert.alert(
        "Alimento Encontrado!",
        `${food.name} - ${food.brand}\n\n` +
        `Porção: ${food.serving}\n` +
        `Calorias: ${food.calories} kcal\n` +
        `Proteína: ${food.protein}g\n` +
        `Carboidrato: ${food.carbs}g\n` +
        `Gordura: ${food.fat}g`,
        [
          {
            text: "Cancelar",
            onPress: () => setScanned(false),
            style: "cancel",
          },
          {
            text: "Adicionar",
            onPress: () => addMeal(food),
          },
        ]
      );
    } else {
      Alert.alert(
        "Alimento Não Encontrado",
        `Código: ${data}\n\nEste produto não está em nosso banco de dados. Deseja adicionar manualmente?`,
        [
          {
            text: "Não",
            onPress: () => setScanned(false),
            style: "cancel",
          },
          {
            text: "Adicionar Manual",
            onPress: () => {
              setScanned(false);
              Alert.alert("Adicionar Refeição", "Funcionalidade em desenvolvimento");
            },
          },
        ]
      );
    }
  };

  const addMeal = async (food: FoodData) => {
    try {
      const meal = {
        id: Date.now().toString(),
        name: `${food.name} - ${food.brand}`,
        type: getMealType(),
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        timestamp: Date.now(),
      };

      const mealsData = await AsyncStorage.getItem("meals");
      const meals = mealsData ? JSON.parse(mealsData) : [];
      meals.push(meal);
      await AsyncStorage.setItem("meals", JSON.stringify(meals));

      Alert.alert("Sucesso!", "Alimento adicionado ao diário", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao adicionar refeição:", error);
      Alert.alert("Erro", "Não foi possível adicionar o alimento");
      setScanned(false);
    }
  };

  const getMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 15) return "lunch";
    if (hour >= 18 && hour < 23) return "dinner";
    return "snack";
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-6">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Scanner de Alimentos</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Camera */}
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
        >
          {/* Scanning Frame */}
          <View className="flex-1 items-center justify-center">
            <View className="relative">
              <View
                className="w-72 h-48 rounded-2xl border-4"
                style={{ borderColor: scanned ? colors.success : "rgba(255,255,255,0.8)" }}
              />
              {/* Corner indicators */}
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
            </View>
          </View>

          {/* Instructions */}
          <View className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: colors.background }}>
            <View className="bg-surface rounded-xl p-5 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="barcode.viewfinder" size={32} color={colors.health} />
                <View className="flex-1">
                  <Text className="text-foreground font-bold">Como usar</Text>
                  <Text className="text-muted text-sm">Posicione o código de barras no centro</Text>
                </View>
              </View>
              
              {scanned && (
                <TouchableOpacity
                  className="rounded-xl p-3 items-center mt-2"
                  style={{ backgroundColor: colors.health }}
                  activeOpacity={0.8}
                  onPress={() => setScanned(false)}
                >
                  <Text className="text-white font-semibold">Escanear Novamente</Text>
                </TouchableOpacity>
              )}

              <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-border">
                <IconSymbol name="info.circle" size={16} color={colors.muted} />
                <Text className="text-muted text-xs flex-1">
                  Funciona com códigos EAN-13, EAN-8, UPC-A e UPC-E
                </Text>
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    </ScreenContainer>
  );
}
