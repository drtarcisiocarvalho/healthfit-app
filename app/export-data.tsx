import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  extension: string;
}

const exportFormats: ExportFormat[] = [
  {
    id: "json",
    name: "JSON",
    description: "Formato estruturado para desenvolvedores",
    icon: "doc.text.fill",
    extension: "json",
  },
  {
    id: "csv",
    name: "CSV",
    description: "Compatível com Excel e Google Sheets",
    icon: "tablecells.fill",
    extension: "csv",
  },
  {
    id: "txt",
    name: "Texto",
    description: "Formato otimizado para IAs (ChatGPT, Gemini)",
    icon: "text.alignleft",
    extension: "txt",
  },
];

export default function ExportDataScreen() {
  const colors = useColors();
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);

    try {
      // Coletar todos os dados
      const workouts = await AsyncStorage.getItem("workouts");
      const vitalSigns = await AsyncStorage.getItem("vitalSigns");
      const bodyComposition = await AsyncStorage.getItem("bodyComposition");

      const data = {
        export_metadata: {
          date: new Date().toISOString(),
          version: "1.0",
          app: "HealthFit",
        },
        workouts: workouts ? JSON.parse(workouts) : [],
        vital_signs: vitalSigns ? JSON.parse(vitalSigns) : [],
        body_composition: bodyComposition ? JSON.parse(bodyComposition) : [],
      };

      let content = "";
      let filename = "";

      if (format.id === "json") {
        content = JSON.stringify(data, null, 2);
        filename = `healthfit_export_${new Date().toISOString().split("T")[0]}.json`;
      } else if (format.id === "csv") {
        // CSV simplificado de treinos
        content = "Data,Tipo,Duração (min),Distância (km),Calorias\n";
        data.workouts.forEach((w: any) => {
          content += `${w.date},${w.type},${w.duration},${w.distance || 0},${w.calories}\n`;
        });
        filename = `healthfit_workouts_${new Date().toISOString().split("T")[0]}.csv`;
      } else if (format.id === "txt") {
        // Formato otimizado para IA
        content = `# HealthFit - Dados de Saúde e Fitness\n\n`;
        content += `Data da exportação: ${new Date().toLocaleString("pt-BR")}\n\n`;
        content += `## Resumo\n`;
        content += `- Total de treinos: ${data.workouts.length}\n`;
        content += `- Total de medições de sinais vitais: ${data.vital_signs.length}\n`;
        content += `- Total de avaliações corporais: ${data.body_composition.length}\n\n`;
        content += `## Treinos\n`;
        data.workouts.forEach((w: any, i: number) => {
          content += `\n### Treino ${i + 1}\n`;
          content += `- Data: ${new Date(w.date).toLocaleString("pt-BR")}\n`;
          content += `- Tipo: ${w.type}\n`;
          content += `- Duração: ${w.duration} minutos\n`;
          if (w.distance) content += `- Distância: ${w.distance} km\n`;
          content += `- Calorias: ${w.calories} kcal\n`;
        });
        filename = `healthfit_export_${new Date().toISOString().split("T")[0]}.txt`;
      }

      // Salvar arquivo
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, content);

      // Compartilhar arquivo
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format.id === "json" ? "application/json" : "text/plain",
          dialogTitle: "Exportar dados do HealthFit",
        });
      } else {
        Alert.alert("Sucesso", `Dados exportados para: ${fileUri}`);
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      Alert.alert("Erro", "Não foi possível exportar os dados. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Exportar Dados</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          <Text className="text-muted text-sm mb-6">
            Exporte todos os seus dados de saúde e fitness em diferentes formatos. Seus dados são privados e seguros.
          </Text>

          {/* Formatos */}
          <Text className="text-foreground text-lg font-semibold mb-4">Escolha o Formato</Text>

          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format.id}
              className="bg-surface rounded-2xl p-5 mb-3 border border-border"
              activeOpacity={0.7}
              onPress={() => handleExport(format)}
              disabled={exporting}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + "33" }}>
                    <IconSymbol name={format.icon as any} size={28} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-lg font-semibold mb-1">{format.name}</Text>
                    <Text className="text-muted text-sm">{format.description}</Text>
                  </View>
                </View>
                <IconSymbol name="arrow.down.circle.fill" size={24} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Informações LGPD */}
          <View className="bg-surface rounded-2xl p-5 mt-4 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="lock.fill" size={20} color={colors.success} />
              <View className="flex-1">
                <Text className="text-foreground text-base font-semibold mb-2">Privacidade e Segurança</Text>
                <Text className="text-muted text-sm leading-relaxed">
                  Seus dados são armazenados localmente no seu dispositivo. A exportação é feita de forma segura e você tem controle total sobre seus dados conforme a LGPD.
                </Text>
              </View>
            </View>
          </View>

          <View className="h-20" />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
