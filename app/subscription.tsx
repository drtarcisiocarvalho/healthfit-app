import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  popular: boolean;
  features: string[];
  savings?: string;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    period: "month",
    popular: false,
    features: [
      "Rastreamento básico de treinos",
      "Registro de sinais vitais",
      "Dashboard simples",
      "Até 10 treinos/mês",
    ],
  },
  {
    id: "premium-monthly",
    name: "Premium Mensal",
    price: 29.9,
    period: "month",
    popular: true,
    features: [
      "Treinos ilimitados",
      "GPS e mapas detalhados",
      "Análise de vídeo com IA",
      "Assistente virtual inteligente",
      "Gráficos de evolução",
      "Exportação de dados",
      "Sem anúncios",
    ],
  },
  {
    id: "premium-yearly",
    name: "Premium Anual",
    price: 197,
    period: "year",
    popular: false,
    features: [
      "Todos os recursos Premium",
      "Coaching virtual personalizado",
      "Acesso ao marketplace",
      "Suporte prioritário",
      "Desconto em consultas",
    ],
    savings: "Economize R$ 161/ano",
  },
];

const COACHING_PLANS = [
  {
    id: "coaching-weight-loss",
    name: "Programa Perda de Peso",
    price: 197,
    duration: "12 semanas",
    description: "Plano completo com treinos e nutrição para emagrecimento saudável",
  },
  {
    id: "coaching-muscle-gain",
    name: "Programa Ganho de Massa",
    price: 197,
    duration: "12 semanas",
    description: "Hipertrofia muscular com progressão de carga e dieta hipercalórica",
  },
  {
    id: "coaching-endurance",
    name: "Programa Resistência",
    price: 197,
    duration: "12 semanas",
    description: "Melhore seu condicionamento cardiovascular e resistência aeróbica",
  },
];

export default function SubscriptionScreen() {
  const colors = useColors();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);

    // Simular processamento de pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    alert("Assinatura ativada com sucesso! 🎉");
  };

  const renderPlan = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;
    const isFree = plan.price === 0;

    return (
      <View
        key={plan.id}
        className="rounded-2xl p-6 mb-4 border-2"
        style={{
          backgroundColor: plan.popular ? colors.health + "10" : colors.surface,
          borderColor: plan.popular ? colors.health : colors.border,
        }}
      >
        {plan.popular && (
          <View
            className="absolute -top-3 self-center px-4 py-1 rounded-full"
            style={{ backgroundColor: colors.health }}
          >
            <Text className="text-white text-xs font-bold">MAIS POPULAR</Text>
          </View>
        )}

        {/* Header */}
        <View className="mb-4">
          <Text className="text-foreground font-bold text-2xl mb-2">{plan.name}</Text>
          <View className="flex-row items-baseline">
            <Text className="text-foreground font-bold text-4xl">
              R$ {plan.price.toFixed(2)}
            </Text>
            <Text className="text-muted ml-2">
              /{plan.period === "month" ? "mês" : "ano"}
            </Text>
          </View>
          {plan.savings && (
            <Text className="text-success font-semibold mt-2">{plan.savings}</Text>
          )}
        </View>

        {/* Features */}
        <View className="mb-6 gap-3">
          {plan.features.map((feature, index) => (
            <View key={index} className="flex-row items-start gap-2">
              <IconSymbol
                name="checkmark.circle.fill"
                size={20}
                color={plan.popular ? colors.health : colors.success}
              />
              <Text className="text-foreground flex-1">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          className="rounded-xl p-4 items-center"
          style={{
            backgroundColor: isFree
              ? colors.muted
              : plan.popular
              ? colors.health
              : colors.primary,
            opacity: isProcessing && isSelected ? 0.6 : 1,
          }}
          activeOpacity={0.8}
          onPress={() => !isFree && handleSubscribe(plan.id)}
          disabled={isFree || (isProcessing && isSelected)}
        >
          <Text className="text-white font-semibold text-lg">
            {isFree
              ? "Plano Atual"
              : isProcessing && isSelected
              ? "Processando..."
              : "Assinar Agora"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Assinaturas</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Info Banner */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="star.fill" size={28} color={colors.warning} />
              <View className="flex-1">
                <Text className="text-foreground font-bold mb-1">
                  Desbloqueie Todo o Potencial
                </Text>
                <Text className="text-muted text-sm">
                  Acesse recursos avançados, análises com IA e coaching personalizado para
                  alcançar seus objetivos mais rápido
                </Text>
              </View>
            </View>
          </View>

          {/* Plans */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-4">
              Escolha seu Plano
            </Text>
            {PLANS.map(renderPlan)}
          </View>

          {/* Coaching Programs */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">
              Programas de Coaching
            </Text>
            <Text className="text-muted mb-4">Compra única - Acesso vitalício</Text>
            {COACHING_PLANS.map((program) => (
              <View
                key={program.id}
                className="bg-surface rounded-2xl p-5 mb-3 border border-border"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-lg mb-1">
                      {program.name}
                    </Text>
                    <View
                      className="self-start px-3 py-1 rounded-full mb-2"
                      style={{ backgroundColor: colors.health + "20" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: colors.health }}>
                        {program.duration}
                      </Text>
                    </View>
                    <Text className="text-muted text-sm">{program.description}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between pt-4 border-t border-border">
                  <Text className="text-foreground font-bold text-2xl">
                    R$ {program.price}
                  </Text>
                  <TouchableOpacity
                    className="rounded-xl px-6 py-3"
                    style={{ backgroundColor: colors.health }}
                    activeOpacity={0.8}
                    onPress={() => handleSubscribe(program.id)}
                  >
                    <Text className="text-white font-semibold">Comprar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Payment Methods */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">Métodos de Pagamento</Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: "#6772E5" + "20" }}
                >
                  <Text className="font-bold" style={{ color: "#6772E5" }}>
                    💳
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Cartão de Crédito</Text>
                  <Text className="text-muted text-sm">Visa, Mastercard, Elo</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: "#009EE3" + "20" }}
                >
                  <Text className="font-bold" style={{ color: "#009EE3" }}>
                    💰
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Mercado Pago</Text>
                  <Text className="text-muted text-sm">Pix, boleto, saldo</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Security */}
          <View className="items-center py-4">
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol name="lock.shield.fill" size={20} color={colors.success} />
              <Text className="text-muted text-sm">Pagamento 100% Seguro</Text>
            </View>
            <Text className="text-muted text-xs text-center">
              Cancele a qualquer momento • Reembolso em 7 dias
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
