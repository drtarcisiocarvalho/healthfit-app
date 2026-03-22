import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Wearable {
  id: string;
  name: string;
  brand: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync: string;
  battery?: number;
  features: string[];
}

const WEARABLES: Wearable[] = [
  {
    id: "apple-watch",
    name: "Apple Watch Series 9",
    brand: "Apple",
    icon: "applewatch",
    color: "#000000",
    connected: true,
    lastSync: "Há 5 minutos",
    battery: 85,
    features: ["Frequência Cardíaca", "Passos", "Calorias", "Treinos", "Sono"],
  },
  {
    id: "fitbit",
    name: "Fitbit Charge 6",
    brand: "Fitbit",
    icon: "figure.walk",
    color: "#00B0B9",
    connected: false,
    lastSync: "Nunca",
    features: ["Frequência Cardíaca", "Passos", "Calorias", "Sono"],
  },
  {
    id: "garmin",
    name: "Garmin Forerunner 965",
    brand: "Garmin",
    icon: "figure.run",
    color: "#007CC3",
    connected: false,
    lastSync: "Nunca",
    features: ["GPS", "Frequência Cardíaca", "VO2 Max", "Treinos", "Recuperação"],
  },
  {
    id: "galaxy-watch-6",
    name: "Galaxy Watch 6",
    brand: "Samsung",
    icon: "applewatch",
    color: "#1428A0",
    connected: false,
    lastSync: "Nunca",
    features: ["Frequência Cardíaca", "Passos", "Calorias", "Treinos", "Sono", "Estresse"],
  },
  {
    id: "galaxy-watch-4",
    name: "Galaxy Watch 4",
    brand: "Samsung",
    icon: "applewatch",
    color: "#1428A0",
    connected: false,
    lastSync: "Nunca",
    features: ["Frequência Cardíaca", "Passos", "Calorias", "Treinos", "Sono"],
  },
];

