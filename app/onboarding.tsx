import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");

const onboardingSteps = [
  {
    id: 1,
    icon: "location.fill" as const,
    title: "Treinos com GPS Real",
    description: "Rastreie seus treinos ao ar livre com GPS em tempo real. Veja distância, velocidade, ritmo e rota completa.",
    color: "#10B981",
  },
  {
    id: 2,
    icon: "person.crop.circle.fill" as const,
    title: "Scanner Corporal 3D",
    description: "Tire 3 fotos e a IA calcula automaticamente suas medidas corporais. Acompanhe sua evolução física.",
    color: "#3B82F6",
  },
  {
    id: 3,
    icon: "cart.fill" as const,
    title: "Loja Wellness Premium",
    description: "Compre suplementos, vestuário e equipamentos das melhores marcas. Ganhe cashback e pontos VIP.",
    color: "#F59E0B",
  },
  {
    id: 4,
    icon: "sparkles" as const,
    title: "Assistente IA Personalizado",
    description: "Chat inteligente que analisa seus dados e fornece insights personalizados para otimizar seus resultados.",
    color: "#8B5CF6",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    router.replace("/(tabs)");
  };

  const step = onboardingSteps[currentStep];

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 justify-between p-6">
        {/* Skip Button */}
        <View className="items-end">
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text className="text-muted text-base">Pular</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center">
          {/* Icon */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-8"
            style={{ backgroundColor: step.color + "20" }}
          >
            <IconSymbol name={step.icon} size={64} color={step.color} />
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-foreground text-center mb-4">
            {step.title}
          </Text>

          {/* Description */}
          <Text className="text-base text-muted text-center leading-relaxed px-4">
            {step.description}
          </Text>
        </View>

        {/* Bottom Section */}
        <View>
          {/* Dots Indicator */}
          <View className="flex-row justify-center mb-8 gap-2">
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                className="h-2 rounded-full"
                style={{
                  width: index === currentStep ? 24 : 8,
                  backgroundColor: index === currentStep ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-primary py-4 rounded-full items-center"
            activeOpacity={0.8}
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-lg font-semibold">
              {currentStep === onboardingSteps.length - 1 ? "Começar" : "Próximo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
