import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { processPayment } from "@/lib/stripe";

export default function CheckoutScreen() {
  const colors = useColors();
  const { productName, price, productId } = useLocalSearchParams<{
    productName: string;
    price: string;
    productId: string;
  }>();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const priceValue = parseFloat(price || "0");

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const validateCard = (): boolean => {
    const cleanedCard = cardNumber.replace(/\s/g, "");
    if (cleanedCard.length < 13) {
      Alert.alert("Cartão inválido", "Número do cartão deve ter pelo menos 13 dígitos");
      return false;
    }
    if (expiry.length < 5) {
      Alert.alert("Validade inválida", "Informe a validade no formato MM/AA");
      return false;
    }
    if (cvc.length < 3) {
      Alert.alert("CVC inválido", "Informe o código de segurança (3 dígitos)");
      return false;
    }
    if (!holderName.trim()) {
      Alert.alert("Nome obrigatório", "Informe o nome impresso no cartão");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;

    setProcessing(true);
    try {
      const result = await processPayment(priceValue, productName || "Produto");

      if (result.status === "succeeded") {
        // Save purchase history
        const purchases = JSON.parse((await AsyncStorage.getItem("purchases")) || "[]");
        purchases.push({
          id: result.id,
          productId,
          productName,
          amount: priceValue,
          date: new Date().toISOString(),
          status: "confirmed",
        });
        await AsyncStorage.setItem("purchases", JSON.stringify(purchases));

        setPaymentSuccess(true);
      } else {
        Alert.alert("Pagamento falhou", "Tente novamente ou use outro cartão.");
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível processar o pagamento. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.success + "20" }}
          >
            <IconSymbol name="checkmark.circle.fill" size={60} color={colors.success} />
          </View>
          <Text className="text-foreground text-2xl font-bold mb-2">Pagamento Confirmado!</Text>
          <Text className="text-muted text-center text-base mb-2">
            Sua compra de <Text className="font-bold">{productName}</Text> foi realizada com sucesso.
          </Text>
          <Text className="text-primary text-xl font-bold mb-8">R$ {priceValue.toFixed(2)}</Text>

          <View className="bg-surface rounded-xl p-4 mb-8 w-full border border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol name="gift.fill" size={20} color={colors.success} />
              <Text className="text-success font-semibold">Cashback Recebido!</Text>
            </View>
            <Text className="text-muted text-sm">
              Você ganhou {Math.floor(priceValue / 10)} pontos nesta compra
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-xl p-4 items-center w-full"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-white font-bold text-lg">Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center gap-4 mb-6">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-bold">Pagamento</Text>
          </View>

          {/* Order Summary */}
          <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
            <Text className="text-muted text-sm mb-1">Produto</Text>
            <Text className="text-foreground font-semibold text-base mb-3">{productName}</Text>
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
              <Text className="text-muted">Total</Text>
              <Text className="text-primary text-xl font-bold">R$ {priceValue.toFixed(2)}</Text>
            </View>
          </View>

          {/* Stripe Badge */}
          <View className="flex-row items-center justify-center gap-2 mb-6">
            <IconSymbol name="lock.fill" size={16} color={colors.muted} />
            <Text className="text-muted text-sm">Pagamento seguro via Stripe</Text>
          </View>

          {/* Card Form */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold text-lg mb-4">Dados do Cartão</Text>

            <Text className="text-muted text-sm mb-2">Nome no Cartão</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
              placeholder="Como impresso no cartão"
              placeholderTextColor={colors.muted}
              value={holderName}
              onChangeText={setHolderName}
              autoCapitalize="characters"
              style={{ color: colors.foreground }}
            />

            <Text className="text-muted text-sm mb-2">Número do Cartão</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.muted}
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={19}
              style={{ color: colors.foreground }}
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-muted text-sm mb-2">Validade</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border"
                  placeholder="MM/AA"
                  placeholderTextColor={colors.muted}
                  value={expiry}
                  onChangeText={formatExpiry}
                  keyboardType="numeric"
                  maxLength={5}
                  style={{ color: colors.foreground }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-muted text-sm mb-2">CVC</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border"
                  placeholder="123"
                  placeholderTextColor={colors.muted}
                  value={cvc}
                  onChangeText={(t) => setCvc(t.replace(/\D/g, "").slice(0, 4))}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  style={{ color: colors.foreground }}
                />
              </View>
            </View>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            className="rounded-xl p-4 items-center flex-row justify-center gap-2 mb-6"
            style={{
              backgroundColor: processing ? colors.muted : colors.primary,
            }}
            activeOpacity={0.8}
            onPress={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-white font-bold text-lg">Processando...</Text>
              </>
            ) : (
              <>
                <IconSymbol name="lock.fill" size={20} color="#FFFFFF" />
                <Text className="text-white font-bold text-lg">Pagar R$ {priceValue.toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Security Info */}
          <View className="items-center mb-6">
            <Text className="text-muted text-xs text-center">
              Seus dados são criptografados e processados com segurança pela Stripe.
              Não armazenamos dados do seu cartão.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
