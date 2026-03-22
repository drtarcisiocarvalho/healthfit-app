import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";


interface Insight {
  id: string;
  type: "positive" | "warning" | "info";
  title: string;
  description: string;
  icon: string;
}

export default function InsightsScreen() {
  const colors = useColors();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    try {
      loadInsights();
      generateAIInsights();
    } catch (err) {
      console.error("Erro ao carregar insights:", err);
      setError("Erro ao carregar insights. Tente novamente.");
      setLoading(false);
    }
  }, []);

  const loadInsights = async () => {
    // Simular insights baseados em dados
    const mockInsights: Insight[] = [
      {
        id: "1",
        type: "positive",
        title: "Melhor Horário para Treinar",
        description: "Seus treinos das 18h têm 30% mais duração. Continue treinando neste horário!",
        icon: "clock.fill",
      },
      {
        id: "2",
        type: "info",
        title: "Correlação Sono x Performance",
        description: "Quando você dorme 8h+, seus treinos são 25% mais intensos.",
        icon: "moon.stars.fill",
      },
      {
        id: "3",
        type: "warning",
        title: "Meta de Peso",
        description: "Você está a 2kg da sua meta! Ajuste sua dieta para acelerar os resultados.",
        icon: "scale",
      },
      {
        id: "4",
        type: "positive",
        title: "Consistência Excelente",
        description: "Você treinou 4 vezes esta semana. Está acima da média!",
        icon: "flame.fill",
      },
      {
        id: "5",
        type: "info",
        title: "Frequência Cardíaca",
        description: "Sua FC em repouso diminuiu 5 bpm no último mês. Ótimo progresso cardiovascular!",
        icon: "heart.fill",
      },
    ];

    setInsights(mockInsights);
    setLoading(false);
  };

  const generateAIInsights = async () => {
    try {
      // Carregar dados do usuário
      const workoutsData = await AsyncStorage.getItem("workouts");
      const vitalSignsData = await AsyncStorage.getItem("vitalSigns");
      const bodyCompositionData = await AsyncStorage.getItem("bodyCompositions");

      const workouts = workoutsData ? JSON.parse(workoutsData) : [];
      const vitalSigns = vitalSignsData ? JSON.parse(vitalSignsData) : [];
      const bodyCompositions = bodyCompositionData ? JSON.parse(bodyCompositionData) : [];

      const context = `
Analise os dados de saúde e fitness do usuário e forneça insights personalizados:

TREINOS (últimos ${workouts.length}):
${workouts.slice(0, 5).map((w: any) => `- ${w.type}: ${w.duration} min, ${w.calories} cal`).join("\n")}

SINAIS VITAIS (últimos ${vitalSigns.length}):
${vitalSigns.slice(0, 3).map((v: any) => `- ${v.type}: ${v.value} ${v.unit}`).join("\n")}

COMPOSIÇÃO CORPORAL:
${bodyCompositions.length > 0 ? `Peso: ${bodyCompositions[0].weight}kg, IMC: ${bodyCompositions[0].bmi}` : "Sem dados"}

Forneça 3 insights acionáveis e personalizados em formato de lista.
`;

      // Análise local baseada nos dados
      let analysis = [];
      
      if (workouts.length > 0) {
        const avgCalories = workouts.reduce((sum: number, w: any) => sum + (w.calories || 0), 0) / workouts.length;
        const avgDuration = workouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0) / workouts.length;
        analysis.push(`• Você queima em média ${Math.round(avgCalories)} calorias por treino com duração média de ${Math.round(avgDuration)} minutos`);
      }
      
      if (vitalSigns.length > 0) {
        const heartRates = vitalSigns.filter((v: any) => v.type === 'heart_rate');
        if (heartRates.length > 0) {
          const avgHR = heartRates.reduce((sum: number, v: any) => sum + v.value, 0) / heartRates.length;
          analysis.push(`• Sua frequência cardíaca média é ${Math.round(avgHR)} bpm, ${avgHR < 70 ? 'excelente para saúde cardiovascular' : 'considere exercícios aeróbicos'}`);
        }
      }
      
      if (bodyCompositions.length > 0) {
        const bmi = bodyCompositions[0].bmi;
        if (bmi < 18.5) {
          analysis.push(`• Seu IMC está abaixo do ideal. Considere aumentar ingestão calórica e treino de força`);
        } else if (bmi >= 18.5 && bmi < 25) {
          analysis.push(`• Seu IMC está na faixa saudável. Continue mantendo seus hábitos atuais!`);
        } else if (bmi >= 25 && bmi < 30) {
          analysis.push(`• Seu IMC indica sobrepeso. Combine exercícios e dieta balanceada para melhores resultados`);
        } else {
          analysis.push(`• Consulte um profissional de saúde para um plano personalizado de emagrecimento`);
        }
      }
      
      if (analysis.length === 0) {
        analysis = [
          "• Continue mantendo sua consistência nos treinos",
          "• Monitore seus sinais vitais regularmente",
          "• Ajuste suas metas conforme seu progresso"
        ];
      }
      
      setAiAnalysis(analysis.join('\n'));
    } catch (error) {
      console.error("Erro ao gerar insights com IA:", error);
      setAiAnalysis(
        "• Continue mantendo sua consistência nos treinos\n• Monitore seus sinais vitais regularmente\n• Ajuste suas metas conforme seu progresso"
      );
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return colors.success;
      case "warning":
        return colors.warning;
      case "info":
        return colors.health;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Insights e Análises</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* AI Analysis Card */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <IconSymbol name="sparkles" size={24} color={colors.health} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">Análise com IA</Text>
                <Text className="text-muted text-sm">Insights personalizados para você</Text>
              </View>
            </View>

            {aiAnalysis ? (
              <Text className="text-foreground leading-relaxed">{aiAnalysis}</Text>
            ) : (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={colors.health} />
                <Text className="text-muted text-sm mt-2">Gerando análise...</Text>
              </View>
            )}
          </View>

          {/* Insights List */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Insights Detectados</Text>
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={colors.health} />
              </View>
            ) : (
              insights.map((insight) => (
                <View
                  key={insight.id}
                  className="bg-surface rounded-2xl p-5 border border-border mb-3"
                >
                  <View className="flex-row items-start gap-3">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: getInsightColor(insight.type) + "20" }}
                    >
                      <IconSymbol
                        name={insight.icon as any}
                        size={20}
                        color={getInsightColor(insight.type)}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold mb-1">{insight.title}</Text>
                      <Text className="text-muted text-sm leading-relaxed">
                        {insight.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Recommendations */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">Recomendações</Text>
            <View className="gap-3">
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Mantenha uma rotina consistente de treinos para melhores resultados
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Priorize 7-8 horas de sono para otimizar recuperação muscular
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Monitore seus sinais vitais regularmente para detectar mudanças precoces
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Ajuste suas metas conforme seu progresso para mantê-las desafiadoras mas alcançáveis
                </Text>
              </View>
            </View>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center border-2"
            style={{ borderColor: colors.health }}
            activeOpacity={0.8}
            onPress={() => {
              setLoading(true);
              loadInsights();
              generateAIInsights();
            }}
          >
            <Text className="font-semibold" style={{ color: colors.health }}>
              Atualizar Análise
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
