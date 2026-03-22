import { View, Text, TouchableOpacity, ScrollView, Share } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Referral {
  id: string;
  name: string;
  date: string;
  status: "pending" | "completed" | "rewarded";
}

const MOCK_REFERRALS: Referral[] = [
  {
    id: "ref_001",
    name: "Maria Silva",
    date: "2026-01-23",
    status: "rewarded",
  },
  {
    id: "ref_002",
    name: "João Santos",
    date: "2026-01-24",
    status: "completed",
  },
  {
    id: "ref_003",
    name: "Ana Costa",
    date: "2026-01-25",
    status: "pending",
  },
];

export default function ReferralScreen() {
  const colors = useColors();
  const [referralCode] = useState("HEALTH2026");
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [copiedCode, setCopiedCode] = useState(false);

  const completedReferrals = referrals.filter((r) => r.status === "completed" || r.status === "rewarded").length;
  const rewardsEarned = Math.floor(completedReferrals / 3);
  const progressToNextReward = completedReferrals % 3;

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Junte-se a mim no HealthFit! Use meu código ${referralCode} e ganhe 1 semana Premium grátis. Baixe agora: https://healthfit.app/ref/${referralCode}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "completed":
        return colors.health;
      case "rewarded":
        return colors.primary;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "completed":
        return "Confirmado";
      case "rewarded":
        return "Recompensado";
      default:
        return "";
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
          <Text className="text-foreground text-xl font-bold">Indicar Amigos</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Hero Card */}
          <View
            className="rounded-3xl p-8 border-2"
            style={{
              backgroundColor: colors.health + "10",
              borderColor: colors.health,
            }}
          >
            <View className="items-center mb-6">
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: colors.health + "20" }}
              >
                <Text className="text-5xl">🎁</Text>
              </View>
              <Text className="text-foreground text-2xl font-bold text-center mb-2">
                Ganhe Premium Grátis!
              </Text>
              <Text className="text-muted text-center">
                Indique 3 amigos e ganhe 1 mês de Premium gratuitamente
              </Text>
            </View>

            {/* Referral Code */}
            <View className="bg-background rounded-2xl p-5 mb-4">
              <Text className="text-muted text-sm text-center mb-2">Seu código de indicação</Text>
              <Text className="text-foreground text-3xl font-bold text-center mb-4">
                {referralCode}
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 rounded-xl p-4 items-center"
                  style={{ backgroundColor: colors.health }}
                  activeOpacity={0.8}
                  onPress={handleCopyCode}
                >
                  <View className="flex-row items-center gap-2">
                    <IconSymbol
                      name={copiedCode ? "checkmark" : "doc.on.doc"}
                      size={20}
                      color="#ffffff"
                    />
                    <Text className="text-white font-semibold">
                      {copiedCode ? "Copiado!" : "Copiar"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-xl p-4 items-center border-2"
                  style={{ borderColor: colors.health }}
                  activeOpacity={0.8}
                  onPress={handleShare}
                >
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="square.and.arrow.up" size={20} color={colors.health} />
                    <Text className="font-semibold" style={{ color: colors.health }}>
                      Compartilhar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Progress Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-foreground font-bold text-lg mb-4">Seu Progresso</Text>

            {/* Stats */}
            <View className="flex-row items-center justify-around mb-6">
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{completedReferrals}</Text>
                <Text className="text-muted text-sm">Indicações</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{rewardsEarned}</Text>
                <Text className="text-muted text-sm">Recompensas</Text>
              </View>
              <View className="w-px h-12 bg-border" />
              <View className="items-center">
                <Text className="text-foreground text-3xl font-bold">{progressToNextReward}/3</Text>
                <Text className="text-muted text-sm">Próxima</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-muted text-sm">Próxima recompensa</Text>
                <Text className="text-muted text-sm">
                  {3 - progressToNextReward} {3 - progressToNextReward === 1 ? "indicação" : "indicações"} restantes
                </Text>
              </View>
              <View className="h-3 rounded-full bg-border overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: colors.health,
                    width: `${(progressToNextReward / 3) * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* How it Works */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-foreground font-bold text-lg mb-4">Como Funciona</Text>
            <View className="gap-4">
              {[
                {
                  step: "1",
                  title: "Compartilhe seu código",
                  description: "Envie seu código único para amigos e familiares",
                },
                {
                  step: "2",
                  title: "Amigos se cadastram",
                  description: "Eles usam seu código ao criar a conta no app",
                },
                {
                  step: "3",
                  title: "Ganhe recompensas",
                  description: "A cada 3 indicações confirmadas, ganhe 1 mês Premium grátis",
                },
              ].map((item) => (
                <View key={item.step} className="flex-row items-start gap-4">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.health + "20" }}
                  >
                    <Text className="font-bold text-lg" style={{ color: colors.health }}>
                      {item.step}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold mb-1">{item.title}</Text>
                    <Text className="text-muted text-sm">{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Referral History */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Suas Indicações</Text>
            {referrals.length > 0 ? (
              <View className="gap-3">
                {referrals.map((referral) => (
                  <View
                    key={referral.id}
                    className="bg-surface rounded-2xl p-5 border border-border"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-foreground font-bold mb-1">{referral.name}</Text>
                        <Text className="text-muted text-sm">
                          {new Date(referral.date).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                      <View
                        className="px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: getStatusColor(referral.status) + "20" }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getStatusColor(referral.status) }}
                        >
                          {getStatusLabel(referral.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center">
                <Text className="text-6xl mb-3">👥</Text>
                <Text className="text-foreground font-bold mb-1">Nenhuma indicação ainda</Text>
                <Text className="text-muted text-sm text-center">
                  Compartilhe seu código e comece a ganhar recompensas
                </Text>
              </View>
            )}
          </View>

          {/* Rewards Info */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-foreground font-semibold mb-2">Termos e Condições</Text>
                <Text className="text-muted text-sm mb-2">
                  • Seus amigos ganham 1 semana Premium grátis ao usar seu código
                </Text>
                <Text className="text-muted text-sm mb-2">
                  • Você ganha 1 mês Premium a cada 3 indicações confirmadas
                </Text>
                <Text className="text-muted text-sm">
                  • As recompensas são creditadas automaticamente em até 24h
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
