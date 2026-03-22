import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { VitalSignsModal } from "@/components/vital-signs-modal";

interface VitalSigns {
  id: string;
  date: string;
  bloodPressure?: string;
  glucose?: string;
  heartRate?: string;
  spo2?: string;
  temperature?: string;
}

export default function HealthScreen() {
  const colors = useColors();
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const [latestVitalSigns, setLatestVitalSigns] = useState<VitalSigns | null>(null);

  useEffect(() => {
    loadLatestVitalSigns();
  }, []);

  const loadLatestVitalSigns = async () => {
    try {
      const stored = await AsyncStorage.getItem("vitalSigns");
      if (stored) {
        const vitalSigns: VitalSigns[] = JSON.parse(stored);
        if (vitalSigns.length > 0) {
          setLatestVitalSigns(vitalSigns[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar sinais vitais:", error);
    }
  };

  const handleSaveVitalSigns = async (data: {
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
    glucose: string;
    heartRate: string;
    spo2: string;
    temperature: string;
  }) => {
    const newVitalSigns: VitalSigns = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      bloodPressure: data.bloodPressureSystolic && data.bloodPressureDiastolic
        ? `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic}`
        : undefined,
      glucose: data.glucose || undefined,
      heartRate: data.heartRate || undefined,
      spo2: data.spo2 || undefined,
      temperature: data.temperature || undefined,
    };

    try {
      const stored = await AsyncStorage.getItem("vitalSigns");
      const vitalSigns: VitalSigns[] = stored ? JSON.parse(stored) : [];
      const updatedVitalSigns = [newVitalSigns, ...vitalSigns];
      await AsyncStorage.setItem("vitalSigns", JSON.stringify(updatedVitalSigns));
      setLatestVitalSigns(newVitalSigns);
    } catch (error) {
      console.error("Erro ao salvar sinais vitais:", error);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-3xl font-bold mb-6">Saúde</Text>

        {/* Card de Composição Corporal */}
        <TouchableOpacity
          className="bg-surface rounded-2xl p-5 mb-4 border border-border"
          activeOpacity={0.7}
          onPress={() => router.push("/body-composition")}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.health + "33" }}>
                <IconSymbol name="heart.fill" size={24} color={colors.health} />
              </View>
              <Text className="text-foreground text-xl font-semibold">Composição Corporal</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </View>
          
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-muted text-sm mb-1">Peso</Text>
              <Text className="text-foreground text-2xl font-bold">--</Text>
            </View>
            <View>
              <Text className="text-muted text-sm mb-1">IMC</Text>
              <Text className="text-foreground text-2xl font-bold">--</Text>
            </View>
            <View>
              <Text className="text-muted text-sm mb-1">Gordura</Text>
              <Text className="text-foreground text-2xl font-bold">--%</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-background rounded-lg p-2 flex-row items-center justify-center gap-2"
            activeOpacity={0.7}
            onPress={() => router.push("/weight-evolution")}
          >
            <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={colors.health} />
            <Text className="text-sm font-semibold" style={{ color: colors.health }}>Ver Evolução</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Cards de Avatar 3D e Evolução */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            className="flex-1 bg-surface rounded-2xl p-5 border border-border"
            activeOpacity={0.7}
            onPress={() => router.push("/avatar-3d")}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.primary + "33" }}>
              <IconSymbol name="person.fill" size={24} color={colors.primary} />
            </View>
            <Text className="text-foreground text-base font-bold mb-1">Avatar 3D</Text>
            <Text className="text-muted text-xs">Criar scan corporal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-surface rounded-2xl p-5 border border-border"
            activeOpacity={0.7}
            onPress={() => router.push("/avatar-evolution")}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.success + "33" }}>
              <IconSymbol name="chart.bar" size={24} color={colors.success} />
            </View>
            <Text className="text-foreground text-base font-bold mb-1">Evolução</Text>
            <Text className="text-muted text-xs">Ver progresso</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Sinais Vitais */}
        <TouchableOpacity
          className="bg-surface rounded-2xl p-5 mb-4 border border-border"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.medical + "33" }}>
                <IconSymbol name="stethoscope" size={24} color={colors.medical} />
              </View>
              <Text className="text-foreground text-xl font-semibold">Sinais Vitais</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </View>

          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Pressão Arterial</Text>
              <Text className="text-foreground font-semibold">
                {latestVitalSigns?.bloodPressure ? `${latestVitalSigns.bloodPressure} mmHg` : "--/-- mmHg"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Glicemia</Text>
              <Text className="text-foreground font-semibold">
                {latestVitalSigns?.glucose ? `${latestVitalSigns.glucose} mg/dL` : "-- mg/dL"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Frequência Cardíaca</Text>
              <Text className="text-foreground font-semibold">
                {latestVitalSigns?.heartRate ? `${latestVitalSigns.heartRate} bpm` : "-- bpm"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Botão Nova Medição */}
        <TouchableOpacity
          className="rounded-xl p-4 items-center mb-6"
          style={{ backgroundColor: colors.health }}
          activeOpacity={0.8}
          onPress={() => setShowVitalSignsModal(true)}
        >
          <Text className="text-background font-bold text-base">+ Nova Medição</Text>
        </TouchableOpacity>

        <VitalSignsModal
          visible={showVitalSignsModal}
          onClose={() => setShowVitalSignsModal(false)}
          onSave={handleSaveVitalSigns}
        />

        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
