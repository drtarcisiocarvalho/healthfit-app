import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

export interface PoseValidation {
  isValid: boolean;
  distance: "too_close" | "too_far" | "perfect";
  height: "too_low" | "too_high" | "perfect";
  position: "left" | "right" | "center";
  feedback: string;
}

interface PoseValidatorProps {
  validation: PoseValidation;
}

/**
 * Boneco interativo MELHORADO que valida a pose do usuário em tempo real
 * Verde brilhante = pose correta | Vermelho pulsante = pose incorreta
 * Feedback visual muito mais claro e intuitivo
 */
export function PoseValidator({ validation }: PoseValidatorProps) {
  const [color, setColor] = useState("#10B981");
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (validation.isValid) {
      // VERDE BRILHANTE com efeito de glow
      setColor("#10B981");
      scale.value = withSpring(1.15, { damping: 8 });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      // VERMELHO PULSANTE com shake
      setColor("#EF4444");
      scale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withSpring(1, { damping: 5 })
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        true
      );
      glowOpacity.value = 0;
    }
  }, [validation.isValid]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View className="items-center gap-4">
      {/* Boneco SVG animado com glow */}
      <View style={{ position: "relative", alignItems: "center" }}>
        {/* Glow effect (apenas quando válido) */}
        {validation.isValid && (
          <Animated.View
            style={[
              glowStyle,
              {
                position: "absolute",
                width: 160,
                height: 220,
                backgroundColor: color,
                borderRadius: 80,
                opacity: 0.3,
              },
            ]}
          />
        )}

        <Animated.View style={[animatedStyle, { alignItems: "center" }]}>
          <View
            style={{
              width: 120,
              height: 180,
              backgroundColor: color,
              borderRadius: 60,
              position: "relative",
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: validation.isValid ? 0.8 : 0.4,
              shadowRadius: validation.isValid ? 20 : 10,
              elevation: 10,
            }}
          >
            {/* Cabeça */}
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: color,
                borderRadius: 20,
                position: "absolute",
                top: 10,
                left: 40,
                borderWidth: 4,
                borderColor: "#fff",
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
              }}
            />

            {/* Corpo */}
            <View
              style={{
                width: 60,
                height: 80,
                backgroundColor: color,
                borderRadius: 30,
                position: "absolute",
                top: 55,
                left: 30,
                borderWidth: 4,
                borderColor: "#fff",
              }}
            />

            {/* Braço esquerdo */}
            <View
              style={{
                width: 15,
                height: 60,
                backgroundColor: color,
                borderRadius: 10,
                position: "absolute",
                top: 60,
                left: 10,
                transform: [{ rotate: "-15deg" }],
                borderWidth: 3,
                borderColor: "#fff",
              }}
            />

            {/* Braço direito */}
            <View
              style={{
                width: 15,
                height: 60,
                backgroundColor: color,
                borderRadius: 10,
                position: "absolute",
                top: 60,
                right: 10,
                transform: [{ rotate: "15deg" }],
                borderWidth: 3,
                borderColor: "#fff",
              }}
            />

            {/* Perna esquerda */}
            <View
              style={{
                width: 20,
                height: 50,
                backgroundColor: color,
                borderRadius: 10,
                position: "absolute",
                bottom: 10,
                left: 25,
                borderWidth: 3,
                borderColor: "#fff",
              }}
            />

            {/* Perna direita */}
            <View
              style={{
                width: 20,
                height: 50,
                backgroundColor: color,
                borderRadius: 10,
                position: "absolute",
                bottom: 10,
                right: 25,
                borderWidth: 3,
                borderColor: "#fff",
              }}
            />
          </View>
        </Animated.View>
      </View>

      {/* Feedback textual MUITO MAIS CLARO */}
      <View
        className="rounded-2xl p-5 w-full max-w-sm"
        style={{
          backgroundColor: validation.isValid ? "#10B98115" : "#EF444415",
          borderWidth: 2,
          borderColor: color,
        }}
      >
        <View className="flex-row items-center justify-center gap-2 mb-3">
          <Text style={{ fontSize: 32 }}>
            {validation.isValid ? "✓" : "⚠"}
          </Text>
          <Text
            className="text-center font-bold text-lg"
            style={{ color: color }}
          >
            {validation.isValid ? "PERFEITO!" : "AJUSTE NECESSÁRIO"}
          </Text>
        </View>

        <Text className="text-foreground text-center text-base font-medium mb-4">
          {validation.feedback}
        </Text>

        {/* Indicadores específicos COM ÍCONES */}
        <View className="gap-3">
          <View
            className="flex-row items-center justify-between p-3 rounded-xl"
            style={{
              backgroundColor:
                validation.distance === "perfect" ? "#10B98110" : "#EF444410",
            }}
          >
            <View className="flex-row items-center gap-2">
              <Text style={{ fontSize: 20 }}>📏</Text>
              <Text className="text-foreground font-semibold">Distância:</Text>
            </View>
            <Text
              className="font-bold"
              style={{
                color:
                  validation.distance === "perfect" ? "#10B981" : "#EF4444",
                fontSize: 15,
              }}
            >
              {validation.distance === "perfect"
                ? "✓ Perfeita"
                : validation.distance === "too_close"
                ? "↔ Afaste-se"
                : "↔ Aproxime-se"}
            </Text>
          </View>

          <View
            className="flex-row items-center justify-between p-3 rounded-xl"
            style={{
              backgroundColor:
                validation.height === "perfect" ? "#10B98110" : "#EF444410",
            }}
          >
            <View className="flex-row items-center gap-2">
              <Text style={{ fontSize: 20 }}>📐</Text>
              <Text className="text-foreground font-semibold">Altura:</Text>
            </View>
            <Text
              className="font-bold"
              style={{
                color: validation.height === "perfect" ? "#10B981" : "#EF4444",
                fontSize: 15,
              }}
            >
              {validation.height === "perfect"
                ? "✓ Perfeita"
                : validation.height === "too_low"
                ? "↑ Levante câmera"
                : "↓ Abaixe câmera"}
            </Text>
          </View>

          <View
            className="flex-row items-center justify-between p-3 rounded-xl"
            style={{
              backgroundColor:
                validation.position === "center" ? "#10B98110" : "#EF444410",
            }}
          >
            <View className="flex-row items-center gap-2">
              <Text style={{ fontSize: 20 }}>🎯</Text>
              <Text className="text-foreground font-semibold">Posição:</Text>
            </View>
            <Text
              className="font-bold"
              style={{
                color:
                  validation.position === "center" ? "#10B981" : "#EF4444",
                fontSize: 15,
              }}
            >
              {validation.position === "center"
                ? "✓ Centralizado"
                : validation.position === "left"
                ? "→ Mova para direita"
                : "← Mova para esquerda"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
