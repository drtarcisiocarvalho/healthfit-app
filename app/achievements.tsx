import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "workout" | "streak" | "goal" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  total: number;
  xpReward: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-workout",
    title: "Primeiro Passo",
    description: "Complete seu primeiro treino",
    icon: "🏃",
    category: "workout",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2026-01-20",
    progress: 1,
    total: 1,
    xpReward: 50,
  },
  {
    id: "week-streak",
    title: "Semana Completa",
    description: "Treine 7 dias consecutivos",
    icon: "🔥",
    category: "streak",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2026-01-23",
    progress: 7,
    total: 7,
    xpReward: 200,
  },
  {
    id: "100-workouts",
    title: "Centenário",
    description: "Complete 100 treinos",
    icon: "💯",
    category: "workout",
    rarity: "epic",
    unlocked: false,
    progress: 45,
    total: 100,
    xpReward: 500,
  },
  {
    id: "early-bird",
    title: "Madrugador",
    description: "Treine antes das 7h da manhã",
    icon: "🌅",
    category: "special",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2026-01-22",
    progress: 1,
    total: 1,
    xpReward: 150,
  },
  {
    id: "night-warrior",
    title: "Guerreiro Noturno",
    description: "Treine após as 21h",
    icon: "🌙",
    category: "special",
    rarity: "rare",
    unlocked: false,
    progress: 0,
    total: 1,
    xpReward: 150,
  },
  {
    id: "30-day-streak",
    title: "Mestre da Consistência",
    description: "Mantenha um streak de 30 dias",
    icon: "👑",
    category: "streak",
    rarity: "legendary",
    unlocked: false,
    progress: 7,
    total: 30,
    xpReward: 1000,
  },
  {
    id: "weight-goal",
    title: "Meta Alcançada",
    description: "Atinja sua meta de peso",
    icon: "🎯",
    category: "goal",
    rarity: "epic",
    unlocked: false,
    progress: 3,
    total: 10,
    xpReward: 500,
  },
  {
    id: "marathon",
    title: "Maratonista",
    description: "Corra 42km acumulados",
    icon: "🏅",
    category: "workout",
    rarity: "legendary",
    unlocked: false,
    progress: 12.5,
    total: 42,
    xpReward: 1500,
  },
];

