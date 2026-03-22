import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { offlineSyncService } from "@/lib/offline-sync";

export default function SyncStatusScreen() {
  const colors = useColors();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSyncInfo();
    
    // Listener de rede
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    // Listener de sincronização
    const syncListener = (status: string) => {
      setSyncStatus(status);
      if (status.includes("concluída") || status.includes("Nenhum")) {
        setSyncing(false);
        loadSyncInfo();
      }
    };
    offlineSyncService.addListener(syncListener);

    return () => {
      unsubscribe();
      offlineSyncService.removeListener(syncListener);
    };
  }, []);

  const loadSyncInfo = async () => {
    const count = await offlineSyncService.getPendingCount();
    const lastSyncTime = await offlineSyncService.getLastSyncTime();
    setPendingCount(count);
    setLastSync(lastSyncTime);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus("Iniciando sincronização...");
    await offlineSyncService.syncPendingData();
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Nunca";
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours}h`;
    return `Há ${days} dias`;
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Sincronização</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Connection Status */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: isOnline ? colors.success + "20" : colors.error + "20" }}
              >
                <IconSymbol
                  name={isOnline ? "wifi" : "wifi.slash"}
                  size={24}
                  color={isOnline ? colors.success : colors.error}
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-bold">
                  {isOnline ? "Online" : "Offline"}
                </Text>
                <Text className="text-muted text-sm">
                  {isOnline
                    ? "Conectado à internet"
                    : "Sem conexão - dados salvos localmente"}
                </Text>
              </View>
            </View>
          </View>

          {/* Pending Items */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      pendingCount > 0 ? colors.warning + "20" : colors.success + "20",
                  }}
                >
                  <IconSymbol
                    name="cloud.fill"
                    size={24}
                    color={pendingCount > 0 ? colors.warning : colors.success}
                  />
                </View>
                <View>
                  <Text className="text-foreground text-lg font-bold">Itens Pendentes</Text>
                  <Text className="text-muted text-sm">Aguardando sincronização</Text>
                </View>
              </View>
              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: pendingCount > 0 ? colors.warning + "20" : colors.success + "20",
                }}
              >
                <Text
                  className="font-bold text-lg"
                  style={{ color: pendingCount > 0 ? colors.warning : colors.success }}
                >
                  {pendingCount}
                </Text>
              </View>
            </View>

            {pendingCount > 0 && (
              <View className="pt-3 border-t border-border">
                <Text className="text-muted text-sm">
                  {pendingCount} {pendingCount === 1 ? "item" : "itens"} serão sincronizados quando
                  você estiver online
                </Text>
              </View>
            )}
          </View>

          {/* Last Sync */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center gap-3 mb-2">
              <IconSymbol name="clock.fill" size={20} color={colors.muted} />
              <Text className="text-foreground font-semibold">Última Sincronização</Text>
            </View>
            <Text className="text-muted text-sm ml-8">{formatLastSync(lastSync)}</Text>
          </View>

          {/* Sync Status */}
          {syncStatus && (
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-center gap-3">
                {syncing && <ActivityIndicator size="small" color={colors.health} />}
                <Text className="text-foreground flex-1">{syncStatus}</Text>
              </View>
            </View>
          )}

          {/* Sync Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center flex-row justify-center gap-2"
            style={{
              backgroundColor: isOnline && !syncing ? colors.health : colors.surface,
              opacity: isOnline && !syncing ? 1 : 0.5,
            }}
            activeOpacity={0.8}
            onPress={handleSync}
            disabled={!isOnline || syncing}
          >
            {syncing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white font-semibold text-base">Sincronizando...</Text>
              </>
            ) : (
              <>
                <IconSymbol name="arrow.clockwise" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base">Sincronizar Agora</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">Como funciona?</Text>
            <View className="gap-3">
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Todos os dados são salvos localmente no seu dispositivo
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Quando você estiver online, os dados são sincronizados automaticamente
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  Você pode usar o app normalmente mesmo sem internet
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-foreground">•</Text>
                <Text className="text-muted text-sm flex-1">
                  A sincronização também pode ser feita manualmente a qualquer momento
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
