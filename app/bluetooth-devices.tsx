import { View, Text, TouchableOpacity, ScrollView, FlatList, Platform, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface BluetoothDevice {
  id: string;
  name: string;
  type: "scale" | "bp_monitor" | "glucometer" | "oximeter";
  connected: boolean;
  battery?: number;
}

export default function BluetoothDevicesScreen() {
  const colors = useColors();
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([
    { id: "1", name: "Balança Inteligente X1", type: "scale", connected: true, battery: 85 },
    { id: "2", name: "Monitor de Pressão BP200", type: "bp_monitor", connected: false, battery: 60 },
  ]);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "scale":
        return "scale";
      case "bp_monitor":
        return "heart.fill";
      case "glucometer":
        return "drop.fill";
      case "oximeter":
        return "waveform.path.ecg";
      default:
        return "device";
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case "scale":
        return "Balança";
      case "bp_monitor":
        return "Monitor de Pressão";
      case "glucometer":
        return "Glicosímetro";
      case "oximeter":
        return "Oxímetro";
      default:
        return "Dispositivo";
    }
  };

  const startScan = () => {
    if (Platform.OS === "web") {
      Alert.alert("Aviso", "Bluetooth não está disponível na versão web");
      return;
    }

    setIsScanning(true);
    setAvailableDevices([]);

    // Simular busca de dispositivos
    setTimeout(() => {
      setAvailableDevices([
        { id: "3", name: "Glicosímetro Smart G1", type: "glucometer", connected: false },
        { id: "4", name: "Oxímetro Pulse Ox", type: "oximeter", connected: false },
      ]);
      setIsScanning(false);
    }, 3000);
  };

  const connectDevice = (device: BluetoothDevice) => {
    Alert.alert(
      "Conectar Dispositivo",
      `Deseja conectar ao ${device.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Conectar",
          onPress: () => {
            // Simular conexão
            setDevices((prev) => [...prev, { ...device, connected: true, battery: 100 }]);
            setAvailableDevices((prev) => prev.filter((d) => d.id !== device.id));
            Alert.alert("Sucesso", `Conectado ao ${device.name}`);
          },
        },
      ]
    );
  };

  const disconnectDevice = (device: BluetoothDevice) => {
    Alert.alert(
      "Desconectar Dispositivo",
      `Deseja desconectar do ${device.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desconectar",
          style: "destructive",
          onPress: () => {
            setDevices((prev) =>
              prev.map((d) => (d.id === device.id ? { ...d, connected: false } : d))
            );
            Alert.alert("Desconectado", `${device.name} foi desconectado`);
          },
        },
      ]
    );
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 border border-border mb-3"
      activeOpacity={0.7}
      onPress={() => (item.connected ? disconnectDevice(item) : connectDevice(item))}
    >
      <View className="flex-row items-center gap-4">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: item.connected ? colors.success + "20" : colors.muted + "20" }}
        >
          <IconSymbol
            name={getDeviceIcon(item.type) as any}
            size={24}
            color={item.connected ? colors.success : colors.muted}
          />
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-bold">{item.name}</Text>
          <Text className="text-muted text-sm">{getDeviceTypeName(item.type)}</Text>
          {item.connected && item.battery !== undefined && (
            <Text className="text-muted text-xs mt-1">Bateria: {item.battery}%</Text>
          )}
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: item.connected ? colors.success + "20" : colors.muted + "20" }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: item.connected ? colors.success : colors.muted }}
          >
            {item.connected ? "Conectado" : "Disponível"}
          </Text>
        </View>
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
          <Text className="text-foreground text-xl font-bold">Dispositivos Bluetooth</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Scan Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center mb-6"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={startScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#FFFFFF" />
                <Text className="text-white font-semibold">Procurando dispositivos...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Procurar Dispositivos</Text>
            )}
          </TouchableOpacity>

          {/* Connected Devices */}
          <View className="mb-6">
            <Text className="text-foreground text-lg font-bold mb-3">Meus Dispositivos</Text>
            {devices.filter((d) => d.connected).length > 0 ? (
              <FlatList
                data={devices.filter((d) => d.connected)}
                renderItem={renderDevice}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center">
                <Text className="text-5xl">📱</Text>
                <Text className="text-muted text-center mt-2">
                  Nenhum dispositivo conectado
                </Text>
              </View>
            )}
          </View>

          {/* Available Devices */}
          {availableDevices.length > 0 && (
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Dispositivos Disponíveis</Text>
              <FlatList
                data={availableDevices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border mt-6">
            <Text className="text-foreground font-bold mb-2">Como conectar</Text>
            <Text className="text-muted text-sm leading-relaxed">
              1. Ligue seu dispositivo Bluetooth{"\n"}
              2. Toque em "Procurar Dispositivos"{"\n"}
              3. Selecione o dispositivo na lista{"\n"}
              4. Os dados serão sincronizados automaticamente
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
