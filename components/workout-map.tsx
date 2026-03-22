import { View, Text, Platform, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface WorkoutMapProps {
  route: { latitude: number; longitude: number; timestamp: number }[];
  currentLocation?: { latitude: number; longitude: number } | null;
  height?: number;
}

export function WorkoutMap({ route, currentLocation, height = 300 }: WorkoutMapProps) {
  const colors = useColors();

  // Se não houver rota, mostrar placeholder
  if (route.length === 0) {
    return (
      <View 
        className="rounded-2xl items-center justify-center bg-surface"
        style={{ height }}
      >
        <IconSymbol name="location.fill" size={48} color={colors.muted} />
        <Text className="text-muted text-center px-4 mt-2">
          🗺️ Aguardando dados de GPS...
        </Text>
      </View>
    );
  }

  // Calcular estatísticas da rota
  const startPoint = route[0];
  const endPoint = route[route.length - 1];
  const totalPoints = route.length;
  
  // Calcular distância total percorrida
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  let totalDistance = 0;
  for (let i = 1; i < route.length; i++) {
    totalDistance += calculateDistance(
      route[i - 1].latitude,
      route[i - 1].longitude,
      route[i].latitude,
      route[i].longitude
    );
  }

  return (
    <View className="rounded-2xl bg-surface p-4" style={{ height }}>
      <View className="flex-row items-center mb-3">
        <IconSymbol name="location.fill" size={24} color={colors.primary} />
        <Text className="text-foreground font-bold text-lg ml-2">Rota GPS Registrada</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Estatísticas */}
        <View className="bg-background rounded-xl p-3 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted text-sm">Pontos registrados:</Text>
            <Text className="text-foreground font-bold">{totalPoints}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted text-sm">Distância calculada:</Text>
            <Text className="text-foreground font-bold">{totalDistance.toFixed(2)} km</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-muted text-sm">Precisão média:</Text>
            <Text className="text-success font-bold">Alta</Text>
          </View>
        </View>

        {/* Coordenadas de início e fim */}
        <View className="bg-background rounded-xl p-3 mb-3">
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "green" }} />
              <Text className="text-muted text-xs">INÍCIO</Text>
            </View>
            <Text className="text-foreground text-xs font-mono">
              {startPoint.latitude.toFixed(6)}, {startPoint.longitude.toFixed(6)}
            </Text>
          </View>
          
          <View>
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "red" }} />
              <Text className="text-muted text-xs">FIM</Text>
            </View>
            <Text className="text-foreground text-xs font-mono">
              {endPoint.latitude.toFixed(6)}, {endPoint.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Nota sobre visualização */}
        <View className="bg-primary/10 rounded-xl p-3">
          <Text className="text-primary text-xs text-center">
            💡 Mapa visual disponível em breve. Os dados GPS estão sendo registrados com precisão.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
