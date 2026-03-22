import { View, Text, TouchableOpacity, Alert, Vibration } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const PIN_LENGTH = 4;
const PIN_STORAGE_KEY = "userPin";
const BIOMETRIC_ENABLED_KEY = "biometricEnabled";

export default function LoginScreen() {
  const colors = useColors();
  const [pin, setPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
    if (!storedPin) {
      setIsSettingPin(true);
    }

    // Check biometric availability
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometric(compatible && enrolled);

    const bioEnabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    setBiometricEnabled(bioEnabled === "true");

    // Auto-trigger biometric if enabled and PIN is set
    if (storedPin && bioEnabled === "true" && compatible && enrolled) {
      attemptBiometric();
    }
  };

  const attemptBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticar no HealthFit",
        cancelLabel: "Usar PIN",
        disableDeviceFallback: true,
      });

      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (e) {
      // Biometric failed, user can use PIN
    }
  };

  const handleKeyPress = useCallback(
    async (digit: string) => {
      if (digit === "delete") {
        if (isConfirming) {
          setConfirmPin((prev) => prev.slice(0, -1));
        } else {
          setPin((prev) => prev.slice(0, -1));
        }
        setError("");
        return;
      }

      if (digit === "biometric") {
        attemptBiometric();
        return;
      }

      if (isSettingPin) {
        if (isConfirming) {
          const newConfirm = confirmPin + digit;
          setConfirmPin(newConfirm);
          if (newConfirm.length === PIN_LENGTH) {
            if (newConfirm === pin) {
              await AsyncStorage.setItem(PIN_STORAGE_KEY, pin);
              // Ask about biometric
              if (hasBiometric) {
                Alert.alert(
                  "Face ID / Biometria",
                  "Deseja habilitar autenticação biométrica para login rápido?",
                  [
                    {
                      text: "Não",
                      onPress: () => router.replace("/(tabs)"),
                    },
                    {
                      text: "Sim",
                      onPress: async () => {
                        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
                        router.replace("/(tabs)");
                      },
                    },
                  ]
                );
              } else {
                Alert.alert("PIN Criado!", "Seu PIN foi configurado com sucesso.");
                router.replace("/(tabs)");
              }
            } else {
              Vibration.vibrate(200);
              setError("PINs não coincidem. Tente novamente.");
              setConfirmPin("");
              setIsConfirming(false);
              setPin("");
            }
          }
        } else {
          const newPin = pin + digit;
          setPin(newPin);
          if (newPin.length === PIN_LENGTH) {
            setIsConfirming(true);
            setError("");
          }
        }
      } else {
        // Verifying PIN
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === PIN_LENGTH) {
          const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
          if (newPin === storedPin) {
            router.replace("/(tabs)");
          } else {
            Vibration.vibrate(200);
            setError("PIN incorreto");
            setPin("");
          }
        }
      }
    },
    [pin, confirmPin, isSettingPin, isConfirming, hasBiometric]
  );

  const currentPin = isConfirming ? confirmPin : pin;

  const getTitle = () => {
    if (isSettingPin) {
      return isConfirming ? "Confirme seu PIN" : "Criar PIN de Acesso";
    }
    return "Digite seu PIN";
  };

  const getSubtitle = () => {
    if (isSettingPin) {
      return isConfirming
        ? "Digite o PIN novamente para confirmar"
        : "Escolha um PIN de 4 dígitos para proteger seu app";
    }
    return "Insira seu PIN para acessar o HealthFit";
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-between p-6">
        {/* Top Section */}
        <View className="items-center mt-16">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <IconSymbol
              name={isSettingPin ? "lock.fill" : "person.fill"}
              size={40}
              color={colors.primary}
            />
          </View>

          <Text className="text-foreground text-2xl font-bold mb-2">{getTitle()}</Text>
          <Text className="text-muted text-center text-base mb-8">{getSubtitle()}</Text>

          {/* PIN Dots */}
          <View className="flex-row gap-4 mb-4">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <View
                key={i}
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: i < currentPin.length ? colors.primary : colors.border,
                  transform: [{ scale: i < currentPin.length ? 1.2 : 1 }],
                }}
              />
            ))}
          </View>

          {error ? (
            <Text className="text-error text-sm mt-2">{error}</Text>
          ) : null}
        </View>

        {/* Keypad */}
        <View className="items-center pb-8">
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            [hasBiometric && !isSettingPin ? "biometric" : "", "0", "delete"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-6 mb-4">
              {row.map((digit, colIndex) => {
                if (digit === "") {
                  return <View key={colIndex} style={{ width: 72, height: 72 }} />;
                }

                if (digit === "biometric") {
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      className="w-[72px] h-[72px] rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                      activeOpacity={0.7}
                      onPress={() => handleKeyPress("biometric")}
                    >
                      <IconSymbol name="faceid" size={28} color={colors.primary} />
                    </TouchableOpacity>
                  );
                }

                if (digit === "delete") {
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      className="w-[72px] h-[72px] rounded-full items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => handleKeyPress("delete")}
                    >
                      <IconSymbol name="delete.left.fill" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={colIndex}
                    className="w-[72px] h-[72px] rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                    activeOpacity={0.7}
                    onPress={() => handleKeyPress(digit)}
                  >
                    <Text className="text-foreground text-2xl font-semibold">{digit}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
