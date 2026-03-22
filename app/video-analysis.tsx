import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface PostureIssue {
  area: string;
  severity: "low" | "medium" | "high";
  description: string;
  correction: string;
}

const POSTURE_ANALYSIS: PostureIssue[] = [
  {
    area: "Coluna Lombar",
    severity: "high",
    description: "Curvatura excessiva detectada",
    correction: "Mantenha o core contraído e a coluna neutra durante o movimento",
  },
  {
    area: "Joelhos",
    severity: "medium",
    description: "Joelhos ultrapassando a linha dos pés",
    correction: "Empurre o quadril para trás e mantenha os joelhos alinhados com os pés",
  },
  {
    area: "Ombros",
    severity: "low",
    description: "Leve elevação dos ombros",
    correction: "Relaxe os ombros e mantenha-os afastados das orelhas",
  },
];

export default function VideoAnalysisScreen() {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisScore, setAnalysisScore] = useState(72);

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
          <IconSymbol name="video.fill" size={64} color={colors.muted} />
          <Text className="text-foreground text-xl font-bold mt-4 text-center">
            Permissão de Câmera Necessária
          </Text>
          <Text className="text-muted text-center mt-2 mb-6">
            Para analisar sua postura durante exercícios, precisamos acessar sua câmera
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

  if (showResults) {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case "high":
          return colors.error;
        case "medium":
          return colors.warning;
        case "low":
          return colors.success;
        default:
          return colors.muted;
      }
    };

    const getSeverityLabel = (severity: string) => {
      switch (severity) {
        case "high":
          return "Alta";
        case "medium":
          return "Média";
        case "low":
          return "Baixa";
        default:
          return "";
      }
    };

    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <TouchableOpacity
              onPress={() => {
                setShowResults(false);
                router.back();
              }}
              activeOpacity={0.7}
            >
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-xl font-bold">Análise de Postura</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.health} />
            </TouchableOpacity>
          </View>

          <View className="p-6 gap-6">
            {/* Score Card */}
            <View className="bg-surface rounded-2xl p-6 border border-border items-center">
              <Text className="text-muted text-sm mb-2">Score de Postura</Text>
              <View className="relative items-center justify-center mb-4">
                <View
                  className="w-32 h-32 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      analysisScore >= 80
                        ? colors.success + "20"
                        : analysisScore >= 60
                        ? colors.warning + "20"
                        : colors.error + "20",
                  }}
                >
                  <Text
                    className="text-5xl font-bold"
                    style={{
                      color:
                        analysisScore >= 80
                          ? colors.success
                          : analysisScore >= 60
                          ? colors.warning
                          : colors.error,
                    }}
                  >
                    {analysisScore}
                  </Text>
                  <Text className="text-muted text-sm">/100</Text>
                </View>
              </View>
              <Text className="text-foreground font-bold text-lg mb-1">Bom Desempenho</Text>
              <Text className="text-muted text-center text-sm">
                Alguns ajustes podem melhorar sua forma
              </Text>
            </View>

            {/* Issues */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">
                Áreas para Melhorar ({POSTURE_ANALYSIS.length})
              </Text>
              {POSTURE_ANALYSIS.map((issue, index) => (
                <View
                  key={index}
                  className="bg-surface rounded-2xl p-5 mb-3 border border-border"
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg mb-1">
                        {issue.area}
                      </Text>
                      <View
                        className="self-start px-2 py-1 rounded-full"
                        style={{ backgroundColor: getSeverityColor(issue.severity) + "20" }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: getSeverityColor(issue.severity) }}
                        >
                          Severidade {getSeverityLabel(issue.severity)}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: getSeverityColor(issue.severity) + "20" }}
                    >
                      <IconSymbol
                        name="exclamationmark.triangle.fill"
                        size={24}
                        color={getSeverityColor(issue.severity)}
                      />
                    </View>
                  </View>

                  {/* Description */}
                  <View className="mb-3">
                    <Text className="text-muted text-sm font-semibold mb-1">Problema:</Text>
                    <Text className="text-foreground">{issue.description}</Text>
                  </View>

                  {/* Correction */}
                  <View
                    className="rounded-xl p-3"
                    style={{ backgroundColor: colors.success + "10" }}
                  >
                    <View className="flex-row items-start gap-2">
                      <IconSymbol name="lightbulb.fill" size={20} color={colors.success} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold mb-1" style={{ color: colors.success }}>
                          Correção:
                        </Text>
                        <Text className="text-sm" style={{ color: colors.success }}>
                          {issue.correction}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View className="gap-3">
              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.health }}
                activeOpacity={0.8}
                onPress={() => setShowResults(false)}
              >
                <Text className="text-white font-semibold text-lg">Analisar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-xl p-4 items-center border-2"
                style={{ borderColor: colors.health }}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <Text className="font-semibold text-lg" style={{ color: colors.health }}>
                  Ver Vídeo Completo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

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
          <Text className="text-white text-xl font-bold">Análise de Vídeo</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Camera */}
        <CameraView style={{ flex: 1 }} facing="front">
          {/* Guide Overlay */}
          <View className="flex-1 items-center justify-center">
            <View className="relative">
              <View
                className="w-64 h-96 rounded-2xl border-4"
                style={{ borderColor: isRecording ? colors.error : "rgba(255,255,255,0.8)" }}
              />
              {/* Body guide lines */}
              <View className="absolute top-16 left-0 right-0 h-px bg-white opacity-50" />
              <View className="absolute top-48 left-0 right-0 h-px bg-white opacity-50" />
              <View className="absolute bottom-16 left-0 right-0 h-px bg-white opacity-50" />
            </View>
          </View>

          {/* Controls */}
          <View className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: colors.background }}>
            <View className="bg-surface rounded-xl p-5 mb-4 border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <IconSymbol name="figure.stand" size={32} color={colors.health} />
                <View className="flex-1">
                  <Text className="text-foreground font-bold">Posicione-se</Text>
                  <Text className="text-muted text-sm">
                    {isRecording
                      ? "Executando exercício..."
                      : "Fique de pé e centralize seu corpo"}
                  </Text>
                </View>
              </View>

              {isRecording && (
                <View className="flex-row items-center gap-2 mb-3">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.error }}
                  />
                  <Text className="text-muted text-sm">Gravando análise em tempo real</Text>
                </View>
              )}

              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: isRecording ? colors.error : colors.health }}
                activeOpacity={0.8}
                onPress={() => {
                  if (isRecording) {
                    setIsRecording(false);
                    setTimeout(() => setShowResults(true), 500);
                  } else {
                    setIsRecording(true);
                  }
                }}
              >
                <Text className="text-white font-semibold text-lg">
                  {isRecording ? "Parar Análise" : "Iniciar Análise"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </ScreenContainer>
  );
}
