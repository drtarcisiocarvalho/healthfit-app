import { View, Image, Dimensions } from "react-native";
import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface AnimatedComparisonProps {
  beforeImage: string;
  afterImage: string;
  height?: number;
}

/**
 * Componente de comparação lado a lado animada com slider interativo
 * Arraste o slider para revelar a foto "depois" sobre a foto "antes"
 */
export function AnimatedComparison({
  beforeImage,
  afterImage,
  height = 400,
}: AnimatedComparisonProps) {
  const screenWidth = Dimensions.get("window").width - 48; // padding
  const sliderPosition = useSharedValue(screenWidth / 2);
  const [currentPosition, setCurrentPosition] = useState(screenWidth / 2);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(screenWidth, event.absoluteX - 24));
      sliderPosition.value = newPosition;
      runOnJS(setCurrentPosition)(newPosition);
    })
    .onEnd(() => {
      sliderPosition.value = withSpring(sliderPosition.value);
    });

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderPosition.value }],
  }));

  const afterImageStyle = useAnimatedStyle(() => ({
    width: sliderPosition.value,
  }));

  return (
    <View
      style={{
        width: screenWidth,
        height,
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Foto "Antes" (fundo) */}
      <Image
        source={{ uri: beforeImage }}
        style={{
          width: screenWidth,
          height,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="cover"
      />

      {/* Foto "Depois" (overlay com máscara) */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            height,
            overflow: "hidden",
          },
          afterImageStyle,
        ]}
      >
        <Image
          source={{ uri: afterImage }}
          style={{
            width: screenWidth,
            height,
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Slider */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: -2,
              width: 4,
              height,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 5,
            },
            sliderStyle,
          ]}
        >
          {/* Handle do slider */}
          <View
            style={{
              position: "absolute",
              top: height / 2 - 20,
              left: -18,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <View style={{ width: 2, height: 16, backgroundColor: "#666" }} />
              <View style={{ width: 2, height: 16, backgroundColor: "#666" }} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Labels */}
      <View
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "rgba(0,0,0,0.6)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
        }}
      >
        <Animated.Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          Antes
        </Animated.Text>
      </View>

      <View
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.6)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
        }}
      >
        <Animated.Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          Depois
        </Animated.Text>
      </View>
    </View>
  );
}
