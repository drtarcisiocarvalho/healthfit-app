import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type ExerciseType = "pushup" | "squat" | "situp" | "plank";

interface ExerciseData {
  type: ExerciseType;
  name: string;
  icon: string;
  description: string;
}

const EXERCISES: Record<ExerciseType, ExerciseData> = {
  pushup: {
    type: "pushup",
    name: "Flexão de Braço",
    icon: "figure.strengthtraining.traditional",
    description: "Mantenha o corpo reto e desça até o peito quase tocar o chão",
  },
  squat: {
    type: "squat",
    name: "Agachamento",
    icon: "figure.strengthtraining.functional",
    description: "Desça até as coxas ficarem paralelas ao chão",
  },
  situp: {
    type: "situp",
    name: "Abdominal",
    icon: "figure.core.training",
    description: "Levante o tronco em direção aos joelhos",
  },
  plank: {
    type: "plank",
    name: "Prancha",
    icon: "figure.flexibility",
    description: "Mantenha o corpo reto apoiado nos antebraços",
  },
};

export default function AIExerciseRecognitionScreen() {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>("pushup");
  const [isRecording, setIsRecording] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-foreground text-center">Carregando câmera...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <IconSymbol name="camera.fill" size={64} color={colors.muted} />
          <Text className="text-foreground text-xl font-bold mt-4 text-center">
            Permissão de Câmera Necessária
          </Text>
          <Text className="text-muted text-center mt-2 mb-6">
            Para usar o reconhecimento de exercícios, precisamos acessar sua câmera
          </Text>
          <TouchableOpacity
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={requestPermission}
          >
            <Text className="text-white font-semibold">Permitir Câmera</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const handleStartRecording = () => {
    setIsRecording(true);
    setRepCount(0);
    setFeedback("Começando...");
    
    // Simular contagem de repetições
    const interval = setInterval(() => {
      setRepCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 10) {
          clearInterval(interval);
          setIsRecording(false);
          setFeedback("Série completa! Ótimo trabalho!");
          Alert.alert(
            "Série Completa!",
            `Você completou 10 repetições de ${EXERCISES[selectedExercise].name}`,
            [{ text: "OK" }]
          );
        } else {
          setFeedback(newCount % 2 === 0 ? "Boa postura!" : "Continue assim!");
        }
        return newCount;
      });
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setFeedback("Treino pausado");
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-6">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Reconhecimento IA</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="front"
        >
          {/* Overlay Guide */}
          <View className="flex-1 items-center justify-center">
            <View
              className="w-64 h-80 rounded-2xl border-4"
              style={{ borderColor: isRecording ? colors.health : "rgba(255,255,255,0.5)" }}
            />
          </View>

          {/* Rep Counter */}
          {isRecording && (
            <View className="absolute top-24 left-0 right-0 items-center">
              <View
                className="px-6 py-3 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <Text className="text-white text-4xl font-bold">{repCount}</Text>
              </View>
            </View>
          )}

          {/* Feedback */}
          {feedback && (
            <View className="absolute top-40 left-0 right-0 items-center px-6">
              <View
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <Text className="text-white text-center">{feedback}</Text>
              </View>
            </View>
          )}
        </CameraView>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: colors.background }}>
          {/* Exercise Selection */}
          <View className="flex-row gap-2 mb-4">
            {Object.values(EXERCISES).map((exercise) => (
              <TouchableOpacity
                key={exercise.type}
                className="flex-1 p-3 rounded-xl items-center"
                style={{
                  backgroundColor:
                    selectedExercise === exercise.type ? colors.health + "20" : colors.surface,
                  borderWidth: 2,
                  borderColor: selectedExercise === exercise.type ? colors.health : colors.border,
                }}
                activeOpacity={0.7}
                onPress={() => setSelectedExercise(exercise.type)}
                disabled={isRecording}
              >
                <IconSymbol
                  name={exercise.icon as any}
                  size={24}
                  color={selectedExercise === exercise.type ? colors.health : colors.muted}
                />
                <Text
                  className="text-xs font-semibold mt-1 text-center"
                  style={{
                    color: selectedExercise === exercise.type ? colors.health : colors.foreground,
                  }}
                >
                  {exercise.name.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exercise Info */}
          <View className="bg-surface rounded-xl p-4 mb-4">
            <Text className="text-foreground font-bold mb-1">
              {EXERCISES[selectedExercise].name}
            </Text>
            <Text className="text-muted text-sm">{EXERCISES[selectedExercise].description}</Text>
          </View>

          {/* Record Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center"
            style={{ backgroundColor: isRecording ? colors.error : colors.health }}
            activeOpacity={0.8}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
          >
            <Text className="text-white font-bold text-lg">
              {isRecording ? "Pausar Treino" : "Iniciar Treino"}
            </Text>
          </TouchableOpacity>

          {/* Info */}
          <Text className="text-muted text-xs text-center mt-3">
            Posicione-se dentro do quadro e mantenha o corpo todo visível
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
