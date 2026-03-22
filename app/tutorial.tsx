import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { VideoView, useVideoPlayer } from "expo-video";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  audioPath: string;
  videoPath?: string;
  icon: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Boas-vindas",
    description: "Conheça a Sofia, sua assistente virtual no HealthFit!",
    audioPath: require("@/assets/audio/tutorial-welcome.wav"),
    videoPath: require("@/assets/videos/tutorial-welcome.mp4"),
    icon: "👋",
  },
  {
    id: "avatar3d",
    title: "Scanner Corporal 3D",
    description: "Tire fotos e obtenha suas medidas corporais com IA",
    audioPath: require("@/assets/audio/tutorial-avatar3d.wav"),
    icon: "📸",
  },
  {
    id: "workouts",
    title: "Treinos Personalizados",
    description: "Exercícios com rastreamento GPS e monitoramento cardíaco",
    audioPath: require("@/assets/audio/tutorial-workouts.wav"),
    icon: "💪",
  },
  {
    id: "nutrition",
    title: "Nutrição Inteligente",
    description: "Análise de refeições por foto e contagem de calorias",
    audioPath: require("@/assets/audio/tutorial-nutrition.wav"),
    icon: "🍎",
  },
  {
    id: "health",
    title: "Monitoramento de Saúde",
    description: "Sinais vitais, insights e evolução do avatar 3D",
    audioPath: require("@/assets/audio/tutorial-health.wav"),
    icon: "❤️",
  },
  {
    id: "store",
    title: "Loja Wellness",
    description: "Produtos saudáveis com cashback exclusivo",
    audioPath: require("@/assets/audio/tutorial-store.wav"),
    icon: "🛒",
  },
  {
    id: "conclusion",
    title: "Pronto para Começar!",
    description: "Sua jornada de transformação começa agora",
    audioPath: require("@/assets/audio/tutorial-conclusion.wav"),
    icon: "🎉",
  },
];

export default function TutorialScreen() {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useAudioPlayer(TUTORIAL_STEPS[currentStep].audioPath);

  useEffect(() => {
    // Configurar modo de áudio para tocar mesmo no modo silencioso
    setAudioModeAsync({ playsInSilentMode: true });

    return () => {
      player.release();
    };
  }, []);

  useEffect(() => {
    // Atualizar fonte de áudio quando mudar de step
    player.replace(TUTORIAL_STEPS[currentStep].audioPath);
    setIsPlaying(false);
  }, [currentStep]);

  const playAudio = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      player.pause();
      setIsPlaying(false);
      setCurrentStep(currentStep + 1);
    } else {
      finishTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      player.pause();
      setIsPlaying(false);
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = async () => {
    await AsyncStorage.setItem("tutorialCompleted", "true");
    player.pause();
    router.back();
  };

  const finishTutorial = async () => {
    await AsyncStorage.setItem("tutorialCompleted", "true");
    player.pause();
    router.replace("/(tabs)");
  };

  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-foreground text-2xl font-bold">Tutorial</Text>
          <TouchableOpacity onPress={skipTutorial} className="p-2">
            <Text className="text-muted font-medium">Pular</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-muted text-sm">
              Passo {currentStep + 1} de {TUTORIAL_STEPS.length}
            </Text>
            <Text className="text-muted text-sm">{Math.round(progress)}%</Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
        </View>

        {/* Avatar Sofia */}
        <View className="items-center mb-8">
          <View
            className="rounded-3xl overflow-hidden"
            style={{
              width: 280,
              height: 350,
              backgroundColor: colors.surface,
              borderWidth: 3,
              borderColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {step.videoPath ? (
              <VideoView
                style={{ width: "100%", height: "100%" }}
                player={useVideoPlayer(step.videoPath, (player) => {
                  player.loop = true;
                  player.play();
                })}
                nativeControls={false}
              />
            ) : (
              <Image
                source={require("@/assets/images/tutorial-avatar.png")}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            )}
          </View>

          {/* Nome da assistente */}
          <View className="mt-4 items-center">
            <Text className="text-foreground text-xl font-bold">Sofia</Text>
            <Text className="text-muted text-sm">Sua Assistente Virtual</Text>
          </View>
        </View>

        {/* Step Content */}
        <View className="bg-surface rounded-2xl p-6 mb-6 border border-border">
          <View className="flex-row items-center gap-3 mb-4">
            <Text style={{ fontSize: 40 }}>{step.icon}</Text>
            <Text className="text-foreground text-xl font-bold flex-1">
              {step.title}
            </Text>
          </View>

          <Text className="text-muted leading-relaxed text-base mb-6">
            {step.description}
          </Text>

          {/* Play/Pause Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center flex-row justify-center gap-3"
            style={{ backgroundColor: colors.primary }}
            onPress={playAudio}
            activeOpacity={0.8}
          >
            <IconSymbol
              name={isPlaying ? "pause.fill" : "play.fill"}
              size={24}
              color={colors.background}
            />
            <Text className="text-background text-base font-semibold">
              {isPlaying ? "Pausar Áudio" : "Ouvir Explicação"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center border-2"
            style={{
              borderColor: colors.border,
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
            onPress={prevStep}
            disabled={currentStep === 0}
            activeOpacity={0.8}
          >
            <Text className="text-foreground font-semibold">← Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={nextStep}
            activeOpacity={0.8}
          >
            <Text className="text-background font-semibold">
              {currentStep === TUTORIAL_STEPS.length - 1
                ? "Finalizar ✓"
                : "Próximo →"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicators */}
        <View className="flex-row justify-center gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, index) => (
            <View
              key={index}
              className="h-2 rounded-full"
              style={{
                width: index === currentStep ? 24 : 8,
                backgroundColor:
                  index <= currentStep ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
