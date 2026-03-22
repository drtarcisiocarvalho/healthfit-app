import { Modal, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { WorkoutMap } from "@/components/workout-map";

interface ActiveWorkoutModalProps {
  visible: boolean;
  workoutType: string;
  onClose: () => void;
  onSave: (workout: {
    type: string;
    duration: number;
    distance: number;
    calories: number;
    avgSpeed?: number;
    maxSpeed?: number;
    route?: { latitude: number; longitude: number; timestamp: number }[];
  }) => void;
}

export function ActiveWorkoutModal({ visible, workoutType, onClose, onSave }: ActiveWorkoutModalProps) {
  const colors = useColors();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); // km/h
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number; timestamp: number }[]>([]);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const lastLocation = useRef<Location.LocationObject | null>(null);
  const speedHistory = useRef<number[]>([]);

  // Solicitar permissão de localização
  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        setHasLocationPermission(false);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === "granted");
    })();
  }, []);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && visible) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, visible]);

  // GPS Tracking com métricas avançadas
  useEffect(() => {
    if (!isRunning || !visible || !hasLocationPermission) {
      return;
    }

    const startTracking = async () => {
      try {
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000, // Atualizar a cada 1 segundo
            distanceInterval: 5, // Atualizar a cada 5 metros
          },
          (location) => {
            setCurrentLocation(location);
            
            // Adicionar ponto à rota
            setRoute((prev) => [
              ...prev,
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: location.timestamp,
              },
            ]);

            // Calcular distância e velocidade
            if (lastLocation.current) {
              const dist = calculateDistance(
                lastLocation.current.coords.latitude,
                lastLocation.current.coords.longitude,
                location.coords.latitude,
                location.coords.longitude
              );
              
              setDistance((prev) => prev + dist);

              // Calcular velocidade instantânea (km/h)
              const timeDiff = (location.timestamp - lastLocation.current.timestamp) / 1000 / 3600; // em horas
              const speed = timeDiff > 0 ? dist / timeDiff : 0;
              
              setCurrentSpeed(speed);
              speedHistory.current.push(speed);
              
              // Atualizar velocidade máxima
              if (speed > maxSpeed) {
                setMaxSpeed(speed);
              }
              
              // Calcular velocidade média
              if (speedHistory.current.length > 0) {
                const avg = speedHistory.current.reduce((a, b) => a + b, 0) / speedHistory.current.length;
                setAvgSpeed(avg);
              }
            }
            lastLocation.current = location;
          }
        );
      } catch (error) {
        console.error("Erro ao iniciar tracking GPS:", error);
      }
    };

    startTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isRunning, visible, hasLocationPermission, maxSpeed]);

  // Calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
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

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPace = () => {
    // Ritmo em min/km
    if (distance === 0) return "--:--";
    const paceMinutes = (seconds / 60) / distance;
    const mins = Math.floor(paceMinutes);
    const secs = Math.floor((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateCalories = () => {
    // Estimativa baseada em tipo de exercício e duração
    const caloriesPerMinute: Record<string, number> = {
      "Corrida": 12,
      "Caminhada": 5,
      "Ciclismo": 10,
      "Musculação": 8,
      "Yoga": 4,
      "Natação": 11,
    };
    const rate = caloriesPerMinute[workoutType] || 10;
    return Math.round((seconds / 60) * rate);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleFinish = () => {
    setIsRunning(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    onSave({
      type: workoutType,
      duration: Math.round(seconds / 60), // em minutos
      distance: Math.round(distance * 100) / 100,
      calories: calculateCalories(),
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      maxSpeed: Math.round(maxSpeed * 10) / 10,
      route: route.length > 0 ? route : undefined,
    });
    // Reset
    setSeconds(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setAvgSpeed(0);
    setRoute([]);
    speedHistory.current = [];
    lastLocation.current = null;
    onClose();
  };

  const handleCancel = () => {
    setIsRunning(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    setSeconds(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setAvgSpeed(0);
    setRoute([]);
    speedHistory.current = [];
    lastLocation.current = null;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View className="flex-1 bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <IconSymbol name="xmark" size={28} color={colors.muted} />
              </TouchableOpacity>
              <Text className="text-foreground text-xl font-bold">{workoutType}</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Timer Principal */}
            <View className="items-center mb-8">
              <Text className="text-muted text-sm mb-2">TEMPO</Text>
              <Text className="text-foreground text-6xl font-bold">{formatTime(seconds)}</Text>
            </View>

            {/* Métricas Principais */}
            <View className="flex-row justify-around mb-8">
              <View className="items-center">
                <IconSymbol name="location.fill" size={32} color={colors.primary} />
                <Text className="text-foreground text-3xl font-bold mt-2">{distance.toFixed(2)}</Text>
                <Text className="text-muted text-sm">km</Text>
              </View>
              <View className="items-center">
                <IconSymbol name="flame.fill" size={32} color={colors.warning} />
                <Text className="text-foreground text-3xl font-bold mt-2">{calculateCalories()}</Text>
                <Text className="text-muted text-sm">kcal</Text>
              </View>
            </View>

            {/* Métricas Secundárias */}
            {hasLocationPermission && distance > 0 && (
              <View className="bg-surface rounded-2xl p-4 mb-8">
                <View className="flex-row justify-around">
                  <View className="items-center">
                    <Text className="text-muted text-xs mb-1">RITMO</Text>
                    <Text className="text-foreground text-lg font-bold">{formatPace()}</Text>
                    <Text className="text-muted text-xs">min/km</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-muted text-xs mb-1">VELOCIDADE</Text>
                    <Text className="text-foreground text-lg font-bold">{currentSpeed.toFixed(1)}</Text>
                    <Text className="text-muted text-xs">km/h</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-muted text-xs mb-1">VEL. MÁX</Text>
                    <Text className="text-foreground text-lg font-bold">{maxSpeed.toFixed(1)}</Text>
                    <Text className="text-muted text-xs">km/h</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Status GPS */}
            {!hasLocationPermission && Platform.OS !== "web" && (
              <View className="bg-warning/10 rounded-2xl p-4 mb-8">
                <Text className="text-warning text-center">
                  ⚠️ Permissão de localização não concedida. A distância não será rastreada.
                </Text>
              </View>
            )}

            {/* Mapa da Rota */}
            {hasLocationPermission && route.length > 0 && (
              <View className="mb-8">
                <WorkoutMap 
                  route={route} 
                  currentLocation={currentLocation ? {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                  } : null}
                  height={250}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Controles */}
        <View className="p-6 pb-8">
          {!isRunning && seconds === 0 && (
            <TouchableOpacity
              className="rounded-2xl p-6 items-center"
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}
              onPress={handleStart}
            >
              <Text className="text-background font-bold text-xl">Iniciar Treino</Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <View className="gap-3">
              <TouchableOpacity
                className="rounded-2xl p-6 items-center"
                style={{ backgroundColor: colors.warning }}
                activeOpacity={0.8}
                onPress={handlePause}
              >
                <Text className="text-background font-bold text-xl">Pausar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl p-6 items-center border-2"
                style={{ borderColor: colors.primary }}
                activeOpacity={0.8}
                onPress={handleFinish}
              >
                <Text className="font-bold text-xl" style={{ color: colors.primary }}>Finalizar Treino</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isRunning && seconds > 0 && (
            <View className="gap-3">
              <TouchableOpacity
                className="rounded-2xl p-6 items-center"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={handleStart}
              >
                <Text className="text-background font-bold text-xl">Retomar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl p-6 items-center border-2"
                style={{ borderColor: colors.success }}
                activeOpacity={0.8}
                onPress={handleFinish}
              >
                <Text className="font-bold text-xl" style={{ color: colors.success }}>Finalizar Treino</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
