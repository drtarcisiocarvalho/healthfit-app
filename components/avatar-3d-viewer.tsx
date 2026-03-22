import { View, Image, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Avatar3DViewerProps {
  photos: {
    frontal?: string;
    lateral?: string;
    costas?: string;
  };
  width: number;
  height: number;
}

export function Avatar3DViewer({ photos, width, height }: Avatar3DViewerProps) {
  const [currentView, setCurrentView] = useState<"frontal" | "lateral" | "costas">("frontal");
  const rotation = useSharedValue(0);

  // Criar gesto pan apenas para mobile
  const pan = Platform.OS !== 'web' ? Gesture.Pan()
    .onUpdate((event) => {
      rotation.value += event.translationX * 0.5;
    })
    .onEnd(() => {
      // Snap to nearest view
      const normalizedRotation = ((rotation.value % 360) + 360) % 360;
      
      if (normalizedRotation < 60 || normalizedRotation > 300) {
        rotation.value = withSpring(0);
        setCurrentView("frontal");
      } else if (normalizedRotation >= 60 && normalizedRotation < 180) {
        rotation.value = withSpring(90);
        setCurrentView("lateral");
      } else {
        rotation.value = withSpring(180);
        setCurrentView("costas");
      }
    }) : null;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
    };
  });

  const getCurrentImage = () => {
    const image = currentView === "frontal" 
      ? photos.frontal 
      : currentView === "lateral" 
      ? photos.lateral 
      : photos.costas;
    
    // Fallback para frontal se a imagem não existir
    return image || photos.frontal || '';
  };

  const cycleView = () => {
    if (currentView === "frontal") {
      setCurrentView("lateral");
    } else if (currentView === "lateral") {
      setCurrentView("costas");
    } else {
      setCurrentView("frontal");
    }
  };

  const content = (
    <Animated.View style={[{ width, height }, animatedStyle]}>
      <TouchableOpacity 
        onPress={cycleView} 
        activeOpacity={0.9}
        style={{ width, height }}
      >
        <Image
          source={{ uri: getCurrentImage() }}
          style={{ width, height, borderRadius: 16 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ width, height }}>
      {Platform.OS !== 'web' && pan ? (
        <GestureDetector gesture={pan}>
          {content}
        </GestureDetector>
      ) : (
        content
      )}
      
      {/* View Indicators */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
        <TouchableOpacity
          onPress={() => setCurrentView("frontal")}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: currentView === "frontal" ? "#0a7ea4" : "#687076",
          }}
        />
        <TouchableOpacity
          onPress={() => setCurrentView("lateral")}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: currentView === "lateral" ? "#0a7ea4" : "#687076",
          }}
        />
        <TouchableOpacity
          onPress={() => setCurrentView("costas")}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: currentView === "costas" ? "#0a7ea4" : "#687076",
          }}
        />
      </View>
    </View>
  );
}
