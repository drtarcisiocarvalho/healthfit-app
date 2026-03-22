import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  height: string;
  weight: string;
}

export default function PersonalInfoScreen() {
  const colors = useColors();
  const [info, setInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    height: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    try {
      const stored = await AsyncStorage.getItem("personalInfo");
      if (stored) {
        setInfo(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar informações:", error);
    }
  };

  const savePersonalInfo = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem("personalInfo", JSON.stringify(info));
      Alert.alert("Sucesso", "Informações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar informações:", error);
      Alert.alert("Erro", "Não foi possível salvar as informações");
    } finally {
      setLoading(false);
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
          <Text className="text-foreground text-xl font-bold">Informações Pessoais</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-4">
          {/* Nome */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Nome Completo</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="Digite seu nome"
              placeholderTextColor={colors.muted}
              value={info.name}
              onChangeText={(text) => setInfo({ ...info, name: text })}
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              value={info.email}
              onChangeText={(text) => setInfo({ ...info, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Telefone */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Telefone</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="(00) 00000-0000"
              placeholderTextColor={colors.muted}
              value={info.phone}
              onChangeText={(text) => setInfo({ ...info, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Data de Nascimento */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Data de Nascimento</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.muted}
              value={info.birthdate}
              onChangeText={(text) => setInfo({ ...info, birthdate: text })}
            />
          </View>

          {/* Gênero */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Gênero</Text>
            <View className="flex-row gap-3">
              {["Masculino", "Feminino", "Outro"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className="flex-1 rounded-xl p-4 border-2"
                  style={{
                    borderColor: info.gender === gender ? colors.primary : colors.border,
                    backgroundColor: info.gender === gender ? colors.primary + "20" : colors.surface,
                  }}
                  onPress={() => setInfo({ ...info, gender })}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: info.gender === gender ? colors.primary : colors.foreground }}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Altura */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Altura (cm)</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="170"
              placeholderTextColor={colors.muted}
              value={info.height}
              onChangeText={(text) => setInfo({ ...info, height: text })}
              keyboardType="numeric"
            />
          </View>

          {/* Peso */}
          <View>
            <Text className="text-foreground font-semibold mb-2">Peso (kg)</Text>
            <TextInput
              className="bg-surface rounded-xl p-4 border border-border text-foreground"
              placeholder="70"
              placeholderTextColor={colors.muted}
              value={info.weight}
              onChangeText={(text) => setInfo({ ...info, weight: text })}
              keyboardType="numeric"
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center mt-4"
            style={{ backgroundColor: colors.primary }}
            onPress={savePersonalInfo}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-background font-bold text-lg">
              {loading ? "Salvando..." : "Salvar Informações"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
