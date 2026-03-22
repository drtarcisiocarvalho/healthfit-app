import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BodyCompositionScreen() {
  const colors = useColors();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [boneMass, setBoneMass] = useState("");
  const [bodyWater, setBodyWater] = useState("");
  const [bmr, setBmr] = useState("");
  const [metabolicAge, setMetabolicAge] = useState("");

  const calculateBMI = (): string => {
    if (!weight || !height) return "--";
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // converter cm para m
    const bmi = w / (h * h);
    return bmi.toFixed(1);
  };

  const getBMIClassification = (bmi: number): { text: string; color: string } => {
    if (bmi < 18.5) return { text: "Abaixo do peso", color: colors.warning };
    if (bmi < 25) return { text: "Peso normal", color: colors.success };
    if (bmi < 30) return { text: "Sobrepeso", color: colors.warning };
    return { text: "Obesidade", color: colors.error };
  };

  const handleSave = async () => {
    const composition = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: parseFloat(weight) || 0,
      height: parseFloat(height) || 0,
      bodyFat: parseFloat(bodyFat) || 0,
      muscleMass: parseFloat(muscleMass) || 0,
      boneMass: parseFloat(boneMass) || 0,
      bodyWater: parseFloat(bodyWater) || 0,
      bmr: parseFloat(bmr) || 0,
      metabolicAge: parseFloat(metabolicAge) || 0,
      bmi: parseFloat(calculateBMI()) || 0,
    };

    try {
      const stored = await AsyncStorage.getItem("bodyComposition");
      const compositions = stored ? JSON.parse(stored) : [];
      await AsyncStorage.setItem("bodyComposition", JSON.stringify([composition, ...compositions]));
      router.back();
    } catch (error) {
      console.error("Erro ao salvar composição corporal:", error);
    }
  };

  const bmiValue = parseFloat(calculateBMI());
  const bmiClass = !isNaN(bmiValue) ? getBMIClassification(bmiValue) : null;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Bioimpedância</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
            <Text className="text-base font-semibold" style={{ color: colors.health }}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          <Text className="text-muted text-sm mb-4">
            Insira os dados da sua avaliação de bioimpedância. Todos os campos são opcionais.
          </Text>

          {/* Medidas Básicas */}
          <View className="mb-6">
            <Text className="text-foreground text-lg font-semibold mb-3">Medidas Básicas</Text>
            
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-muted text-sm mb-2">Peso (kg)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 75.5"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                  returnKeyType="done"
                />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-sm mb-2">Altura (cm)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 175"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={setHeight}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* IMC Calculado */}
            {weight && height && (
              <View className="bg-surface rounded-xl p-4 border border-border">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-muted text-sm">IMC (Índice de Massa Corporal)</Text>
                    {bmiClass && (
                      <Text className="text-sm mt-1" style={{ color: bmiClass.color }}>
                        {bmiClass.text}
                      </Text>
                    )}
                  </View>
                  <Text className="text-foreground text-3xl font-bold">{calculateBMI()}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Composição Corporal */}
          <View className="mb-6">
            <Text className="text-foreground text-lg font-semibold mb-3">Composição Corporal</Text>
            
            <View className="gap-3">
              <View>
                <Text className="text-muted text-sm mb-2">Gordura Corporal (%)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 18.5"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={bodyFat}
                  onChangeText={setBodyFat}
                  returnKeyType="done"
                />
              </View>

              <View>
                <Text className="text-muted text-sm mb-2">Massa Muscular (kg)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 35.2"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={muscleMass}
                  onChangeText={setMuscleMass}
                  returnKeyType="done"
                />
              </View>

              <View>
                <Text className="text-muted text-sm mb-2">Massa Óssea (kg)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 3.2"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={boneMass}
                  onChangeText={setBoneMass}
                  returnKeyType="done"
                />
              </View>

              <View>
                <Text className="text-muted text-sm mb-2">Água Corporal (%)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 58.3"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={bodyWater}
                  onChangeText={setBodyWater}
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          {/* Metabolismo */}
          <View className="mb-6">
            <Text className="text-foreground text-lg font-semibold mb-3">Metabolismo</Text>
            
            <View className="gap-3">
              <View>
                <Text className="text-muted text-sm mb-2">Taxa Metabólica Basal (kcal/dia)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 1650"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={bmr}
                  onChangeText={setBmr}
                  returnKeyType="done"
                />
              </View>

              <View>
                <Text className="text-muted text-sm mb-2">Idade Metabólica (anos)</Text>
                <TextInput
                  className="bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Ex: 28"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={metabolicAge}
                  onChangeText={setMetabolicAge}
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          <View className="h-20" />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
