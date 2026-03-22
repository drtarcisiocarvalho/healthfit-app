import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import * as Sharing from "expo-sharing";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type ReportPeriod = "week" | "month" | "quarter" | "year" | "custom";
type ReportTemplate = "complete" | "workouts" | "health" | "nutrition";

interface ReportSection {
  id: string;
  title: string;
  description: string;
  included: boolean;
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "summary",
    title: "Resumo Executivo",
    description: "Visão geral do período com principais métricas",
    included: true,
  },
  {
    id: "workouts",
    title: "Treinos e Atividades",
    description: "Gráficos de evolução, tipos de treino, calorias",
    included: true,
  },
  {
    id: "body",
    title: "Composição Corporal",
    description: "Peso, IMC, gordura, massa muscular",
    included: true,
  },
  {
    id: "vitals",
    title: "Sinais Vitais",
    description: "Pressão arterial, glicemia, frequência cardíaca",
    included: true,
  },
  {
    id: "sleep",
    title: "Qualidade do Sono",
    description: "Score de sono, fases, duração média",
    included: true,
  },
  {
    id: "nutrition",
    title: "Nutrição",
    description: "Calorias, macros, refeições registradas",
    included: true,
  },
  {
    id: "achievements",
    title: "Conquistas",
    description: "Badges desbloqueados, metas alcançadas",
    included: true,
  },
  {
    id: "recommendations",
    title: "Recomendações da IA",
    description: "Insights personalizados e sugestões",
    included: true,
  },
];

export default function ReportsScreen() {
  const colors = useColors();
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [template, setTemplate] = useState<ReportTemplate>("complete");
  const [sections, setSections] = useState<ReportSection[]>(REPORT_SECTIONS);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleSection = (sectionId: string) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, included: !s.included } : s))
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    // Simular geração de PDF
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGenerating(false);

    Alert.alert(
      "Relatório Gerado",
      "Seu relatório foi gerado com sucesso! Deseja compartilhar?",
      [
        { text: "Mais Tarde", style: "cancel" },
        {
          text: "Compartilhar",
          onPress: async () => {
            // Simular compartilhamento
            Alert.alert("Compartilhar", "Relatório compartilhado com sucesso!");
          },
        },
      ]
    );
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Última Semana";
      case "month":
        return "Último Mês";
      case "quarter":
        return "Último Trimestre";
      case "year":
        return "Último Ano";
      case "custom":
        return "Período Personalizado";
    }
  };

  const includedCount = sections.filter((s) => s.included).length;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Relatórios PDF</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Hero Card */}
          <View
            className="rounded-3xl p-8 border-2"
            style={{
              backgroundColor: colors.primary + "10",
              borderColor: colors.primary,
            }}
          >
            <View className="items-center">
              <Text className="text-6xl mb-4">📊</Text>
              <Text className="text-foreground text-2xl font-bold text-center mb-2">
                Relatórios Personalizados
              </Text>
              <Text className="text-muted text-center">
                Gere relatórios completos com gráficos e insights para compartilhar com
                profissionais
              </Text>
            </View>
          </View>

          {/* Period Selection */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Período</Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { id: "week" as ReportPeriod, label: "Semana" },
                { id: "month" as ReportPeriod, label: "Mês" },
                { id: "quarter" as ReportPeriod, label: "Trimestre" },
                { id: "year" as ReportPeriod, label: "Ano" },
              ].map((p) => (
                <TouchableOpacity
                  key={p.id}
                  className="flex-1 min-w-[45%] rounded-xl p-4 items-center border-2"
                  style={{
                    backgroundColor: period === p.id ? colors.primary + "20" : "transparent",
                    borderColor: period === p.id ? colors.primary : colors.border,
                  }}
                  activeOpacity={0.8}
                  onPress={() => setPeriod(p.id)}
                >
                  <Text
                    className="font-semibold"
                    style={{ color: period === p.id ? colors.primary : colors.foreground }}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Template Selection */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Template</Text>
            <View className="gap-3">
              {[
                {
                  id: "complete" as ReportTemplate,
                  name: "Completo",
                  description: "Todas as seções disponíveis",
                  icon: "📋",
                },
                {
                  id: "workouts" as ReportTemplate,
                  name: "Treinos",
                  description: "Foco em atividades físicas",
                  icon: "🏃",
                },
                {
                  id: "health" as ReportTemplate,
                  name: "Saúde",
                  description: "Sinais vitais e composição corporal",
                  icon: "❤️",
                },
                {
                  id: "nutrition" as ReportTemplate,
                  name: "Nutrição",
                  description: "Alimentação e macros",
                  icon: "🥗",
                },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  className="bg-surface rounded-2xl p-5 border-2"
                  style={{
                    borderColor: template === t.id ? colors.primary : colors.border,
                  }}
                  activeOpacity={0.8}
                  onPress={() => setTemplate(t.id)}
                >
                  <View className="flex-row items-center gap-4">
                    <Text className="text-4xl">{t.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold mb-1">{t.name}</Text>
                      <Text className="text-muted text-sm">{t.description}</Text>
                    </View>
                    {template === t.id && (
                      <IconSymbol
                        name="checkmark.circle.fill"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sections */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-foreground text-lg font-bold">
                Seções ({includedCount}/{sections.length})
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const allIncluded = sections.every((s) => s.included);
                  setSections(sections.map((s) => ({ ...s, included: !allIncluded })));
                }}
              >
                <Text className="text-primary font-semibold">
                  {sections.every((s) => s.included) ? "Desmarcar Todas" : "Marcar Todas"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              {sections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  className="bg-surface rounded-2xl p-5 border border-border"
                  activeOpacity={0.8}
                  onPress={() => handleToggleSection(section.id)}
                >
                  <View className="flex-row items-start gap-4">
                    <View
                      className="w-6 h-6 rounded items-center justify-center border-2 mt-0.5"
                      style={{
                        backgroundColor: section.included ? colors.primary : "transparent",
                        borderColor: section.included ? colors.primary : colors.border,
                      }}
                    >
                      {section.included && (
                        <IconSymbol name="checkmark" size={16} color="#ffffff" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold mb-1">{section.title}</Text>
                      <Text className="text-muted text-sm">{section.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            className="rounded-2xl p-6 items-center"
            style={{
              backgroundColor: colors.primary,
              opacity: isGenerating || includedCount === 0 ? 0.6 : 1,
            }}
            activeOpacity={0.8}
            onPress={handleGenerateReport}
            disabled={isGenerating || includedCount === 0}
          >
            <Text className="text-white text-lg font-bold">
              {isGenerating ? "Gerando Relatório..." : "Gerar Relatório PDF"}
            </Text>
            {!isGenerating && (
              <Text className="text-white text-sm mt-1 opacity-80">
                {getPeriodLabel()} • {includedCount} seções
              </Text>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-2">
                  Sobre os Relatórios
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Relatórios profissionais com gráficos e estatísticas detalhadas
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Ideal para compartilhar com médicos, nutricionistas e personal trainers
                </Text>
                <Text className="text-muted text-sm">
                  • Formato PDF compatível com impressão e compartilhamento digital
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
