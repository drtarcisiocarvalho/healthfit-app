import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  goal: number;
  current: number;
  unit: string;
  reward: number; // XP
  participants: number;
  endDate: string;
  icon: string;
  color: string;
}

const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Desafio 30 Dias de Yoga",
    description: "Complete 30 sessões de yoga em 30 dias",
    type: "monthly",
    goal: 30,
    current: 12,
    unit: "sessões",
    reward: 500,
    participants: 1523,
    endDate: "2026-02-25",
    icon: "figure.mind.and.body",
    color: "#9C27B0",
  },
  {
    id: "2",
    title: "Corrida 100km",
    description: "Corra 100km durante este mês",
    type: "monthly",
    goal: 100,
    current: 45,
    unit: "km",
    reward: 750,
    participants: 3421,
    endDate: "2026-01-31",
    icon: "figure.run",
    color: "#FF5722",
  },
  {
    id: "3",
    title: "Treino Matinal",
    description: "Treine antes das 8h por 7 dias seguidos",
    type: "weekly",
    goal: 7,
    current: 4,
    unit: "dias",
    reward: 300,
    participants: 892,
    endDate: "2026-02-01",
    icon: "sunrise.fill",
    color: "#FF9800",
  },
  {
    id: "4",
    title: "Hidratação Diária",
    description: "Beba 2L de água por dia durante uma semana",
    type: "weekly",
    goal: 7,
    current: 5,
    unit: "dias",
    reward: 200,
    participants: 2156,
    endDate: "2026-02-01",
    icon: "drop.fill",
    color: "#2196F3",
  },
];

const COMPLETED_CHALLENGES: Challenge[] = [
  {
    id: "5",
    title: "Primeira Semana Completa",
    description: "Treinou 5 dias na semana",
    type: "weekly",
    goal: 5,
    current: 5,
    unit: "dias",
    reward: 250,
    participants: 5421,
    endDate: "2026-01-18",
    icon: "checkmark.circle.fill",
    color: "#4CAF50",
  },
];

export default function ChallengesScreen() {
  const colors = useColors();
  const [selectedTab, setSelectedTab] = useState<"active" | "completed">("active");

  const renderChallenge = ({ item }: { item: Challenge }) => {
    const progress = (item.current / item.goal) * 100;
    const isCompleted = item.current >= item.goal;

    return (
      <TouchableOpacity
        className="bg-surface rounded-2xl p-5 border border-border mb-3"
        activeOpacity={0.7}
        onPress={() => {}}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: item.color + "20" }}
              >
                <IconSymbol name={item.icon as any} size={20} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg">{item.title}</Text>
              </View>
            </View>
            <Text className="text-muted text-sm">{item.description}</Text>
          </View>
        </View>

        {/* Progress */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-muted text-sm">
              {item.current} / {item.goal} {item.unit}
            </Text>
            <Text className="text-muted text-sm">{Math.round(progress)}%</Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: isCompleted ? colors.success : item.color,
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-3 border-t border-border">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <IconSymbol name="person.2.fill" size={16} color={colors.muted} />
              <Text className="text-muted text-sm">{item.participants.toLocaleString()}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text className="text-muted text-sm">+{item.reward} XP</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <IconSymbol name="clock.fill" size={16} color={colors.muted} />
            <Text className="text-muted text-sm">
              {new Date(item.endDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        {isCompleted && (
          <View className="absolute top-5 right-5">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.success + "20" }}
            >
              <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                Completo
              </Text>
            </View>
          </View>
        )}
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
          <Text className="text-foreground text-xl font-bold">Desafios</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats Banner */}
        <View className="p-6 pb-3">
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold" style={{ color: colors.health }}>
                  {ACTIVE_CHALLENGES.length}
                </Text>
                <Text className="text-muted text-sm mt-1">Ativos</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold" style={{ color: colors.success }}>
                  {COMPLETED_CHALLENGES.length}
                </Text>
                <Text className="text-muted text-sm mt-1">Completos</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold" style={{ color: colors.warning }}>
                  1250
                </Text>
                <Text className="text-muted text-sm mt-1">XP Ganho</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 pb-3 gap-3">
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: selectedTab === "active" ? colors.health + "20" : colors.surface,
              borderWidth: 1,
              borderColor: selectedTab === "active" ? colors.health : colors.border,
            }}
            activeOpacity={0.7}
            onPress={() => setSelectedTab("active")}
          >
            <Text
              className="font-semibold"
              style={{ color: selectedTab === "active" ? colors.health : colors.foreground }}
            >
              Ativos ({ACTIVE_CHALLENGES.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: selectedTab === "completed" ? colors.health + "20" : colors.surface,
              borderWidth: 1,
              borderColor: selectedTab === "completed" ? colors.health : colors.border,
            }}
            activeOpacity={0.7}
            onPress={() => setSelectedTab("completed")}
          >
            <Text
              className="font-semibold"
              style={{ color: selectedTab === "completed" ? colors.health : colors.foreground }}
            >
              Completos ({COMPLETED_CHALLENGES.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Challenges List */}
        <FlatList
          data={selectedTab === "active" ? ACTIVE_CHALLENGES : COMPLETED_CHALLENGES}
          renderItem={renderChallenge}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 12 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <IconSymbol name="trophy.fill" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">Nenhum desafio encontrado</Text>
            </View>
          }
        />

        {/* Floating Action Button */}
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
