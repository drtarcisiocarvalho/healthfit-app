import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Professional {
  id: string;
  name: string;
  category: "personal" | "nutritionist" | "physiotherapist";
  specialty: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  verified: boolean;
  credentials: string[];
  experience: number;
}

const PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "Dr. Carlos Silva",
    category: "personal",
    specialty: "Hipertrofia e Emagrecimento",
    rating: 4.9,
    reviews: 127,
    price: 150,
    avatar: "👨‍⚕️",
    verified: true,
    credentials: ["CREF 12345-G/SP", "Pós-Graduação USP"],
    experience: 8,
  },
  {
    id: "2",
    name: "Dra. Ana Costa",
    category: "nutritionist",
    specialty: "Nutrição Esportiva",
    rating: 5.0,
    reviews: 89,
    price: 200,
    avatar: "👩‍⚕️",
    verified: true,
    credentials: ["CRN 54321-3", "Mestre em Nutrição"],
    experience: 12,
  },
  {
    id: "3",
    name: "Dr. Pedro Santos",
    category: "physiotherapist",
    specialty: "Reabilitação Esportiva",
    rating: 4.8,
    reviews: 156,
    price: 180,
    avatar: "👨‍⚕️",
    verified: true,
    credentials: ["CREFITO 98765-F", "Especialista em Ortopedia"],
    experience: 10,
  },
];

const CATEGORIES = [
  { id: "all", name: "Todos", icon: "square.grid.2x2.fill" },
  { id: "personal", name: "Personal", icon: "figure.strengthtraining.traditional" },
  { id: "nutritionist", name: "Nutricionista", icon: "fork.knife" },
  { id: "physiotherapist", name: "Fisioterapeuta", icon: "cross.case.fill" },
];

export default function MarketplaceScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [professionals, setProfessionals] = useState(PROFESSIONALS);

  const filteredProfessionals =
    selectedCategory === "all"
      ? professionals
      : professionals.filter((p) => p.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal":
        return colors.health;
      case "nutritionist":
        return colors.success;
      case "physiotherapist":
        return colors.medical;
      default:
        return colors.primary;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "personal":
        return "Personal Trainer";
      case "nutritionist":
        return "Nutricionista";
      case "physiotherapist":
        return "Fisioterapeuta";
      default:
        return "";
    }
  };

  const renderProfessional = ({ item }: { item: Professional }) => {
    return (
      <TouchableOpacity
        className="bg-surface rounded-2xl p-5 mb-3 border border-border"
        activeOpacity={0.8}
        onPress={() => {}}
      >
        {/* Header */}
        <View className="flex-row items-start gap-4 mb-4">
          <View className="relative">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: getCategoryColor(item.category) + "20" }}
            >
              <Text className="text-4xl">{item.avatar}</Text>
            </View>
            {item.verified && (
              <View
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.success }}
              >
                <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-foreground font-bold text-lg">{item.name}</Text>
            </View>
            <View
              className="self-start px-2 py-1 rounded-full mb-2"
              style={{ backgroundColor: getCategoryColor(item.category) + "20" }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: getCategoryColor(item.category) }}
              >
                {getCategoryLabel(item.category)}
              </Text>
            </View>
            <Text className="text-muted text-sm">{item.specialty}</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row items-center gap-1">
            <IconSymbol name="star.fill" size={16} color={colors.warning} />
            <Text className="text-foreground font-bold">{item.rating.toFixed(1)}</Text>
            <Text className="text-muted text-sm">({item.reviews})</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <IconSymbol name="briefcase.fill" size={16} color={colors.muted} />
            <Text className="text-muted text-sm">{item.experience} anos</Text>
          </View>
        </View>

        {/* Credentials */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {item.credentials.map((credential, index) => (
            <View
              key={index}
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.primary + "10" }}
            >
              <Text className="text-xs" style={{ color: colors.primary }}>
                {credential}
              </Text>
            </View>
          ))}
        </View>

        {/* Price and Action */}
        <View className="flex-row items-center justify-between pt-4 border-t border-border">
          <View>
            <Text className="text-muted text-sm">A partir de</Text>
            <Text className="text-foreground font-bold text-2xl">
              R$ {item.price}
              <Text className="text-muted text-sm font-normal">/sessão</Text>
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: getCategoryColor(item.category) }}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text className="text-white font-semibold">Agendar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Marketplace</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <IconSymbol name="magnifyingglass" size={24} color={colors.health} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-6 py-4 border-b border-border">
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mr-3 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor:
                    selectedCategory === item.id ? colors.health + "20" : colors.surface,
                }}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(item.id)}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol
                    name={item.icon as any}
                    size={20}
                    color={selectedCategory === item.id ? colors.health : colors.muted}
                  />
                  <Text
                    className="font-semibold"
                    style={{
                      color: selectedCategory === item.id ? colors.health : colors.foreground,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Professionals List */}
        <FlatList
          data={filteredProfessionals}
          renderItem={renderProfessional}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          ListHeaderComponent={
            <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
              <View className="flex-row items-start gap-3">
                <IconSymbol name="shield.checkered" size={28} color={colors.success} />
                <View className="flex-1">
                  <Text className="text-foreground font-bold mb-1">
                    Profissionais Certificados
                  </Text>
                  <Text className="text-muted text-sm">
                    Todos os profissionais são verificados e possuem credenciais válidas
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center py-12">
              <IconSymbol name="person.crop.circle.badge.xmark" size={64} color={colors.muted} />
              <Text className="text-foreground font-bold text-lg mt-4">
                Nenhum profissional encontrado
              </Text>
              <Text className="text-muted text-center mt-2">
                Tente selecionar outra categoria
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
