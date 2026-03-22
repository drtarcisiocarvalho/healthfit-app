import { ScrollView, Text, View, TouchableOpacity, Image, Linking } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ecommerceService, type Product } from "@/lib/ecommerce";
import * as Haptics from "expo-haptics";

export default function ProductDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const allProducts = await ecommerceService.getAllProducts();
    const found = allProducts.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      // Load related products from same category
      const related = allProducts.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4);
      setRelatedProducts(related);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Track purchase
    await ecommerceService.trackPurchase(product.id, "user-1");
    
    // Open affiliate link
    await Linking.openURL(product.affiliateUrl);
  };

  if (!product) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Carregando...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="relative">
          <Image source={{ uri: product.image }} className="w-full h-96" resizeMode="cover" />
          {product.discount && (
            <View className="absolute top-16 right-4 bg-error px-3 py-2 rounded-full">
              <Text className="text-white text-sm font-bold">-{product.discount}%</Text>
            </View>
          )}
          <TouchableOpacity
            className="absolute top-16 left-4 w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.background + "CC" }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View className="p-6">
          <Text className="text-primary text-sm font-medium mb-1">{product.brand}</Text>
          <Text className="text-foreground text-2xl font-bold mb-2">{product.name}</Text>

          {/* Rating */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="flex-row items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol
                  key={star}
                  name="star.fill"
                  size={16}
                  color={star <= Math.floor(product.rating) ? colors.warning : colors.border}
                />
              ))}
            </View>
            <Text className="text-muted text-sm">
              {product.rating} ({product.reviews} avaliações)
            </Text>
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-3 mb-6">
            {product.originalPrice && (
              <Text className="text-muted text-lg line-through">R$ {product.originalPrice.toFixed(2)}</Text>
            )}
            <Text className="text-foreground text-3xl font-bold">R$ {product.price.toFixed(2)}</Text>
          </View>

          {/* Description */}
          <Text className="text-foreground text-lg font-semibold mb-2">Descrição</Text>
          <Text className="text-muted text-base leading-6 mb-6">{product.description}</Text>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <View key={tag} className="bg-surface px-3 py-1 rounded-full border border-border">
                <Text className="text-muted text-sm capitalize">{tag}</Text>
              </View>
            ))}
          </View>

          {/* Commission Info */}
          <View className="bg-success/10 rounded-xl p-4 mb-6 border border-success/30">
            <View className="flex-row items-center gap-2 mb-1">
              <IconSymbol name="gift.fill" size={20} color={colors.success} />
              <Text className="text-success font-semibold">Ganhe Cashback!</Text>
            </View>
            <Text className="text-muted text-sm">
              Você ganha {Math.floor(product.price / 10)} pontos nesta compra
            </Text>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View className="mb-6">
              <Text className="text-foreground text-lg font-semibold mb-3">Produtos Relacionados</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                {relatedProducts.map((related) => (
                  <TouchableOpacity
                    key={related.id}
                    className="mr-3 w-32"
                    activeOpacity={0.7}
                    onPress={() => router.push(`/product-detail?id=${related.id}` as any)}
                  >
                    <View className="bg-surface rounded-xl overflow-hidden border border-border">
                      <Image source={{ uri: related.image }} className="w-full h-32" resizeMode="cover" />
                      <View className="p-2">
                        <Text className="text-foreground text-xs font-medium mb-1" numberOfLines={2}>
                          {related.name}
                        </Text>
                        <Text className="text-primary text-sm font-bold">R$ {related.price.toFixed(2)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Buy Button */}
      <View className="p-6 border-t border-border" style={{ backgroundColor: colors.background }}>
        <TouchableOpacity
          className="rounded-xl py-4 items-center"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
          onPress={handleBuyNow}
        >
          <Text className="text-white text-lg font-bold">Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
