import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface BackupInfo {
  id: string;
  date: string;
  size: string;
  itemsCount: number;
  encrypted: boolean;
}

const MOCK_BACKUPS: BackupInfo[] = [
  {
    id: "backup_20260125_183000",
    date: "2026-01-25T18:30:00",
    size: "2.4 MB",
    itemsCount: 156,
    encrypted: true,
  },
  {
    id: "backup_20260124_183000",
    date: "2026-01-24T18:30:00",
    size: "2.3 MB",
    itemsCount: 152,
    encrypted: true,
  },
  {
    id: "backup_20260123_183000",
    date: "2026-01-23T18:30:00",
    size: "2.2 MB",
    itemsCount: 148,
    encrypted: true,
  },
];

export default function BackupScreen() {
  const colors = useColors();
  const [backups, setBackups] = useState<BackupInfo[]>(MOCK_BACKUPS);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadBackupSettings();
  }, []);

  const loadBackupSettings = async () => {
    try {
      const lastBackupDate = await AsyncStorage.getItem("last_backup");
      const autoBackup = await AsyncStorage.getItem("auto_backup");
      if (lastBackupDate) setLastBackup(lastBackupDate);
      if (autoBackup !== null) setAutoBackupEnabled(autoBackup === "true");
    } catch (error) {
      console.error("Error loading backup settings:", error);
    }
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);

    // Simular backup
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const now = new Date().toISOString();
    await AsyncStorage.setItem("last_backup", now);
    setLastBackup(now);

    // Adicionar novo backup à lista
    const newBackup: BackupInfo = {
      id: `backup_${Date.now()}`,
      date: now,
      size: "2.5 MB",
      itemsCount: 160,
      encrypted: true,
    };
    setBackups([newBackup, ...backups]);

    setIsBackingUp(false);
    Alert.alert("Sucesso", "Backup criado com sucesso!");
  };

  const handleRestore = async (backup: BackupInfo) => {
    Alert.alert(
      "Restaurar Backup",
      `Deseja restaurar o backup de ${formatDate(backup.date)}? Todos os dados atuais serão substituídos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            setIsRestoring(true);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setIsRestoring(false);
            Alert.alert("Sucesso", "Dados restaurados com sucesso!");
          },
        },
      ]
    );
  };

  const handleDeleteBackup = (backup: BackupInfo) => {
    Alert.alert(
      "Excluir Backup",
      `Deseja excluir o backup de ${formatDate(backup.date)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setBackups(backups.filter((b) => b.id !== backup.id));
          },
        },
      ]
    );
  };

  const toggleAutoBackup = async () => {
    const newValue = !autoBackupEnabled;
    setAutoBackupEnabled(newValue);
    await AsyncStorage.setItem("auto_backup", newValue.toString());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Backup e Restauração</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Status Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center gap-4 mb-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <IconSymbol name="icloud.fill" size={32} color={colors.health} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-bold text-lg mb-1">
                  Backup na Nuvem
                </Text>
                <Text className="text-muted text-sm">
                  {lastBackup
                    ? `Último backup: ${getRelativeTime(lastBackup)}`
                    : "Nenhum backup realizado"}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl p-4 items-center"
                style={{
                  backgroundColor: colors.health,
                  opacity: isBackingUp ? 0.6 : 1,
                }}
                activeOpacity={0.8}
                onPress={handleBackupNow}
                disabled={isBackingUp}
              >
                <Text className="text-white font-semibold">
                  {isBackingUp ? "Fazendo Backup..." : "Backup Agora"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto Backup */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-foreground font-bold mb-1">Backup Automático</Text>
                <Text className="text-muted text-sm">
                  Backup diário às 18:00 automaticamente
                </Text>
              </View>
              <TouchableOpacity
                className="w-14 h-8 rounded-full p-1"
                style={{
                  backgroundColor: autoBackupEnabled ? colors.health : colors.muted,
                }}
                activeOpacity={0.8}
                onPress={toggleAutoBackup}
              >
                <View
                  className="w-6 h-6 rounded-full bg-white"
                  style={{
                    transform: [{ translateX: autoBackupEnabled ? 22 : 0 }],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Storage Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-4">Armazenamento</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Backups armazenados:</Text>
                <Text className="text-foreground font-bold">{backups.length}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Espaço utilizado:</Text>
                <Text className="text-foreground font-bold">7.2 MB</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Criptografia:</Text>
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="lock.shield.fill" size={16} color={colors.success} />
                  <Text className="text-success font-bold">Ativa</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Backup History */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">
              Histórico de Backups
            </Text>
            <View className="gap-3">
              {backups.map((backup, index) => (
                <View
                  key={backup.id}
                  className="bg-surface rounded-2xl p-5 border border-border"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-foreground font-bold">
                          {index === 0 ? "Backup Mais Recente" : `Backup ${index + 1}`}
                        </Text>
                        {backup.encrypted && (
                          <IconSymbol name="lock.fill" size={14} color={colors.success} />
                        )}
                      </View>
                      <Text className="text-muted text-sm mb-1">
                        {formatDate(backup.date)}
                      </Text>
                      <Text className="text-muted text-xs">
                        {backup.itemsCount} itens • {backup.size}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 rounded-xl p-3 items-center border-2"
                      style={{ borderColor: colors.border }}
                      activeOpacity={0.8}
                      onPress={() => handleRestore(backup)}
                      disabled={isRestoring}
                    >
                      <Text className="text-foreground font-semibold">
                        {isRestoring ? "Restaurando..." : "Restaurar"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="rounded-xl p-3 px-4 items-center"
                      style={{ backgroundColor: colors.error + "20" }}
                      activeOpacity={0.8}
                      onPress={() => handleDeleteBackup(backup)}
                    >
                      <IconSymbol name="trash.fill" size={20} color={colors.error} />
                    </TouchableOpacity>
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
                  Sobre Backup e Segurança
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Todos os backups são criptografados com AES-256
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Os dados são sincronizados automaticamente entre seus dispositivos
                </Text>
                <Text className="text-muted text-sm">
                  • Mantenha pelo menos 3 backups recentes para maior segurança
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
