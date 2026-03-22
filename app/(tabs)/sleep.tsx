import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function SleepScreen() {
  const colors = useColors();

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-3xl font-bold mb-6">Sono</Text>

        {/* Score de Sono */}
        <View className="bg-surface rounded-2xl p-6 mb-4 border border-border items-center">
          <Text className="text-muted text-sm mb-4">Score de Sono</Text>
          <View className="w-32 h-32 rounded-full border-8 items-center justify-center mb-4" style={{ borderColor: colors.sleep }}>
            <Text className="text-foreground text-4xl font-bold">--</Text>
          </View>
          <Text className="text-muted text-center">
            Conecte um wearable para monitorar seu sono
          </Text>
        </View>

        {/* Última Noite */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <Text className="text-foreground text-xl font-semibold mb-4">Última Noite</Text>
          
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Duração</Text>
              <Text className="text-foreground font-semibold">-- h --min</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Eficiência</Text>
              <Text className="text-foreground font-semibold">--%</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-muted">Despertares</Text>
              <Text className="text-foreground font-semibold">--</Text>
            </View>
          </View>
        </View>

        {/* Fases do Sono */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <Text className="text-foreground text-xl font-semibold mb-4">Fases do Sono</Text>
          
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.health }} />
                <Text className="text-muted">Sono Leve</Text>
              </View>
              <Text className="text-foreground font-semibold">--min (--%)</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.medical }} />
                <Text className="text-muted">Sono Profundo</Text>
              </View>
              <Text className="text-foreground font-semibold">--min (--%)</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.sleep }} />
                <Text className="text-muted">Sono REM</Text>
              </View>
              <Text className="text-foreground font-semibold">--min (--%)</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <View className="flex-row items-center gap-2 mb-3">
            <IconSymbol name="sparkles" size={20} color={colors.sleep} />
            <Text className="text-foreground text-lg font-semibold">Insights</Text>
          </View>
          <Text className="text-muted leading-relaxed">
            Conecte um dispositivo wearable para receber insights personalizados sobre a qualidade do seu sono.
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