export default function AchievementsScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return colors.muted;
      case "rare":
        return colors.health;
      case "epic":
        return "#9C27B0";
      case "legendary":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Comum";
      case "rare":
        return "Rara";
      case "epic":
        return "Épica";
      case "legendary":
        return "Lendária";
      default:
        return "";
    }
  };

  const filteredAchievements =
    selectedCategory === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === selectedCategory);

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Conquistas</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/subscription")}>
            <IconSymbol name="crown.fill" size={24} color={colors.warning} />
          </TouchableOpacity>
        </View>

        <View className="p-6 gap-6">
          {/* Stats */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center justify-around">
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{unlockedCount}</Text>
                <Text className="text-muted text-sm">Desbloqueadas</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">
                  {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
                </Text>
                <Text className="text-muted text-sm">Progresso</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{totalXP}</Text>
                <Text className="text-muted text-sm">XP Total</Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {[
                  { id: "all", name: "Todas", icon: "square.grid.2x2.fill" },
                  { id: "workout", name: "Treinos", icon: "figure.run" },
                  { id: "streak", name: "Streaks", icon: "flame.fill" },
                  { id: "goal", name: "Metas", icon: "target" },
                  { id: "special", name: "Especiais", icon: "star.fill" },
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    className="px-4 py-2 rounded-xl"
                    style={{
                      backgroundColor:
                        selectedCategory === cat.id ? colors.health + "20" : colors.surface,
                    }}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <View className="flex-row items-center gap-2">
                      <IconSymbol
                        name={cat.icon as any}
                        size={20}
                        color={selectedCategory === cat.id ? colors.health : colors.muted}
                      />
                      <Text
                        className="font-semibold"
                        style={{
                          color: selectedCategory === cat.id ? colors.health : colors.foreground,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Achievements Grid */}
          <View className="flex-row flex-wrap gap-3">
            {filteredAchievements.map((achievement) => (
              <TouchableOpacity
                key={achievement.id}
                className="rounded-2xl p-5 border-2"
                style={{
                  width: "48%",
                  backgroundColor: achievement.unlocked ? colors.surface : colors.surface + "80",
                  borderColor: achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : colors.border,
                  opacity: achievement.unlocked ? 1 : 0.6,
                }}
                activeOpacity={0.8}
                onPress={() => setSelectedAchievement(achievement)}
              >
                {/* Icon */}
                <View className="items-center mb-3">
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-2"
                    style={{
                      backgroundColor: achievement.unlocked
                        ? getRarityColor(achievement.rarity) + "20"
                        : colors.muted + "20",
                    }}
                  >
                    <Text className="text-4xl">{achievement.icon}</Text>
                  </View>
                  {achievement.unlocked && (
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                    >
                      <Text className="text-white text-xs font-bold">
                        {getRarityLabel(achievement.rarity).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Title */}
                <Text className="text-foreground font-bold text-center mb-1">
                  {achievement.title}
                </Text>

                {/* Progress */}
                {!achievement.unlocked && (
                  <View className="mt-2">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-muted text-xs">
                        {achievement.progress}/{achievement.total}
                      </Text>
                      <Text className="text-muted text-xs">
                        {Math.round((achievement.progress / achievement.total) * 100)}%
                      </Text>
                    </View>
                    <View className="h-1.5 rounded-full bg-border overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: getRarityColor(achievement.rarity),
                          width: `${(achievement.progress / achievement.total) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                )}

                {/* XP */}
                <View className="flex-row items-center justify-center gap-1 mt-2">
                  <IconSymbol name="star.fill" size={14} color={colors.warning} />
                  <Text className="text-muted text-xs">+{achievement.xpReward} XP</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Achievement Detail Modal */}
      <Modal
        visible={selectedAchievement !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          {selectedAchievement && (
            <View
              className="rounded-3xl p-8 m-6 border-2"
              style={{
                backgroundColor: colors.background,
                borderColor: getRarityColor(selectedAchievement.rarity),
                maxWidth: 400,
              }}
            >
              {/* Icon */}
              <View className="items-center mb-6">
                <View
                  className="w-32 h-32 rounded-full items-center justify-center mb-4"
                  style={{
                    backgroundColor: getRarityColor(selectedAchievement.rarity) + "20",
                  }}
                >
                  <Text className="text-6xl">{selectedAchievement.icon}</Text>
                </View>
                <View
                  className="px-4 py-2 rounded-full mb-2"
                  style={{ backgroundColor: getRarityColor(selectedAchievement.rarity) }}
                >
                  <Text className="text-white text-sm font-bold">
                    {getRarityLabel(selectedAchievement.rarity).toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Title & Description */}
              <Text className="text-foreground font-bold text-2xl text-center mb-2">
                {selectedAchievement.title}
              </Text>
              <Text className="text-muted text-center mb-6">
                {selectedAchievement.description}
              </Text>

              {/* Progress or Unlocked Date */}
              {selectedAchievement.unlocked ? (
                <View className="bg-surface rounded-xl p-4 mb-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-muted">Desbloqueada em:</Text>
                    <Text className="text-foreground font-bold">
                      {new Date(selectedAchievement.unlockedAt!).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="bg-surface rounded-xl p-4 mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-muted">Progresso:</Text>
                    <Text className="text-foreground font-bold">
                      {selectedAchievement.progress}/{selectedAchievement.total}
                    </Text>
                  </View>
                  <View className="h-2 rounded-full bg-border overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: getRarityColor(selectedAchievement.rarity),
                        width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* XP Reward */}
              <View className="bg-surface rounded-xl p-4 mb-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-muted">Recompensa XP:</Text>
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="star.fill" size={20} color={colors.warning} />
                    <Text className="text-foreground font-bold text-xl">
                      +{selectedAchievement.xpReward}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Buttons */}
              <View className="gap-3">
                {selectedAchievement.unlocked && (
                  <TouchableOpacity
                    className="rounded-xl p-4 items-center"
                    style={{ backgroundColor: colors.health }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedAchievement(null);
                      router.push("/share-achievement");
                    }}
                  >
                    <Text className="text-white font-semibold text-lg">Compartilhar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="rounded-xl p-4 items-center border-2"
                  style={{ borderColor: colors.border }}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAchievement(null)}
                >
                  <Text className="text-foreground font-semibold text-lg">Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}
