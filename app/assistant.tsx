import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou seu assistente virtual de saúde e fitness. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [userContext, setUserContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = trpc.chat.useMutation();

  useEffect(() => {
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      const workouts = await AsyncStorage.getItem("workouts");
      const vitalSigns = await AsyncStorage.getItem("vitalSigns");
      const bodyComposition = await AsyncStorage.getItem("bodyComposition");

      setUserContext({
        workouts: workouts ? JSON.parse(workouts) : [],
        vitalSigns: vitalSigns ? JSON.parse(vitalSigns) : [],
        bodyComposition: bodyComposition ? JSON.parse(bodyComposition) : [],
      });
    } catch (error) {
      console.error("Erro ao carregar contexto:", error);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      // Preparar histórico de mensagens para IA
      const chatHistory = messages
        .filter((m) => m.id !== "1") // Remover mensagem inicial
        .map((m) => ({
          role: m.isUser ? ("user" as const) : ("assistant" as const),
          content: m.text,
        }));

      chatHistory.push({ role: "user" as const, content: userInput });

      // Chamar IA do backend
      const response = await chatMutation.mutateAsync({
        messages: chatHistory,
        userContext,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof response.message === "string" ? response.message : "Desculpe, não consegui processar sua mensagem.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Fallback para resposta local se IA falhar
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAssistantResponse(userInput),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("treino") || input.includes("exercício")) {
      return "Para ter melhores resultados, recomendo treinar de 3 a 5 vezes por semana, alternando entre treinos cardiovasculares e de força. Você pode iniciar um novo treino na aba Treinos!";
    } else if (input.includes("calorias") || input.includes("alimentação")) {
      return "A quantidade ideal de calorias varia de pessoa para pessoa. Com base em seus treinos, posso ver que você está queimando calorias. Para uma recomendação personalizada, consulte um nutricionista através da telemedicina.";
    } else if (input.includes("sono") || input.includes("dormir")) {
      return "O sono é fundamental para a recuperação muscular e saúde geral. Recomendo de 7 a 9 horas por noite. Você pode monitorar seu sono conectando um wearable na aba Sono.";
    } else if (input.includes("pressão") || input.includes("glicemia")) {
      return "É importante monitorar seus sinais vitais regularmente. Você pode registrar suas medições na aba Saúde. Se notar valores fora do normal, recomendo consultar um médico.";
    } else if (input.includes("água") || input.includes("hidratação")) {
      return "A hidratação é essencial! Recomendo beber pelo menos 2 litros de água por dia, aumentando para 3 litros em dias de treino intenso.";
    } else {
      return "Entendo sua pergunta. Posso ajudá-lo com informações sobre treinos, alimentação, sono, sinais vitais e muito mais. O que você gostaria de saber especificamente?";
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`mb-3 ${item.isUser ? "items-end" : "items-start"}`}
    >
      <View
        className={`max-w-[80%] rounded-2xl p-4 ${
          item.isUser ? "bg-primary" : "bg-surface border border-border"
        }`}
      >
        <Text className={item.isUser ? "text-background" : "text-foreground"}>
          {item.text}
        </Text>
      </View>
      <Text className="text-muted text-xs mt-1">
        {item.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-foreground text-xl font-bold">Assistente Virtual</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
              <Text className="text-muted text-xs">Online</Text>
            </View>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 16 }}
          inverted={false}
        />

        {/* Input */}
        <View className="flex-row items-center gap-3 p-4 border-t border-border">
          <TextInput
            className="flex-1 bg-surface rounded-full px-4 py-3 text-foreground border border-border"
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.sleep }}
            activeOpacity={0.8}
            onPress={handleSend}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
