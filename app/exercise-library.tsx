import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Exercise {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility";
  difficulty: "beginner" | "intermediate" | "advanced";
  muscles: string[];
  description: string;
  sets?: number;
  reps?: number;
  duration?: number; // em segundos
}

const EXERCISES: Exercise[] = [
  // Força
  { id: "1", name: "Flexão de Braço", category: "strength", difficulty: "beginner", muscles: ["Peitoral", "Tríceps"], description: "Exercício clássico para parte superior do corpo", sets: 3, reps: 12 },
  { id: "2", name: "Agachamento", category: "strength", difficulty: "beginner", muscles: ["Quadríceps", "Glúteos"], description: "Fundamental para pernas e glúteos", sets: 3, reps: 15 },
  { id: "3", name: "Prancha", category: "strength", difficulty: "intermediate", muscles: ["Core", "Abdômen"], description: "Fortalecimento do core", duration: 60 },
  { id: "4", name: "Levantamento Terra", category: "strength", difficulty: "advanced", muscles: ["Lombar", "Glúteos", "Posterior"], description: "Exercício composto para corpo todo", sets: 4, reps: 8 },
  { id: "5", name: "Supino", category: "strength", difficulty: "intermediate", muscles: ["Peitoral", "Tríceps", "Ombros"], description: "Desenvolvimento do peitoral", sets: 4, reps: 10 },
  
  // Cardio
  { id: "6", name: "Corrida", category: "cardio", difficulty: "beginner", muscles: ["Pernas", "Cardiovascular"], description: "Exercício aeróbico completo", duration: 1800 },
  { id: "7", name: "Burpees", category: "cardio", difficulty: "advanced", muscles: ["Corpo todo"], description: "HIIT de alta intensidade", sets: 3, reps: 15 },
  { id: "8", name: "Pular Corda", category: "cardio", difficulty: "intermediate", muscles: ["Panturrilha", "Cardiovascular"], description: "Cardio de alta intensidade", duration: 600 },
  { id: "9", name: "Mountain Climbers", category: "cardio", difficulty: "intermediate", muscles: ["Core", "Ombros"], description: "Exercício dinâmico para core", sets: 3, reps: 20 },
  
  // Flexibilidade
  { id: "10", name: "Alongamento de Isquiotibiais", category: "flexibility", difficulty: "beginner", muscles: ["Posterior"], description: "Alongamento para parte posterior das pernas", duration: 30 },
  { id: "11", name: "Yoga - Cachorro olhando para baixo", category: "flexibility", difficulty: "beginner", muscles: ["Posterior", "Ombros"], description: "Postura clássica de yoga", duration: 60 },
  { id: "12", name: "Alongamento de Quadríceps", category: "flexibility", difficulty: "beginner", muscles: ["Quadríceps"], description: "Alongamento frontal das pernas", duration: 30 },
];

export default function ExerciseLibraryScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Todos", icon: "list.bullet" },
    { id: "strength", label: "Força", icon: "dumbbell.fill" },
    { id: "cardio", label: "Cardio", icon: "heart.fill" },
    { id: "flexibility", label: "Flexibilidade", icon: "figure.flexibility" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
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

  const filteredExercises = EXERCISES.filter((exercise) => {
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderExercise = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 border border-border mb-3"
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold mb-1">{item.name}</Text>
          <Text className="text-muted text-sm">{item.muscles.join(", ")}</Text>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: getDifficultyColor(item.difficulty) + "20" }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: getDifficultyColor(item.difficulty) }}
          >
            {getDifficultyLabel(item.difficulty)}
          </Text>
        </View>
      </View>

      <Text className="text-muted text-sm mb-3">{item.description}</Text>

      <View className="flex-row gap-4">
        {item.sets && (
          <View className="flex-row items-center gap-1">
            <IconSymbol name="repeat" size={16} color={colors.muted} />
            <Text className="text-muted text-sm">
              {item.sets} séries x {item.reps} reps
            </Text>
          </View>
        )}
        {item.duration && (
          <View className="flex-row items-center gap-1">
            <IconSymbol name="clock.fill" size={16} color={colors.muted} />
            <Text className="text-muted text-sm">{Math.floor(item.duration / 60)} min</Text>
          </View>
        )}
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
          <Text className="text-foreground text-xl font-bold">Biblioteca de Exercícios</Text>
          <TouchableOpacity onPress={() => router.push("/workout-plans")} activeOpacity={0.7}>
            <IconSymbol name="plus.circle.fill" size={28} color={colors.health} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="p-6 pb-3">
          <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 border border-border">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 ml-2 text-foreground"
              placeholder="Buscar exercícios..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 pb-3"
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="px-4 py-2 rounded-full flex-row items-center gap-2"
              style={{
                backgroundColor:
                  selectedCategory === category.id ? colors.health + "20" : colors.surface,
                borderWidth: 1,
                borderColor: selectedCategory === category.id ? colors.health : colors.border,
              }}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? colors.health : colors.muted}
              />
              <Text
                className="font-semibold"
                style={{
                  color: selectedCategory === category.id ? colors.health : colors.foreground,
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercises List */}
        <FlatList
          data={filteredExercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 12 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">Nenhum exercício encontrado</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
