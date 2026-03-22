import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "@/components/charts/line-chart";
import { Avatar3DViewer } from "@/components/avatar-3d-viewer";
import { AnimatedComparison } from "@/components/animated-comparison";

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

export default function AvatarEvolutionScreen() {
  const router = useRouter();
  const colors = useColors();
  
  const [scans, setScans] = useState<AvatarScan[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<keyof AvatarScan["measurements"]>("weight");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScans, setSelectedScans] = useState<number[]>([]);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const historyData = await AsyncStorage.getItem("avatar3DHistory");
      if (historyData) {
        const history = JSON.parse(historyData);
        setScans(history);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const toggleScanSelection = (index: number) => {
    if (selectedScans.includes(index)) {
      setSelectedScans(selectedScans.filter(i => i !== index));
    } else if (selectedScans.length < 2) {
      setSelectedScans([...selectedScans, index]);
    }
  };

  const getMetricLabel = (metric: keyof AvatarScan["measurements"]) => {
    const labels = {
      height: "Altura",
      weight: "Peso",
      chest: "Peito",
      waist: "Cintura",
      hips: "Quadril",
      arms: "Braços",
      legs: "Pernas",
    };
    return labels[metric];
  };

  const getMetricUnit = (metric: keyof AvatarScan["measurements"]) => {
    return metric === "weight" ? "kg" : "cm";
  };

  const calculateChange = (oldValue: number, newValue: number) => {
    const change = newValue - oldValue;
    const percentage = ((change / oldValue) * 100).toFixed(1);
    return { change, percentage };
  };

  const chartData = scans.map((scan, index) => ({
    x: scans.length - index,
    y: scan.measurements[selectedMetric],
  })).reverse();

  if (scans.length === 0) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: colors.muted + "33" }}>
            <IconSymbol name="chart.bar" size={40} color={colors.muted} />
          </View>
          <Text className="text-foreground text-xl font-bold mb-3">Nenhum Scan Encontrado</Text>
          <Text className="text-muted text-center mb-6">
            Crie seu primeiro avatar 3D para começar a acompanhar sua evolução
          </Text>
          <TouchableOpacity
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: colors.primary }}
            onPress={() => router.push("/avatar-3d")}
            activeOpacity={0.8}
          >
            <Text className="text-background text-base font-semibold">Criar Avatar</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  if (compareMode && selectedScans.length === 2) {
    const [olderIndex, newerIndex] = selectedScans.sort((a, b) => b - a);
    const olderScan = scans[olderIndex];
    const newerScan = scans[newerIndex];

    return (
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Evolução do Avatar</Text>
          <TouchableOpacity onPress={() => router.push("/avatar-history")} className="p-2 -mr-2">
            <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

          {/* Comparação Animada com Slider */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-muted text-sm">
                {new Date(olderScan.createdAt).toLocaleDateString("pt-BR")}
              </Text>
              <Text className="text-muted text-sm">
                {new Date(newerScan.createdAt).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <AnimatedComparison
              beforeImage={olderScan.photos.frontal || ""}
              afterImage={newerScan.photos.frontal || ""}
              height={400}
            />
            <Text className="text-muted text-xs text-center mt-2">
              ← Arraste o slider para comparar →
            </Text>
          </View>

          {/* Comparação de Medidas */}
          <Text className="text-foreground text-lg font-bold mb-3">Mudanças nas Medidas</Text>
          {(Object.keys(olderScan.measurements) as Array<keyof AvatarScan["measurements"]>).map((metric) => {
            const oldValue = olderScan.measurements[metric];
            const newValue = newerScan.measurements[metric];
            const { change, percentage } = calculateChange(oldValue, newValue);
            const isPositive = change > 0;
            const isNegative = change < 0;

            return (
              <View key={metric} className="bg-surface rounded-2xl p-5 mb-3 border border-border">
                <Text className="text-foreground text-base font-bold mb-3">{getMetricLabel(metric)}</Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-muted text-sm mb-1">Antes</Text>
                    <Text className="text-foreground text-xl font-bold">
                      {oldValue} {getMetricUnit(metric)}
                    </Text>
                  </View>
                  <View className="items-center px-4">
                    <IconSymbol 
                      name={isPositive ? "arrow.up" : isNegative ? "arrow.down" : "minus"} 
                      size={20} 
                      color={isPositive ? colors.success : isNegative ? colors.error : colors.muted} 
                    />
                    <Text 
                      className="text-sm font-semibold mt-1"
                      style={{ color: isPositive ? colors.success : isNegative ? colors.error : colors.muted }}
                    >
                      {isPositive ? "+" : ""}{percentage}%
                    </Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="text-muted text-sm mb-1">Depois</Text>
                    <Text className="text-foreground text-xl font-bold">
                      {newValue} {getMetricUnit(metric)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
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
          <Text className="text-foreground text-xl font-bold">Evolução Corporal</Text>
          <TouchableOpacity 
            onPress={() => setCompareMode(!compareMode)} 
            className="p-2 -mr-2"
            disabled={scans.length < 2}
          >
            <Text className="text-base font-semibold" style={{ color: scans.length < 2 ? colors.muted : colors.primary }}>
              {compareMode ? "Cancelar" : "Comparar"}
            </Text>
          </TouchableOpacity>
        </View>

        {compareMode && (
          <View className="bg-surface rounded-2xl p-4 mb-6 border border-border">
            <Text className="text-foreground text-sm font-semibold mb-2">
              Selecione 2 scans para comparar ({selectedScans.length}/2)
            </Text>
            <Text className="text-muted text-xs">
              Toque nos cards abaixo para selecionar
            </Text>
          </View>
        )}

        {!compareMode && (
          <>
            {/* Seletor de Métrica */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              <View className="flex-row gap-2">
                {(Object.keys(scans[0].measurements) as Array<keyof AvatarScan["measurements"]>).map((metric) => (
                  <TouchableOpacity
                    key={metric}
                    className="rounded-full px-4 py-2 border"
                    style={{
                      backgroundColor: selectedMetric === metric ? colors.primary : "transparent",
                      borderColor: selectedMetric === metric ? colors.primary : colors.border,
                    }}
                    onPress={() => setSelectedMetric(metric)}
                    activeOpacity={0.8}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: selectedMetric === metric ? colors.background : colors.foreground }}
                    >
                      {getMetricLabel(metric)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Gráfico */}
            <View className="bg-surface rounded-2xl p-5 mb-6 border border-border">
              <Text className="text-foreground text-base font-bold mb-4">
                Evolução de {getMetricLabel(selectedMetric)}
              </Text>
              <LineChart
                data={chartData}
                height={200}
                color={colors.primary}
                yLabel={getMetricUnit(selectedMetric)}
              />
            </View>
          </>
        )}

        {/* Lista de Scans */}
        <Text className="text-foreground text-lg font-bold mb-3">Histórico de Scans</Text>
        {scans.map((scan, index) => {
          const isSelected = selectedScans.includes(index);
          const date = new Date(scan.createdAt);
          
          return (
            <TouchableOpacity
              key={index}
              className="bg-surface rounded-2xl p-4 mb-3 border-2"
              style={{ borderColor: isSelected ? colors.primary : colors.border }}
              onPress={() => compareMode ? toggleScanSelection(index) : null}
              activeOpacity={compareMode ? 0.8 : 1}
            >
              <View className="flex-row items-center gap-4">
                <Avatar3DViewer photos={scan.photos} width={80} height={112} />
                <View className="flex-1">
                  <Text className="text-foreground text-base font-bold mb-1">
                    {date.toLocaleDateString("pt-BR")}
                  </Text>
                  <Text className="text-muted text-sm mb-2">
                    {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <View className="bg-background rounded-lg px-2 py-1">
                      <Text className="text-foreground text-xs">
                        {scan.measurements.weight} kg
                      </Text>
                    </View>
                    <View className="bg-background rounded-lg px-2 py-1">
                      <Text className="text-foreground text-xs">
                        {scan.measurements.height} cm
                      </Text>
                    </View>
                  </View>
                </View>
                {compareMode && isSelected && (
                  <View className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <IconSymbol name="checkmark" size={16} color={colors.background} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}
