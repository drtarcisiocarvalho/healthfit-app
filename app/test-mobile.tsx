import { View, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function TestMobileScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-foreground text-2xl font-bold mb-4">
          ✅ App Funcionando!
        </Text>
        <Text className="text-muted text-center">
          Se você está vendo esta tela, o aplicativo está carregando corretamente no Expo Go.
        </Text>
      </View>
    </ScreenContainer>
  );
}
