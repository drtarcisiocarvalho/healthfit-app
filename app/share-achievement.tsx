import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Sharing from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ShareAchievementScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState("workout");

  const templates = [
    { id: "workout", name: "Treino Completo", icon: "figure.run" },
    { id: "streak", name: "Sequência de Dias", icon: "flame.fill" },
    { id: "goal", name: "Meta Alcançada", icon: "trophy.fill" },
    { id: "badge", name: "Conquista Desbloqueada", icon: "star.fill" },
  ];

  const socialPlatforms = [
    { id: "instagram", name: "Instagram Stories", icon: "camera.fill", color: "#E4405F" },
    { id: "facebook", name: "Facebook", icon: "f.circle.fill", color: "#1877F2" },
    { id: "twitter", name: "Twitter/X", icon: "bird.fill", color: "#1DA1F2" },
    { id: "whatsapp", name: "WhatsApp", icon: "message.fill", color: "#25D366" },
  ];

  const handleShare = async (platform: string) => {
    try {
      // Aqui você geraria a imagem do card personalizado
      // Por enquanto, apenas mostra a intenção
      const message = generateShareMessage();
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // await Sharing.shareAsync(imageUri, {
        //   mimeType: 'image/png',
        //   dialogTitle: 'Compartilhar Conquista'
        // });
        Alert.alert(
          "Compartilhar",
          `Compartilhando no ${platform}:\n\n${message}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Não foi possível compartilhar");
    }
  };

  const generateShareMessage = () => {
    switch (selectedTemplate) {
      case "workout":
        return "🏃 Acabei de completar um treino incrível no HealthFit!\n💪 45 minutos de corrida\n🔥 350 calorias queimadas\n#HealthFit #Fitness";
      case "streak":
        return "🔥 15 dias consecutivos treinando!\n💪 Consistência é a chave\n#HealthFit #Motivação";
      case "goal":
        return "🎯 Meta alcançada!\n✅ Perdi 5kg em 2 meses\n💪 Foco e determinação\n#HealthFit #Transformação";
      case "badge":
        return "🏆 Nova conquista desbloqueada!\n⭐ Madrugador - 10 treinos antes das 7h\n#HealthFit #Conquista";
      default:
        return "💪 Progresso no HealthFit!";
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Compartilhar</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Preview Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border items-center">
            <View
              className="w-full aspect-square rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: colors.health + "20" }}
            >
              <IconSymbol
                name={templates.find((t) => t.id === selectedTemplate)?.icon as any}
                size={80}
                color={colors.health}
              />
              <Text className="text-foreground text-2xl font-bold mt-4">HealthFit</Text>
              <Text className="text-muted text-center mt-2 px-4">
                {generateShareMessage().split("\n")[0]}
              </Text>
            </View>
            <Text className="text-muted text-sm text-center">
              Preview do card que será compartilhado
            </Text>
          </View>

          {/* Template Selection */}
          <View>
            <Text className="text-foreground font-bold mb-3">Escolha o Template</Text>
            <View className="flex-row flex-wrap gap-3">
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  className="flex-1 min-w-[45%] bg-surface rounded-xl p-4 border"
                  style={{
                    borderColor: selectedTemplate === template.id ? colors.health : colors.border,
                    backgroundColor:
                      selectedTemplate === template.id ? colors.health + "10" : colors.surface,
                  }}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTemplate(template.id)}
                >
                  <View className="items-center gap-2">
                    <IconSymbol
                      name={template.icon as any}
                      size={32}
                      color={selectedTemplate === template.id ? colors.health : colors.muted}
                    />
                    <Text
                      className="text-sm font-semibold text-center"
                      style={{
                        color: selectedTemplate === template.id ? colors.health : colors.foreground,
                      }}
                    >
                      {template.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Social Platforms */}
          <View>
            <Text className="text-foreground font-bold mb-3">Compartilhar em</Text>
            <View className="gap-3">
              {socialPlatforms.map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  className="bg-surface rounded-xl p-4 border border-border flex-row items-center gap-3"
                  activeOpacity={0.7}
                  onPress={() => handleShare(platform.name)}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: platform.color + "20" }}
                  >
                    <IconSymbol name={platform.icon as any} size={24} color={platform.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">{platform.name}</Text>
                    <Text className="text-muted text-sm">Compartilhar conquista</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Customization Options */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">Opções de Personalização</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Incluir estatísticas</Text>
                <View
                  className="w-12 h-7 rounded-full items-center justify-end flex-row px-1"
                  style={{ backgroundColor: colors.health }}
                >
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Incluir logo do app</Text>
                <View
                  className="w-12 h-7 rounded-full items-center justify-end flex-row px-1"
                  style={{ backgroundColor: colors.health }}
                >
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted">Incluir hashtags</Text>
                <View
                  className="w-12 h-7 rounded-full items-center justify-end flex-row px-1"
                  style={{ backgroundColor: colors.health }}
                >
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </View>
            </View>
          </View>

          {/* Download Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center flex-row justify-center gap-2 border-2"
            style={{ borderColor: colors.health }}
            activeOpacity={0.8}
            onPress={() => Alert.alert("Download", "Imagem salva na galeria!")}
          >
            <IconSymbol name="arrow.down.circle.fill" size={20} color={colors.health} />
            <Text className="font-semibold text-base" style={{ color: colors.health }}>
              Salvar Imagem
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
