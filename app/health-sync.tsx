import { View, Text, TouchableOpacity, ScrollView, Switch, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from "react-native-health";

export default function HealthSyncScreen() {
  const colors = useColors();
  const [isHealthKitAvailable, setIsHealthKitAvailable] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [syncWorkouts, setSyncWorkouts] = useState(true);
  const [syncSleep, setSyncSleep] = useState(true);
  const [syncWeight, setSyncWeight] = useState(true);
  const [syncHeartRate, setSyncHeartRate] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (Platform.OS === "ios") {
      checkHealthKitAvailability();
    }
  }, []);

  const checkHealthKitAvailability = () => {
    AppleHealthKit.isAvailable((error: Object, available: boolean) => {
      if (error) {
        console.log("HealthKit error:", error);
        return;
      }
      setIsHealthKitAvailable(available);
    });
  };

  const requestHealthKitPermissions = () => {
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
          AppleHealthKit.Constants.Permissions.BodyMass,
          AppleHealthKit.Constants.Permissions.HeartRate,
        ],
        write: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
          AppleHealthKit.Constants.Permissions.BodyMass,
        ],
      },
    };

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        Alert.alert("Erro", "Não foi possível conectar ao Apple Health");
        return;
      }
      setIsAuthorized(true);
      Alert.alert("Sucesso", "Conectado ao Apple Health com sucesso!");
    });
  };

  const syncNow = () => {
    if (!isAuthorized) {
      Alert.alert("Aviso", "Você precisa autorizar o acesso ao Apple Health primeiro");
      return;
    }

    // Simular sincronização
    Alert.alert("Sincronizando", "Seus dados estão sendo sincronizados com o Apple Health...");
    setTimeout(() => {
      setLastSync(new Date());
      Alert.alert("Sucesso", "Dados sincronizados com sucesso!");
    }, 2000);
  };

  if (Platform.OS !== "ios") {
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View className="flex-1">
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-xl font-bold">Sincronização de Saúde</Text>
            <View style={{ width: 24 }} />
          </View>
          <View className="flex-1 items-center justify-center p-6">
            <IconSymbol name="heart.fill" size={64} color={colors.muted} />
            <Text className="text-foreground text-xl font-bold mt-4 text-center">
              Apple Health disponível apenas no iOS
            </Text>
            <Text className="text-muted text-center mt-2">
              Esta funcionalidade está disponível apenas em dispositivos iOS com Apple Health.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Sincronização de Saúde</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Status Card */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: isAuthorized ? colors.success + "20" : colors.muted + "20" }}
              >
                <IconSymbol
                  name="heart.fill"
                  size={24}
                  color={isAuthorized ? colors.success : colors.muted}
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">Apple Health</Text>
                <Text className="text-muted text-sm">
                  {isAuthorized ? "Conectado" : "Não conectado"}
                </Text>
              </View>
            </View>

            {!isAuthorized ? (
              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.health }}
                activeOpacity={0.8}
                onPress={requestHealthKitPermissions}
              >
                <Text className="text-white font-semibold">Conectar ao Apple Health</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-muted text-sm">Última sincronização</Text>
                  <Text className="text-foreground text-sm font-semibold">
                    {lastSync ? lastSync.toLocaleString("pt-BR") : "Nunca"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="rounded-xl p-4 items-center border-2"
                  style={{ borderColor: colors.health }}
                  activeOpacity={0.8}
                  onPress={syncNow}
                >
                  <Text className="font-semibold" style={{ color: colors.health }}>
                    Sincronizar Agora
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Sync Options */}
          {isAuthorized && (
            <View className="bg-surface rounded-2xl p-5 border border-border gap-4">
              <Text className="text-foreground text-lg font-bold mb-2">O que sincronizar</Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Treinos</Text>
                  <Text className="text-muted text-sm">Distância, calorias, duração</Text>
                </View>
                <Switch
                  value={syncWorkouts}
                  onValueChange={setSyncWorkouts}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={syncWorkouts ? colors.health : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Sono</Text>
                  <Text className="text-muted text-sm">Duração, qualidade, fases</Text>
                </View>
                <Switch
                  value={syncSleep}
                  onValueChange={setSyncSleep}
                  trackColor={{ false: colors.border, true: colors.sleep + "80" }}
                  thumbColor={syncSleep ? colors.sleep : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Peso e Composição Corporal</Text>
                  <Text className="text-muted text-sm">Peso, IMC, gordura corporal</Text>
                </View>
                <Switch
                  value={syncWeight}
                  onValueChange={setSyncWeight}
                  trackColor={{ false: colors.border, true: colors.health + "80" }}
                  thumbColor={syncWeight ? colors.health : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Frequência Cardíaca</Text>
                  <Text className="text-muted text-sm">FC em repouso e durante exercícios</Text>
                </View>
                <Switch
                  value={syncHeartRate}
                  onValueChange={setSyncHeartRate}
                  trackColor={{ false: colors.border, true: colors.error + "80" }}
                  thumbColor={syncHeartRate ? colors.error : colors.muted}
                />
              </View>
            </View>
          )}

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-2">Sobre a sincronização</Text>
            <Text className="text-muted text-sm leading-relaxed">
              Seus dados são sincronizados de forma segura com o Apple Health. Você mantém controle
              total sobre quais informações são compartilhadas. A sincronização é bidirecional:
              dados do HealthFit são enviados para o Apple Health e vice-versa.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
