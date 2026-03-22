import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as Speech from "expo-speech";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  speech: string;
  icon: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Boas-vindas",
    description: "Conheça a Sofia, sua assistente virtual no HealthFit!",
    speech:
      "Olá! Eu sou a Sofia, sua assistente virtual no HealthFit. Estou aqui para te ajudar em toda sua jornada de saúde e bem-estar. Vamos conhecer juntos as funcionalidades do app!",
    icon: "👋",
  },
  {
    id: "avatar3d",
    title: "Scanner Corporal 3D",
    description: "Tire fotos e obtenha suas medidas corporais com IA",
    speech:
      "Com o Scanner Corporal 3D, você pode tirar fotos e nossa inteligência artificial calcula automaticamente suas medidas corporais, como percentual de gordura, circunferências e composição corporal.",
    icon: "📸",
  },
  {
    id: "workouts",
    title: "Treinos Personalizados",
    description: "Exercícios com rastreamento GPS e monitoramento cardíaco",
    speech:
      "Na seção de treinos, você encontra exercícios personalizados para seu nível. O app rastreia sua localização por GPS durante corridas e monitora seus batimentos cardíacos em tempo real.",
    icon: "💪",
  },
  {
    id: "nutrition",
    title: "Nutrição Inteligente",
    description: "Análise de refeições por foto e contagem de calorias",
    speech:
      "A nutrição inteligente analisa suas refeições por foto usando inteligência artificial. Basta tirar uma foto do seu prato e o app calcula automaticamente as calorias, proteínas, carboidratos e gorduras.",
    icon: "🍎",
  },
  {
    id: "health",
    title: "Monitoramento de Saúde",
    description: "Sinais vitais, insights e evolução do avatar 3D",
    speech:
      "Monitore seus sinais vitais como pressão arterial, frequência cardíaca e saturação de oxigênio. O app gera insights personalizados e acompanha a evolução do seu avatar 3D ao longo do tempo.",
    icon: "❤️",
  },
  {
    id: "store",
    title: "Loja Wellness",
    description: "Produtos saudáveis com cashback exclusivo",
    speech:
      "Na Loja Wellness, você encontra suplementos, equipamentos e roupas esportivas com cashback exclusivo. Quanto mais você compra, mais pontos acumula para descontos futuros.",
    icon: "🛒",
  },
  {
    id: "conclusion",
    title: "Pronto para Começar!",
    description: "Sua jornada de transformação começa agora",
    speech:
      "Parabéns! Agora você conhece todas as funcionalidades do HealthFit. Sua jornada de transformação começa agora. Lembre-se: consistência é a chave para alcançar seus objetivos. Vamos juntos!",
    icon: "🎉",
  },
];

export default function TutorialScreen() {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, [currentStep]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(TUTORIAL_STEPS[currentStep].speech, {
        language: "pt-BR",
        rate: 0.95,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      Speech.stop();
      setIsSpeaking(false);
      setCurrentStep(currentStep + 1);
    } else {
      finishTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Speech.stop();
      setIsSpeaking(false);
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = async () => {
    await AsyncStorage.setItem("tutorialCompleted", "true");
    Speech.stop();
    router.back();
  };

  const finishTutorial = async () => {
    await AsyncStorage.setItem("tutorialCompleted", "true");
    Speech.stop();
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
            <Image
              source={require("@/assets/images/tutorial-avatar.png")}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
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

          <Text className="text-muted leading-relaxed text-base mb-4">
            {step.description}
          </Text>

          {/* Speech text preview */}
          <View className="bg-background rounded-xl p-4 mb-4 border border-border">
            <Text className="text-foreground text-sm leading-relaxed italic">
              "{step.speech}"
            </Text>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center flex-row justify-center gap-3"
            style={{ backgroundColor: colors.primary }}
            onPress={toggleSpeech}
            activeOpacity={0.8}
          >
            <IconSymbol
              name={isSpeaking ? "pause.fill" : "play.fill"}
              size={24}
              color={colors.background}
            />
            <Text className="text-background text-base font-semibold">
              {isSpeaking ? "Pausar Áudio" : "Ouvir em Português"}
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
