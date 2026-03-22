import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  availableDoctors: number;
}

const specialties: Specialty[] = [
  {
    id: "1",
    name: "Clínico Geral",
    icon: "heart.fill",
    description: "Consultas gerais e check-ups",
    availableDoctors: 12,
  },
  {
    id: "2",
    name: "Cardiologista",
    icon: "heart.fill",
    description: "Saúde cardiovascular",
    availableDoctors: 8,
  },
  {
    id: "3",
    name: "Endocrinologista",
    icon: "bolt.fill",
    description: "Hormônios e metabolismo",
    availableDoctors: 6,
  },
  {
    id: "4",
    name: "Nutricionista",
    icon: "leaf.fill",
    description: "Alimentação e nutrição",
    availableDoctors: 15,
  },
  {
    id: "5",
    name: "Educador Físico",
    icon: "figure.run",
    description: "Prescrição de exercícios",
    availableDoctors: 10,
  },
  {
    id: "6",
    name: "Psicólogo",
    icon: "brain",
    description: "Saúde mental e bem-estar",
    availableDoctors: 20,
  },
  {
    id: "7",
    name: "Fisioterapeuta",
    icon: "hand.raised.fill",
    description: "Reabilitação e movimento",
    availableDoctors: 9,
  },
  {
    id: "8",
    name: "Ortopedista",
    icon: "bandage.fill",
    description: "Ossos, articulações e músculos",
    availableDoctors: 7,
  },
  {
    id: "9",
    name: "Angiologista/Cirurgião Vascular",
    icon: "drop.fill",
    description: "Saúde vascular e circulação",
    availableDoctors: 5,
  },
  {
    id: "10",
    name: "Médico do Exercício e Esporte",
    icon: "figure.run",
    description: "Performance esportiva e prevenção de lesões",
    availableDoctors: 8,
  },
  {
    id: "11",
    name: "Nutrólogo",
    icon: "pills.fill",
    description: "Tratamento médico nutricional",
    availableDoctors: 6,
  },
  {
    id: "12",
    name: "Cirurgião Plástico",
    icon: "scissors",
    description: "Cirurgias estéticas e reparadoras",
    availableDoctors: 4,
  },
];

export default function TelemedicineScreen() {
  const colors = useColors();

  const renderSpecialty = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 mb-3 border border-border"
      activeOpacity={0.7}
      onPress={() => console.log("Agendar consulta:", item.name)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: colors.medical + "33" }}>
            <IconSymbol name={item.icon as any} size={28} color={colors.medical} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-lg font-semibold mb-1">{item.name}</Text>
            <Text className="text-muted text-sm mb-2">{item.description}</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
              <Text className="text-muted text-xs">{item.availableDoctors} profissionais disponíveis</Text>
            </View>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Telemedicina</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View className="bg-surface rounded-2xl p-5 mb-6 border border-border">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.medical + "33" }}>
                <IconSymbol name="video.fill" size={24} color={colors.medical} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-semibold">Consultas Online</Text>
                <Text className="text-muted text-sm">Atendimento rápido e seguro</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">24/7</Text>
                <Text className="text-muted text-xs text-center">Disponível</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">15min</Text>
                <Text className="text-muted text-xs text-center">Tempo médio</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">4.8</Text>
                <Text className="text-muted text-xs text-center">Avaliação</Text>
              </View>
            </View>
          </View>

          {/* Especialidades */}
          <Text className="text-foreground text-xl font-semibold mb-4">Escolha a Especialidade</Text>
          
          <FlatList
            data={specialties}
            renderItem={renderSpecialty}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          <View className="h-20" />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
