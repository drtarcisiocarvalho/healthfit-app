import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type ThemeMode = "dark" | "light" | "auto";

interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    health: string;
    medical: string;
    warning: string;
  };
}

const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default",
    name: "Padrão",
    colors: {
      primary: "#0a7ea4",
      health: "#10b981",
      medical: "#3b82f6",
      warning: "#f59e0b",
    },
  },
  {
    id: "purple",
    name: "Roxo Vibrante",
    colors: {
      primary: "#9333ea",
      health: "#a855f7",
      medical: "#8b5cf6",
      warning: "#fbbf24",
    },
  },
  {
    id: "blue",
    name: "Azul Oceano",
    colors: {
      primary: "#0284c7",
      health: "#06b6d4",
      medical: "#3b82f6",
      warning: "#f59e0b",
    },
  },
  {
    id: "green",
    name: "Verde Natura",
    colors: {
      primary: "#059669",
      health: "#10b981",
      medical: "#14b8a6",
      warning: "#f59e0b",
    },
  },
  {
    id: "red",
    name: "Vermelho Energia",
    colors: {
      primary: "#dc2626",
      health: "#ef4444",
      medical: "#f97316",
      warning: "#fbbf24",
    },
  },
];

export default function ThemeSettingsScreen() {
  const colors = useColors();
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [selectedPalette, setSelectedPalette] = useState<string>("default");
  const [previewMode, setPreviewMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const mode = (await AsyncStorage.getItem("theme_mode")) as ThemeMode;
      const palette = await AsyncStorage.getItem("color_palette");
      if (mode) setThemeMode(mode);
      if (palette) setSelectedPalette(palette);
      setPreviewMode(mode || "dark");
    } catch (error) {
      console.error("Error loading theme settings:", error);
    }
  };

  const saveThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("theme_mode", mode);
      setThemeMode(mode);
      setPreviewMode(mode === "auto" ? "dark" : mode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  };

  const saveColorPalette = async (paletteId: string) => {
    try {
      await AsyncStorage.setItem("color_palette", paletteId);
      setSelectedPalette(paletteId);
    } catch (error) {
      console.error("Error saving color palette:", error);
    }
  };

  const getPreviewColors = () => {
    const palette = COLOR_PALETTES.find((p) => p.id === selectedPalette)!;
    const isDark = previewMode === "dark";
    return {
      background: isDark ? "#151718" : "#ffffff",
      surface: isDark ? "#1e2022" : "#f5f5f5",
      foreground: isDark ? "#ECEDEE" : "#11181C",
      muted: isDark ? "#9BA1A6" : "#687076",
      border: isDark ? "#334155" : "#E5E7EB",
      ...palette.colors,
    };
  };

  const previewColors = getPreviewColors();

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Tema e Aparência</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Preview Card */}
          <View
            className="rounded-2xl p-6 border-2"
            style={{
              backgroundColor: previewColors.background,
              borderColor: previewColors.border,
            }}
          >
            <Text
              className="text-xl font-bold mb-4"
              style={{ color: previewColors.foreground }}
            >
              Preview do Tema
            </Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View
                  className="flex-1 rounded-xl p-4"
                  style={{ backgroundColor: previewColors.surface }}
                >
                  <View
                    className="w-12 h-12 rounded-full mb-2"
                    style={{ backgroundColor: previewColors.primary }}
                  />
                  <Text style={{ color: previewColors.foreground }} className="font-semibold">
                    Primário
                  </Text>
                </View>
                <View
                  className="flex-1 rounded-xl p-4"
                  style={{ backgroundColor: previewColors.surface }}
                >
                  <View
                    className="w-12 h-12 rounded-full mb-2"
                    style={{ backgroundColor: previewColors.health }}
                  />
                  <Text style={{ color: previewColors.foreground }} className="font-semibold">
                    Saúde
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View
                  className="flex-1 rounded-xl p-4"
                  style={{ backgroundColor: previewColors.surface }}
                >
                  <View
                    className="w-12 h-12 rounded-full mb-2"
                    style={{ backgroundColor: previewColors.medical }}
                  />
                  <Text style={{ color: previewColors.foreground }} className="font-semibold">
                    Médico
                  </Text>
                </View>
                <View
                  className="flex-1 rounded-xl p-4"
                  style={{ backgroundColor: previewColors.surface }}
                >
                  <View
                    className="w-12 h-12 rounded-full mb-2"
                    style={{ backgroundColor: previewColors.warning }}
                  />
                  <Text style={{ color: previewColors.foreground }} className="font-semibold">
                    Aviso
                  </Text>
                </View>
              </View>
            </View>

            {/* Preview Toggle */}
            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                className="flex-1 rounded-xl p-3"
                style={{
                  backgroundColor:
                    previewMode === "dark" ? previewColors.primary : previewColors.surface,
                }}
                activeOpacity={0.8}
                onPress={() => setPreviewMode("dark")}
              >
                <Text
                  className="text-center font-semibold"
                  style={{
                    color:
                      previewMode === "dark" ? "#ffffff" : previewColors.foreground,
                  }}
                >
                  Escuro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl p-3"
                style={{
                  backgroundColor:
                    previewMode === "light" ? previewColors.primary : previewColors.surface,
                }}
                activeOpacity={0.8}
                onPress={() => setPreviewMode("light")}
              >
                <Text
                  className="text-center font-semibold"
                  style={{
                    color:
                      previewMode === "light" ? "#ffffff" : previewColors.foreground,
                  }}
                >
                  Claro
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Mode */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Modo do Tema</Text>
            <View className="gap-3">
              {[
                {
                  id: "dark" as ThemeMode,
                  name: "Escuro",
                  icon: "moon.fill",
                  description: "Tema escuro permanente",
                },
                {
                  id: "light" as ThemeMode,
                  name: "Claro",
                  icon: "sun.max.fill",
                  description: "Tema claro permanente",
                },
                {
                  id: "auto" as ThemeMode,
                  name: "Automático",
                  icon: "sparkles",
                  description: "Segue o horário do dia",
                },
              ].map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  className="bg-surface rounded-2xl p-5 border-2"
                  style={{
                    borderColor: themeMode === mode.id ? colors.primary : colors.border,
                  }}
                  activeOpacity={0.8}
                  onPress={() => saveThemeMode(mode.id)}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{
                        backgroundColor:
                          themeMode === mode.id ? colors.primary + "20" : colors.muted + "20",
                      }}
                    >
                      <IconSymbol
                        name={mode.icon as any}
                        size={24}
                        color={themeMode === mode.id ? colors.primary : colors.muted}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold text-lg mb-1">
                        {mode.name}
                      </Text>
                      <Text className="text-muted text-sm">{mode.description}</Text>
                    </View>
                    {themeMode === mode.id && (
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

          {/* Color Palettes */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Paleta de Cores</Text>
            <View className="gap-3">
              {COLOR_PALETTES.map((palette) => (
                <TouchableOpacity
                  key={palette.id}
                  className="bg-surface rounded-2xl p-5 border-2"
                  style={{
                    borderColor:
                      selectedPalette === palette.id ? colors.primary : colors.border,
                  }}
                  activeOpacity={0.8}
                  onPress={() => saveColorPalette(palette.id)}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row gap-2">
                      {Object.values(palette.colors).map((color, index) => (
                        <View
                          key={index}
                          className="w-10 h-10 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-bold">{palette.name}</Text>
                    </View>
                    {selectedPalette === palette.id && (
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

          {/* Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-1">
                  Reinicie o app para aplicar
                </Text>
                <Text className="text-muted text-sm">
                  As mudanças de tema serão aplicadas completamente após reiniciar o aplicativo
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
