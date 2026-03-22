import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ecommerceService, type Product } from "@/lib/ecommerce";

/**
 * Home Screen - NativeWind Example
 *
 * This template uses NativeWind (Tailwind CSS for React Native).
 * You can use familiar Tailwind classes directly in className props.
 *
 * Key patterns:
 * - Use `className` instead of `style` for most styling
 * - Theme colors: use tokens directly (bg-background, text-foreground, bg-primary, etc.); no dark: prefix needed
 * - Responsive: standard Tailwind breakpoints work on web
 * - Custom colors defined in tailwind.config.js
 */
interface Workout {
  id: string;
  type: string;
  date: string;
  duration: number;
  distance?: number;
  calories: number;
}

export default function HomeScreen() {
  const colors = useColors();
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const [todayStats, setTodayStats] = useState({ calories: 0, minutes: 0, workouts: 0 });
  const [streak, setStreak] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem("workouts");
      if (stored) {
        const workouts: Workout[] = JSON.parse(stored);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayWorkouts = workouts.filter(w => {
          const workoutDate = new Date(w.date);
          return workoutDate >= todayStart;
        });

        const calories = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);
        const minutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
        
        setTodayStats({ calories, minutes, workouts: todayWorkouts.length });
        
        // Calcular streak
        const sortedWorkouts = workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let currentStreak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        
        for (const workout of sortedWorkouts) {
          const workoutDate = new Date(workout.date);
          workoutDate.setHours(0, 0, 0, 0);
          
          if (workoutDate.getTime() === checkDate.getTime()) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (workoutDate.getTime() < checkDate.getTime()) {
            break;
          }
        }
        
        setStreak(currentStreak);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
      loadFeaturedProducts();
    }, [])
  );

  const loadFeaturedProducts = async () => {
    const products = await ecommerceService.getFeaturedProducts(6);
    setFeaturedProducts(products);
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-muted text-sm mb-1">{today}</Text>
          <Text className="text-foreground text-3xl font-bold">Bem-vindo ao HealthFit</Text>
        </View>

        {/* Card de Resumo Diário */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <Text className="text-foreground text-xl font-semibold mb-4">Resumo de Hoje</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <IconSymbol name="flame.fill" size={24} color={colors.primary} />
              <Text className="text-foreground text-2xl font-bold mt-2">{todayStats.calories}</Text>
              <Text className="text-muted text-xs">kcal</Text>
            </View>
            <View className="items-center">
              <IconSymbol name="clock.fill" size={24} color={colors.health} />
              <Text className="text-foreground text-2xl font-bold mt-2">{todayStats.minutes}</Text>
              <Text className="text-muted text-xs">min</Text>
            </View>
            <View className="items-center">
              <IconSymbol name="figure.run" size={24} color={colors.medical} />
              <Text className="text-foreground text-2xl font-bold mt-2">{todayStats.workouts}</Text>
              <Text className="text-muted text-xs">treinos</Text>
            </View>
          </View>
        </View>

        {/* Streak */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-foreground text-lg font-semibold mb-1">Sequência de Dias</Text>
              <Text className="text-muted text-sm">Continue treinando!</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <IconSymbol name="flame.fill" size={32} color={colors.warning} />
              <Text className="text-foreground text-3xl font-bold">{streak}</Text>
            </View>
          </View>
        </View>

        {/* Ações Rápidas */}
        <Text className="text-foreground text-xl font-semibold mb-3">Áções Rápidas</Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: colors.primary + "33" }}>
              <IconSymbol name="plus" size={24} color={colors.primary} />
            </View>
            <Text className="text-foreground text-sm font-medium">Novo Treino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: colors.health + "33" }}>
              <IconSymbol name="heart.fill" size={24} color={colors.health} />
            </View>
            <Text className="text-foreground text-sm font-medium">Medir Sinais</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
            activeOpacity={0.7}
            onPress={() => router.push("/tutorial" as any)}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: colors.warning + "33" }}>
              <Text style={{ fontSize: 24 }}>🎓</Text>
            </View>
            <Text className="text-foreground text-sm font-medium">Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* Vitrine Wellness */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-xl font-semibold">Loja Wellness</Text>
            <TouchableOpacity onPress={() => router.push("/store")} activeOpacity={0.7}>
              <Text className="text-primary text-sm font-medium">Ver tudo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="mr-3 w-40"
                activeOpacity={0.7}
                onPress={() => router.push(`/product-detail?id=${product.id}` as any)}
              >
                <View className="bg-surface rounded-xl overflow-hidden border border-border">
                  <Image source={{ uri: product.image }} className="w-full h-40" resizeMode="cover" />
                  {product.discount && (
                    <View className="absolute top-2 right-2 bg-error px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">-{product.discount}%</Text>
                    </View>
                  )}
                  <View className="p-3">
                    <Text className="text-muted text-xs mb-1">{product.brand}</Text>
                    <Text className="text-foreground text-sm font-medium mb-2" numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View>
                        {product.originalPrice && (
                          <Text className="text-muted text-xs line-through">R$ {product.originalPrice.toFixed(2)}</Text>
                        )}
                        <Text className="text-primary text-lg font-bold">R$ {product.price.toFixed(2)}</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <IconSymbol name="star.fill" size={12} color={colors.warning} />
                        <Text className="text-muted text-xs">{product.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Conquistas */}
        <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">Conquistas</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </View>
          <Text className="text-muted text-sm">Complete treinos para desbloquear conquistas</Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* FAB - Assistente Virtual */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.sleep }}
        activeOpacity={0.8}
        onPress={() => router.push("/assistant")}
      >
        <IconSymbol name="sparkles" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
