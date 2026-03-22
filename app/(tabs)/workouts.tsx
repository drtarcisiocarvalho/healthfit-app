import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewWorkoutModal } from "@/components/new-workout-modal";
import { ActiveWorkoutModal } from "@/components/active-workout-modal";


interface Workout {
  id: string;
  type: string;
  date: string;
  duration: number; // em minutos
  distance?: number; // em km
  calories: number;
}

export default function WorkoutsScreen() {
  const colors = useColors();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
  const [showActiveWorkoutModal, setShowActiveWorkoutModal] = useState(false);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("");

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem("workouts");
      if (stored) {
        setWorkouts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
    }
  };

  const getWorkoutIcon = (type: string) => {
    const icons: Record<string, any> = {
      "Corrida": "figure.run",
      "Caminhada": "figure.run",
      "Ciclismo": "bolt.fill",
      "Musculação": "flame.fill",
      "Yoga": "heart.fill",
      "Natação": "heart.fill",
    };
    return icons[type] || "figure.run";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    }
  };

  const handleSelectWorkoutType = (type: { id: string; name: string; icon: string }) => {
    setSelectedWorkoutType(type.name);
    setShowActiveWorkoutModal(true);
  };

  const handleSaveWorkout = async (workoutData: {
    type: string;
    duration: number;
    distance: number;
    calories: number;
  }) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      type: workoutData.type,
      date: new Date().toISOString(),
      duration: workoutData.duration,
      distance: workoutData.distance > 0 ? workoutData.distance : undefined,
      calories: workoutData.calories,
    };

    const updatedWorkouts = [newWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Erro ao salvar treino:", error);
    }
  };

  const renderWorkoutCard = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-4 mb-3 border border-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
            <IconSymbol name={getWorkoutIcon(item.type)} size={24} color={colors.primary} />
          </View>
          <View>
            <Text className="text-foreground text-lg font-semibold">{item.type}</Text>
            <Text className="text-muted text-sm">{formatDate(item.date)}</Text>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
      
      <View className="flex-row justify-between mt-3 pt-3 border-t border-border">
        <View className="items-center">
          <Text className="text-muted text-xs mb-1">Duração</Text>
          <Text className="text-foreground font-semibold">{formatDuration(item.duration)}</Text>
        </View>
        {item.distance && (
          <View className="items-center">
            <Text className="text-muted text-xs mb-1">Distância</Text>
            <Text className="text-foreground font-semibold">{item.distance.toFixed(2)} km</Text>
          </View>
        )}
        <View className="items-center">
          <Text className="text-muted text-xs mb-1">Calorias</Text>
          <Text className="text-foreground font-semibold">{item.calories} kcal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-foreground text-3xl font-bold">Treinos</Text>
            <Text className="text-muted text-sm mt-1">{workouts.length} treinos registrados</Text>
          </View>
        </View>

        {workouts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-24 h-24 rounded-full bg-surface items-center justify-center mb-4">
              <IconSymbol name="figure.run" size={48} color={colors.muted} />
            </View>
            <Text className="text-foreground text-xl font-semibold mb-2">Nenhum treino ainda</Text>
            <Text className="text-muted text-center px-8">
              Comece seu primeiro treino tocando no botão abaixo
            </Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            renderItem={renderWorkoutCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* FAB - Novo Treino */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
          onPress={() => setShowNewWorkoutModal(true)}
        >
          <IconSymbol name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <NewWorkoutModal
          visible={showNewWorkoutModal}
          onClose={() => setShowNewWorkoutModal(false)}
          onSelectType={handleSelectWorkoutType}
        />

        <ActiveWorkoutModal
          visible={showActiveWorkoutModal}
          workoutType={selectedWorkoutType}
          onClose={() => setShowActiveWorkoutModal(false)}
          onSave={handleSaveWorkout}
        />
      </View>
    </ScreenContainer>
  );
}
