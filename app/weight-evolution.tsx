import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { CartesianChart, Line } from "victory-native";
// import { useFont } from "@shopify/react-native-skia";

interface WeightData {
  date: string;
  weight: number;
  timestamp: number;
  [key: string]: string | number;
}

export default function WeightEvolutionScreen() {
  const colors = useColors();
  const [data, setData] = useState<WeightData[]>([]);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  // Gráfico simplificado sem interatividade

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem("bodyComposition");
      if (!stored) {
        setData([]);
        return;
      }

      const compositions = JSON.parse(stored);
      const now = Date.now();
      const periodMs = {
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
        "all": Infinity,
      };

      const filtered = compositions
        .filter((c: any) => c.weight > 0)
        .filter((c: any) => now - new Date(c.date).getTime() < periodMs[period])
        .map((c: any) => ({
          date: new Date(c.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
          weight: c.weight,
          timestamp: new Date(c.date).getTime(),
        }))
        .sort((a: WeightData, b: WeightData) => a.timestamp - b.timestamp);

      setData(filtered);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const getStats = () => {
    if (data.length === 0) return { current: 0, min: 0, max: 0, change: 0 };
    const weights = data.map((d) => d.weight);
    const current = weights[weights.length - 1];
    const first = weights[0];
    return {
      current,
      min: Math.min(...weights),
      max: Math.max(...weights),
      change: current - first,
    };
  };

  const stats = getStats();
  // const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Evolução de Peso</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {/* Filtros de Período */}
          <View className="flex-row gap-2 mb-6">
            {(["7d", "30d", "90d", "all"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                className="flex-1 rounded-xl p-3 border"
                style={{
                  backgroundColor: period === p ? colors.primary : colors.surface,
                  borderColor: period === p ? colors.primary : colors.border,
                }}
                activeOpacity={0.7}
                onPress={() => setPeriod(p)}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: period === p ? colors.background : colors.foreground }}
                >
                  {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "Tudo"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Estatísticas */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Atual</Text>
              <Text className="text-foreground text-2xl font-bold">{stats.current.toFixed(1)}</Text>
              <Text className="text-muted text-xs">kg</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Variação</Text>
              <Text
                className="text-2xl font-bold"
                style={{ color: stats.change >= 0 ? colors.error : colors.success }}
              >
                {stats.change >= 0 ? "+" : ""}
                {stats.change.toFixed(1)}
              </Text>
              <Text className="text-muted text-xs">kg</Text>
            </View>
          </View>

          {/* Gráfico */}
          {data.length > 0 ? (
            <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
              <Text className="text-foreground text-lg font-semibold mb-4">Gráfico de Evolução</Text>
              <View style={{ height: 250 }}>
                <CartesianChart
                  data={data}
                  xKey="date"
                  yKeys={["weight"]}
                  axisOptions={{
                    labelColor: colors.muted,
                    lineColor: colors.border,
                    formatXLabel: (value) => {
                      const item = data.find((d) => d.date === value);
                      return item ? item.date : "";
                    },
                  }}
                >
                  {({ points }) => (
                    <Line
                      points={points.weight}
                      color={colors.health}
                      strokeWidth={3}
                      curveType="catmullRom"
                    />
                  )}
                </CartesianChart>
              </View>
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-8 border border-border items-center">
              <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">
                Nenhum dado de peso registrado ainda.{"\n"}Adicione uma avaliação de composição corporal.
              </Text>
            </View>
          )}

          {/* Histórico */}
          {data.length > 0 && (
            <View className="mb-6">
              <Text className="text-foreground text-lg font-semibold mb-3">Histórico</Text>
              {data.slice().reverse().map((item, index) => (
                <View
                  key={index}
                  className="bg-surface rounded-xl p-4 mb-2 border border-border flex-row justify-between items-center"
                >
                  <Text className="text-foreground">{item.date}</Text>
                  <Text className="text-foreground text-lg font-bold">{item.weight.toFixed(1)} kg</Text>
                </View>
              ))}
            </View>
          )}

          <View className="h-20" />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
