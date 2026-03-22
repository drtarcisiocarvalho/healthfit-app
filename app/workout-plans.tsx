import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // em minutos
  exercises: number;
  category: string;
}

const PRESET_PLANS: WorkoutPlan[] = [
  {
    id: "preset-1",
    name: "Treino Full Body Iniciante",
    description: "Treino completo para todo o corpo, ideal para começar",
    level: "beginner",
    duration: 30,
    exercises: 6,
    category: "Força",
  },
  {
    id: "preset-2",
    name: "HIIT 20 Minutos",
    description: "Treino intervalado de alta intensidade",
    level: "intermediate",
    duration: 20,
    exercises: 8,
    category: "Cardio",
  },
  {
    id: "preset-3",
    name: "Yoga Matinal",
    description: "Sequência de yoga para começar o dia",
    level: "beginner",
    duration: 15,
    exercises: 10,
    category: "Flexibilidade",
  },
  {
    id: "preset-4",
    name: "Treino de Força Avançado",
    description: "Treino intenso com foco em hipertrofia",
    level: "advanced",
    duration: 60,
    exercises: 12,
    category: "Força",
  },
  {
    id: "preset-5",
    name: "Cardio Leve",
    description: "Treino aeróbico de baixo impacto",
    level: "beginner",
    duration: 25,
    exercises: 5,
    category: "Cardio",
  },
];

export default function WorkoutPlansScreen() {
  const colors = useColors();
  const [customPlans, setCustomPlans] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    loadCustomPlans();
  }, []);

  const loadCustomPlans = async () => {
    try {
      const plans = await AsyncStorage.getItem("customWorkoutPlans");
      if (plans) {
        setCustomPlans(JSON.parse(plans));
      }
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return colors.success;
      case "intermediate":
        return colors.warning;
      case "advanced":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Iniciante";
      case "intermediate":
        return "Intermediário";
      case "advanced":
        return "Avançado";
      default:
        return "";
    }
  };

  const renderPlan = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 border border-border mb-3"
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold mb-1">{item.name}</Text>
          <Text className="text-muted text-sm">{item.description}</Text>
        </View>
        <View
          className="px-3 py-1 rounded-full ml-2"
          style={{ backgroundColor: getLevelColor(item.level) + "20" }}
        >
          <Text className="text-xs font-semibold" style={{ color: getLevelColor(item.level) }}>
            {getLevelLabel(item.level)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <IconSymbol name="clock.fill" size={16} color={colors.muted} />
          <Text className="text-muted text-sm">{item.duration} min</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconSymbol name="list.bullet" size={16} color={colors.muted} />
          <Text className="text-muted text-sm">{item.exercises} exercícios</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconSymbol name="tag.fill" size={16} color={colors.muted} />
          <Text className="text-muted text-sm">{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Planos de Treino</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Create New Plan Button */}
            <TouchableOpacity
              className="rounded-xl p-4 items-center mb-6 flex-row justify-center gap-2"
              style={{ backgroundColor: colors.health }}
              activeOpacity={0.8}
              onPress={() => router.push("/exercise-library")}
            >
              <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
              <Text className="text-white font-semibold text-base">Criar Plano Personalizado</Text>
            </TouchableOpacity>

            {/* Custom Plans */}
            {customPlans.length > 0 && (
              <View className="mb-6">
                <Text className="text-foreground text-lg font-bold mb-3">Meus Planos</Text>
                <FlatList
                  data={customPlans}
                  renderItem={renderPlan}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Preset Plans */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Planos Pré-definidos</Text>
              <FlatList
                data={PRESET_PLANS}
                renderItem={renderPlan}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
