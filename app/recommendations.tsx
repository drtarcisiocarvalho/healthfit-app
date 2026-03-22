import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Recommendation {
  id: string;
  type: "workout" | "nutrition" | "rest" | "timing" | "intensity";
  title: string;
  description: string;
  icon: string;
  color: string;
  priority: "high" | "medium" | "low";
  action?: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    type: "workout",
    title: "Treino de Força Recomendado",
    description:
      "Baseado no seu histórico, você não treinou membros superiores nos últimos 5 dias. Recomendamos um treino de força para peito e tríceps.",
    icon: "figure.strengthtraining.traditional",
    color: "#FF5722",
    priority: "high",
    action: "Ver Treino",
  },
  {
    id: "2",
    type: "timing",
    title: "Melhor Horário: 18h-19h",
    description:
      "Análise dos seus dados mostra que você tem melhor performance entre 18h e 19h. Seus treinos neste horário queimam 15% mais calorias.",
    icon: "clock.fill",
    color: "#2196F3",
    priority: "medium",
  },
  {
    id: "3",
    type: "rest",
    title: "Dia de Descanso Sugerido",
    description:
      "Você treinou 6 dias seguidos com alta intensidade. Recomendamos um dia de descanso ativo ou alongamento para recuperação muscular.",
    icon: "bed.double.fill",
    color: "#9C27B0",
    priority: "high",
    action: "Ver Alongamentos",
  },
  {
    id: "4",
    type: "nutrition",
    title: "Aumente a Proteína",
    description:
      "Para alcançar sua meta de ganho de massa muscular, aumente a ingestão de proteína para 180g/dia. Atualmente você consome em média 120g/dia.",
    icon: "fork.knife",
    color: "#4CAF50",
    priority: "medium",
    action: "Ver Alimentos",
  },
  {
    id: "5",
    type: "intensity",
    title: "Varie a Intensidade",
    description:
      "Seus últimos 10 treinos foram de alta intensidade. Adicione treinos de intensidade moderada para evitar overtraining e melhorar recuperação.",
    icon: "chart.line.uptrend.xyaxis",
    color: "#FF9800",
    priority: "low",
  },
];

export default function RecommendationsScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular atualização
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.health;
      default:
        return colors.muted;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta Prioridade";
      case "medium":
        return "Média Prioridade";
      case "low":
        return "Baixa Prioridade";
      default:
        return "";
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Recomendações</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <IconSymbol name="sparkles" size={24} color={colors.health} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="p-6 gap-6">
            {/* Info Banner */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-start gap-3">
                <IconSymbol name="sparkles" size={24} color={colors.health} />
                <View className="flex-1">
                  <Text className="text-foreground font-bold mb-1">
                    Recomendações Personalizadas
                  </Text>
                  <Text className="text-muted text-sm">
                    Baseadas em machine learning analisando seus padrões de treino, nutrição, sono
                    e metas
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold" style={{ color: colors.health }}>
                    {recommendations.length}
                  </Text>
                  <Text className="text-muted text-sm mt-1">Recomendações</Text>
                </View>
                <View className="w-px h-12 bg-border" />
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold" style={{ color: colors.success }}>
                    87%
                  </Text>
                  <Text className="text-muted text-sm mt-1">Precisão</Text>
                </View>
                <View className="w-px h-12 bg-border" />
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold" style={{ color: colors.warning }}>
                    12
                  </Text>
                  <Text className="text-muted text-sm mt-1">Seguidas</Text>
                </View>
              </View>
            </View>

            {/* Recommendations List */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Para Você</Text>
              {recommendations.map((rec) => (
                <View
                  key={rec.id}
                  className="bg-surface rounded-2xl p-5 mb-3 border border-border"
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-start gap-3 flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: rec.color + "20" }}
                      >
                        <IconSymbol name={rec.icon as any} size={24} color={rec.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-bold text-lg mb-1">
                          {rec.title}
                        </Text>
                        <View
                          className="self-start px-2 py-1 rounded-full"
                          style={{ backgroundColor: getPriorityColor(rec.priority) + "20" }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{ color: getPriorityColor(rec.priority) }}
                          >
                            {getPriorityLabel(rec.priority)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <Text className="text-muted text-sm mb-4 leading-relaxed">
                    {rec.description}
                  </Text>

                  {/* Action */}
                  {rec.action && (
                    <TouchableOpacity
                      className="rounded-xl p-3 items-center"
                      style={{ backgroundColor: rec.color }}
                      activeOpacity={0.8}
                      onPress={() => {}}
                    >
                      <Text className="text-white font-semibold">{rec.action}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* How it Works */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-foreground font-bold mb-3">Como Funciona?</Text>
              <View className="gap-3">
                <View className="flex-row items-start gap-2">
                  <IconSymbol name="chart.bar.fill" size={20} color={colors.health} />
                  <Text className="text-muted text-sm flex-1">
                    Analisamos seus padrões de treino, nutrição e sono dos últimos 90 dias
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <IconSymbol name="brain.head.profile" size={20} color={colors.health} />
                  <Text className="text-muted text-sm flex-1">
                    Machine learning identifica o que funciona melhor para você
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <IconSymbol name="target" size={20} color={colors.health} />
                  <Text className="text-muted text-sm flex-1">
                    Recomendações personalizadas para ajudar você a alcançar suas metas
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <IconSymbol name="arrow.clockwise" size={20} color={colors.health} />
                  <Text className="text-muted text-sm flex-1">
                    Atualizamos diariamente conforme você progride
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
