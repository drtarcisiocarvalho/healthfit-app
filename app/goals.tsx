import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Goal {
  id: string;
  type: "workouts" | "weight" | "sleep" | "steps";
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export default function GoalsScreen() {
  const colors = useColors();
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", type: "workouts", title: "Treinos Semanais", current: 3, target: 5, unit: "treinos", icon: "flame.fill" },
    { id: "2", type: "weight", title: "Meta de Peso", current: 75, target: 70, unit: "kg", icon: "scale" },
    { id: "3", type: "sleep", title: "Horas de Sono", current: 6.5, target: 8, unit: "horas", icon: "moon.fill" },
    { id: "4", type: "steps", title: "Passos Diários", current: 7500, target: 10000, unit: "passos", icon: "figure.walk" },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { id: "1", title: "Primeira Semana", description: "Complete 7 dias consecutivos", icon: "star.fill", unlocked: true, unlockedAt: new Date() },
    { id: "2", title: "30 Dias", description: "Mantenha o streak por 30 dias", icon: "flame.fill", unlocked: false },
    { id: "3", title: "100 Treinos", description: "Complete 100 treinos", icon: "trophy.fill", unlocked: false },
    { id: "4", title: "Meta Alcançada", description: "Alcance sua meta de peso", icon: "checkmark.seal.fill", unlocked: false },
    { id: "5", title: "Madrugador", description: "Treine antes das 7h", icon: "sunrise.fill", unlocked: false },
    { id: "6", title: "Guerreiro Noturno", description: "Treine após 21h", icon: "moon.stars.fill", unlocked: true, unlockedAt: new Date() },
  ]);

  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(450);
  const [xpToNextLevel, setXpToNextLevel] = useState(500);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newTarget, setNewTarget] = useState("");

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const editGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewTarget(goal.target.toString());
    setEditModalVisible(true);
  };

  const saveGoal = () => {
    if (!selectedGoal || !newTarget) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id ? { ...g, target: parseFloat(newTarget) } : g
      )
    );
    setEditModalVisible(false);
    setSelectedGoal(null);
    setNewTarget("");
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Metas e Conquistas</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Level Card */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-4 mb-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <Text className="text-2xl font-bold" style={{ color: colors.health }}>
                  {level}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">Nível {level}</Text>
                <Text className="text-muted text-sm">
                  {xp} / {xpToNextLevel} XP
                </Text>
              </View>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: colors.health,
                  width: `${(xp / xpToNextLevel) * 100}%`,
                }}
              />
            </View>
            <Text className="text-muted text-xs mt-2 text-center">
              {xpToNextLevel - xp} XP para o próximo nível
            </Text>
          </View>

          {/* Goals */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Minhas Metas</Text>
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.current, goal.target);
              return (
                <TouchableOpacity
                  key={goal.id}
                  className="bg-surface rounded-2xl p-5 border border-border mb-3"
                  activeOpacity={0.7}
                  onPress={() => editGoal(goal)}
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <IconSymbol name={goal.icon as any} size={24} color={colors.health} />
                    <View className="flex-1">
                      <Text className="text-foreground font-bold">{goal.title}</Text>
                      <Text className="text-muted text-sm">
                        {goal.current} / {goal.target} {goal.unit}
                      </Text>
                    </View>
                    <Text className="text-foreground font-bold">{progress.toFixed(0)}%</Text>
                  </View>
                  <View className="h-2 bg-background rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: colors.health,
                        width: `${progress}%`,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Badges */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Conquistas</Text>
            <View className="flex-row flex-wrap gap-3">
              {badges.map((badge) => (
                <View
                  key={badge.id}
                  className="bg-surface rounded-2xl p-4 border border-border items-center"
                  style={{ width: "30%" }}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{
                      backgroundColor: badge.unlocked
                        ? colors.success + "20"
                        : colors.muted + "20",
                    }}
                  >
                    <IconSymbol
                      name={badge.icon as any}
                      size={24}
                      color={badge.unlocked ? colors.success : colors.muted}
                    />
                  </View>
                  <Text
                    className="text-xs font-bold text-center"
                    style={{ color: badge.unlocked ? colors.foreground : colors.muted }}
                  >
                    {badge.title}
                  </Text>
                  <Text className="text-muted text-xs text-center mt-1">
                    {badge.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weekly Challenge */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <IconSymbol name="trophy.fill" size={24} color={colors.health} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-bold">Desafio Semanal</Text>
                <Text className="text-muted text-sm">Complete 5 treinos esta semana</Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-muted text-sm">Progresso</Text>
              <Text className="text-foreground font-bold">3 / 5</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden mt-2">
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: colors.health,
                  width: "60%",
                }}
              />
            </View>
            <Text className="text-muted text-xs mt-2 text-center">
              Recompensa: +100 XP
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Goal Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-surface rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-foreground text-xl font-bold mb-4">Editar Meta</Text>
            {selectedGoal && (
              <>
                <Text className="text-muted mb-2">{selectedGoal.title}</Text>
                <TextInput
                  className="bg-background rounded-xl p-4 text-foreground border border-border mb-4"
                  placeholder={`Meta (${selectedGoal.unit})`}
                  placeholderTextColor={colors.muted}
                  value={newTarget}
                  onChangeText={setNewTarget}
                  keyboardType="numeric"
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 rounded-xl p-4 items-center border-2"
                    style={{ borderColor: colors.border }}
                    activeOpacity={0.8}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text className="text-foreground font-semibold">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 rounded-xl p-4 items-center"
                    style={{ backgroundColor: colors.health }}
                    activeOpacity={0.8}
                    onPress={saveGoal}
                  >
                    <Text className="text-white font-semibold">Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