interface DataType {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

const DATA_TYPES: DataType[] = [
  { id: "heart_rate", name: "Frequência Cardíaca", icon: "heart.fill", enabled: true },
  { id: "steps", name: "Passos", icon: "figure.walk", enabled: true },
  { id: "calories", name: "Calorias", icon: "flame.fill", enabled: true },
  { id: "workouts", name: "Treinos", icon: "figure.run", enabled: true },
  { id: "sleep", name: "Sono", icon: "moon.stars.fill", enabled: false },
];

export default function WearablesScreen() {
  const colors = useColors();
  const [wearables, setWearables] = useState(WEARABLES);
  const [dataTypes, setDataTypes] = useState(DATA_TYPES);

  const handleConnect = (wearableId: string) => {
    setWearables((prev) =>
      prev.map((w) =>
        w.id === wearableId
          ? { ...w, connected: !w.connected, lastSync: w.connected ? "Nunca" : "Agora mesmo" }
          : w
      )
    );

    const wearable = wearables.find((w) => w.id === wearableId);
    if (wearable) {
      Alert.alert(
        wearable.connected ? "Desconectado" : "Conectado!",
        wearable.connected
          ? `${wearable.name} foi desconectado`
          : `${wearable.name} conectado com sucesso`
      );
    }
  };

  const handleSync = (wearableId: string) => {
    setWearables((prev) =>
      prev.map((w) => (w.id === wearableId ? { ...w, lastSync: "Agora mesmo" } : w))
    );
    Alert.alert("Sincronizado!", "Dados atualizados com sucesso");
  };

  const toggleDataType = (dataTypeId: string) => {
    setDataTypes((prev) =>
      prev.map((dt) => (dt.id === dataTypeId ? { ...dt, enabled: !dt.enabled } : dt))
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Wearables</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Info Banner */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="info.circle.fill" size={24} color={colors.health} />
              <View className="flex-1">
                <Text className="text-foreground font-bold mb-1">Sincronização Automática</Text>
                <Text className="text-muted text-sm">
                  Conecte seus dispositivos wearables para sincronizar automaticamente dados de
                  saúde e fitness
                </Text>
              </View>
            </View>
          </View>

          {/* Wearables List */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Dispositivos</Text>
            {wearables.map((wearable) => (
              <View
                key={wearable.id}
                className="bg-surface rounded-2xl p-5 mb-3 border border-border"
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center"
                      style={{ backgroundColor: wearable.color + "20" }}
                    >
                      <IconSymbol
                        name={wearable.icon as any}
                        size={28}
                        color={wearable.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg">{wearable.name}</Text>
                      <Text className="text-muted text-sm">{wearable.brand}</Text>
                    </View>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: wearable.connected
                        ? colors.success + "20"
                        : colors.muted + "20",
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: wearable.connected ? colors.success : colors.muted }}
                    >
                      {wearable.connected ? "Conectado" : "Desconectado"}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                {wearable.connected && (
                  <View className="gap-2 mb-4">
                    <View className="flex-row items-center gap-2">
                      <IconSymbol name="clock.fill" size={16} color={colors.muted} />
                      <Text className="text-muted text-sm">Última sincronização: {wearable.lastSync}</Text>
                    </View>
                    {wearable.battery && (
                      <View className="flex-row items-center gap-2">
                        <IconSymbol name="battery.100" size={16} color={colors.muted} />
                        <Text className="text-muted text-sm">Bateria: {wearable.battery}%</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Features */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {wearable.features.map((feature) => (
                    <View
                      key={feature}
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.health + "10" }}
                    >
                      <Text className="text-xs" style={{ color: colors.health }}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 rounded-xl p-3 items-center"
                    style={{
                      backgroundColor: wearable.connected ? colors.error : colors.health,
                    }}
                    activeOpacity={0.8}
                    onPress={() => handleConnect(wearable.id)}
                  >
                    <Text className="text-white font-semibold">
                      {wearable.connected ? "Desconectar" : "Conectar"}
                    </Text>
                  </TouchableOpacity>
                  {wearable.connected && (
                    <TouchableOpacity
                      className="flex-1 rounded-xl p-3 items-center border-2"
                      style={{ borderColor: colors.health }}
                      activeOpacity={0.8}
                      onPress={() => handleSync(wearable.id)}
                    >
                      <Text className="font-semibold" style={{ color: colors.health }}>
                        Sincronizar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Data Types */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Dados para Sincronizar</Text>
            <View className="bg-surface rounded-2xl p-5 border border-border">
              {dataTypes.map((dataType, index) => (
                <View key={dataType.id}>
                  <View className="flex-row items-center justify-between py-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <IconSymbol
                        name={dataType.icon as any}
                        size={24}
                        color={dataType.enabled ? colors.health : colors.muted}
                      />
                      <Text
                        className="font-semibold"
                        style={{ color: dataType.enabled ? colors.foreground : colors.muted }}
                      >
                        {dataType.name}
                      </Text>
                    </View>
                    <Switch
                      value={dataType.enabled}
                      onValueChange={() => toggleDataType(dataType.id)}
                      trackColor={{ false: colors.border, true: colors.health }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  {index < dataTypes.length - 1 && <View className="h-px bg-border" />}
                </View>
              ))}
            </View>
          </View>

          {/* Help */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">Como conectar?</Text>
            <View className="gap-3">
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">1.</Text>
                <Text className="text-muted text-sm flex-1">
                  Certifique-se de que seu dispositivo wearable está ligado e próximo
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">2.</Text>
                <Text className="text-muted text-sm flex-1">
                  Toque em "Conectar" no dispositivo desejado
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">3.</Text>
                <Text className="text-muted text-sm flex-1">
                  Autorize o acesso aos dados quando solicitado
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">4.</Text>
                <Text className="text-muted text-sm flex-1">
                  A sincronização será feita automaticamente em segundo plano
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
