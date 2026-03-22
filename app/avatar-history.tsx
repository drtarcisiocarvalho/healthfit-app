import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { exportProgressReport } from "@/lib/pdf-export";
import { Alert } from "react-native";

interface AvatarScan {
  photos: {
    frontal?: string;
    lateral?: string;
    costas?: string;
  };
  measurements: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    legs: number;
  };
  createdAt: string;
}

export default function AvatarHistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [history, setHistory] = useState<AvatarScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem("avatar3DHistory");
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    try {
      await exportProgressReport(history);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      Alert.alert("Erro", "Não foi possível exportar o relatório. Tente novamente.");
    }
  };

  const shareProgress = async () => {
    if (history.length < 2) {
      alert("Você precisa de pelo menos 2 scans para compartilhar o progresso");
      return;
    }

    const first = history[history.length - 1];
    const latest = history[0];

    const weightChange = latest.measurements.weight - first.measurements.weight;
    const waistChange = latest.measurements.waist - first.measurements.waist;

    const message = `🎯 Meu Progresso no HealthFit!\n\n` +
      `📊 Peso: ${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}kg\n` +
      `📏 Cintura: ${waistChange > 0 ? "+" : ""}${waistChange}cm\n\n` +
      `💪 Continue acompanhando sua evolução com o HealthFit!`;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Em produção, gerar imagem com gráficos e compartilhar
        alert(message);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const renderChart = () => {
    if (history.length < 2) {
      return (
        <View className="bg-surface rounded-2xl p-6 items-center border border-border">
          <Text className="text-muted text-center">
            Faça mais scans para ver gráficos de evolução
          </Text>
        </View>
      );
    }

    const screenWidth = Dimensions.get("window").width - 48;
    const chartHeight = 200;
    const padding = 40;
    const chartWidth = screenWidth - padding * 2;

    // Dados de peso
    const weights = history.slice(0, 10).reverse().map(s => s.measurements.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const weightRange = maxWeight - minWeight || 1;

    // Calcular pontos do gráfico
    const points = weights.map((weight, index) => {
      const x = padding + (index / (weights.length - 1)) * chartWidth;
      const y = chartHeight - padding - ((weight - minWeight) / weightRange) * (chartHeight - padding * 2);
      return { x, y, weight };
    });

    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-foreground font-bold text-lg mb-4">Evolução de Peso</Text>
        
        {/* Gráfico simplificado com View */}
        <View style={{ height: chartHeight, position: "relative" }}>
          {/* Linha de base */}
          <View
            style={{
              position: "absolute",
              bottom: padding,
              left: padding,
              right: padding,
              height: 1,
              backgroundColor: colors.border,
            }}
          />

          {/* Pontos do gráfico */}
          {points.map((point, index) => (
            <View key={index}>
              {/* Linha conectando pontos */}
              {index > 0 && (
                <View
                  style={{
                    position: "absolute",
                    left: points[index - 1].x,
                    top: points[index - 1].y,
                    width: Math.sqrt(
                      Math.pow(point.x - points[index - 1].x, 2) +
                      Math.pow(point.y - points[index - 1].y, 2)
                    ),
                    height: 2,
                    backgroundColor: colors.primary,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          point.y - points[index - 1].y,
                          point.x - points[index - 1].x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "left center",
                  }}
                />
              )}

              {/* Ponto */}
              <View
                style={{
                  position: "absolute",
                  left: point.x - 6,
                  top: point.y - 6,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                  borderWidth: 2,
                  borderColor: colors.background,
                }}
              />
            </View>
          ))}

          {/* Labels */}
          <Text
            style={{
              position: "absolute",
              left: 0,
              top: chartHeight - padding + 10,
              fontSize: 12,
              color: colors.muted,
            }}
          >
            Início
          </Text>
          <Text
            style={{
              position: "absolute",
              right: 0,
              top: chartHeight - padding + 10,
              fontSize: 12,
              color: colors.muted,
            }}
          >
            Hoje
          </Text>
          <Text
            style={{
              position: "absolute",
              left: 0,
              top: 10,
              fontSize: 12,
              color: colors.muted,
            }}
          >
            {maxWeight}kg
          </Text>
          <Text
            style={{
              position: "absolute",
              left: 0,
              bottom: padding + 10,
              fontSize: 12,
              color: colors.muted,
            }}
          >
            {minWeight}kg
          </Text>
        </View>

        {/* Estatísticas */}
        <View className="flex-row justify-around mt-4 pt-4 border-t border-border">
          <View className="items-center">
            <Text className="text-muted text-sm">Inicial</Text>
            <Text className="text-foreground font-bold text-lg">
              {weights[0]}kg
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-muted text-sm">Atual</Text>
            <Text className="text-foreground font-bold text-lg">
              {weights[weights.length - 1]}kg
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-muted text-sm">Mudança</Text>
            <Text
              className="font-bold text-lg"
              style={{
                color:
                  weights[weights.length - 1] - weights[0] < 0
                    ? colors.success
                    : colors.error,
              }}
            >
              {weights[weights.length - 1] - weights[0] > 0 ? "+" : ""}
              {(weights[weights.length - 1] - weights[0]).toFixed(1)}kg
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-muted">Carregando histórico...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Histórico de Evolução</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={exportPDF} className="p-2">
              <IconSymbol name="doc.fill" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareProgress} className="p-2 -mr-2">
              <IconSymbol name="paperplane.fill" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gráfico */}
        {renderChart()}

        {/* Lista de Scans */}
        <Text className="text-foreground font-bold text-lg mt-6 mb-3">
          Scans Anteriores ({history.length})
        </Text>

        {history.length === 0 ? (
          <View className="bg-surface rounded-2xl p-6 items-center border border-border">
            <IconSymbol name="camera.fill" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-3">
              Nenhum scan realizado ainda
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {history.map((scan, index) => (
              <View
                key={index}
                className="bg-surface rounded-2xl p-4 border border-border"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-foreground font-semibold">
                    Scan #{history.length - index}
                  </Text>
                  <Text className="text-muted text-sm">
                    {new Date(scan.createdAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <View className="flex-1 min-w-[100px]">
                    <Text className="text-muted text-xs">Peso</Text>
                    <Text className="text-foreground font-semibold">
                      {scan.measurements.weight}kg
                    </Text>
                  </View>
                  <View className="flex-1 min-w-[100px]">
                    <Text className="text-muted text-xs">Altura</Text>
                    <Text className="text-foreground font-semibold">
                      {scan.measurements.height}cm
                    </Text>
                  </View>
                  <View className="flex-1 min-w-[100px]">
                    <Text className="text-muted text-xs">Cintura</Text>
                    <Text className="text-foreground font-semibold">
                      {scan.measurements.waist}cm
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
