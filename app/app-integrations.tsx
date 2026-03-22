import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Integration {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  features: string[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "strava",
    name: "Strava",
    icon: "🏃",
    color: "#FC4C02",
    connected: false,
    features: ["Importar treinos", "Exportar treinos", "Sincronizar rotas GPS", "Estatísticas"],
  },
  {
    id: "nike",
    name: "Nike Run Club",
    icon: "👟",
    color: "#000000",
    connected: false,
    features: ["Importar corridas", "Exportar corridas", "Sincronizar tempo", "Distância"],
  },
];

export default function AppIntegrationsScreen() {
  const colors = useColors();
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (integration: Integration) => {
    if (integration.connected) {
      Alert.alert(
        "Desconectar",
        `Deseja desconectar do ${integration.name}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Desconectar",
            style: "destructive",
            onPress: () => {
              setIntegrations(
                integrations.map((i) =>
                  i.id === integration.id ? { ...i, connected: false, lastSync: undefined } : i
                )
              );
            },
          },
        ]
      );
      return;
    }

    setIsConnecting(integration.id);

    // Simular OAuth
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIntegrations(
      integrations.map((i) =>
        i.id === integration.id
          ? { ...i, connected: true, lastSync: new Date().toISOString() }
          : i
      )
    );

    setIsConnecting(null);
    Alert.alert("Sucesso", `Conectado ao ${integration.name} com sucesso!`);
  };

  const handleSync = async (integration: Integration) => {
    Alert.alert("Sincronizando", `Sincronizando dados do ${integration.name}...`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIntegrations(
      integrations.map((i) =>
        i.id === integration.id ? { ...i, lastSync: new Date().toISOString() } : i
      )
    );

    Alert.alert("Sucesso", "Sincronização concluída!");
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Integrações</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Stats Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center justify-around">
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{connectedCount}</Text>
                <Text className="text-muted text-sm">Conectadas</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">
                  {integrations.length - connectedCount}
                </Text>
                <Text className="text-muted text-sm">Disponíveis</Text>
              </View>
            </View>
          </View>

          {/* Integrations List */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Apps Disponíveis</Text>
            <View className="gap-4">
              {integrations.map((integration) => (
                <View
                  key={integration.id}
                  className="bg-surface rounded-2xl p-6 border-2"
                  style={{
                    borderColor: integration.connected ? integration.color : colors.border,
                  }}
                >
                  {/* Header */}
                  <View className="flex-row items-center gap-4 mb-4">
                    <View
                      className="w-16 h-16 rounded-2xl items-center justify-center"
                      style={{ backgroundColor: integration.color + "20" }}
                    >
                      <Text className="text-4xl">{integration.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg mb-1">
                        {integration.name}
                      </Text>
                      {integration.connected && integration.lastSync && (
                        <Text className="text-muted text-sm">
                          Última sincronização: {getRelativeTime(integration.lastSync)}
                        </Text>
                      )}
                      {!integration.connected && (
                        <Text className="text-muted text-sm">Não conectado</Text>
                      )}
                    </View>
                    {integration.connected && (
                      <View
                        className="px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: colors.success + "20" }}
                      >
                        <Text className="text-success text-xs font-bold">Conectado</Text>
                      </View>
                    )}
                  </View>

                  {/* Features */}
                  <View className="mb-4">
                    <Text className="text-muted text-sm mb-2">Recursos:</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {integration.features.map((feature, index) => (
                        <View
                          key={index}
                          className="px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: colors.muted + "20" }}
                        >
                          <Text className="text-muted text-xs">{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Actions */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className="flex-1 rounded-xl p-4 items-center"
                      style={{
                        backgroundColor: integration.connected
                          ? colors.error + "20"
                          : integration.color,
                        opacity: isConnecting === integration.id ? 0.6 : 1,
                      }}
                      activeOpacity={0.8}
                      onPress={() => handleConnect(integration)}
                      disabled={isConnecting === integration.id}
                    >
                      <Text
                        className="font-semibold"
                        style={{
                          color: integration.connected ? colors.error : "#ffffff",
                        }}
                      >
                        {isConnecting === integration.id
                          ? "Conectando..."
                          : integration.connected
                          ? "Desconectar"
                          : "Conectar"}
                      </Text>
                    </TouchableOpacity>
                    {integration.connected && (
                      <TouchableOpacity
                        className="rounded-xl p-4 px-6 items-center border-2"
                        style={{ borderColor: integration.color }}
                        activeOpacity={0.8}
                        onPress={() => handleSync(integration)}
                      >
                        <IconSymbol
                          name="arrow.triangle.2.circlepath"
                          size={20}
                          color={integration.color}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-2">
                  Sobre as Integrações
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Conecte seus apps favoritos para sincronizar treinos automaticamente
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Os dados são sincronizados em tempo real via APIs oficiais
                </Text>
                <Text className="text-muted text-sm">
                  • Você pode desconectar a qualquer momento sem perder seus dados
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
