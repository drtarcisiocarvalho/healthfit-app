import { ScrollView, Text, View, TouchableOpacity, Image, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ecommerceService, type Product } from "@/lib/ecommerce";

export default function StoreScreen() {
  const colors = useColors();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | Product["category"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const loadProducts = async () => {
    const allProducts = await ecommerceService.getAllProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [
    { id: "all" as const, name: "Todos", icon: "square.grid.2x2.fill" as const },
    { id: "supplements" as const, name: "Suplementos", icon: "pills.fill" as const },
    { id: "apparel" as const, name: "Vestuário", icon: "tshirt.fill" as const },
    { id: "equipment" as const, name: "Equipamentos", icon: "dumbbell.fill" as const },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-2xl font-bold">Loja Wellness</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <IconSymbol name="cart.fill" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="bg-surface rounded-xl px-4 py-3 flex-row items-center border border-border">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 ml-2 text-foreground"
              placeholder="Buscar produtos..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-4">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="mr-3 px-4 py-2 rounded-full flex-row items-center gap-2"
              style={{
                backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: selectedCategory === category.id ? colors.primary : colors.border,
              }}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? "#FFFFFF" : colors.foreground}
              />
              <Text
                className="font-medium"
                style={{ color: selectedCategory === category.id ? "#FFFFFF" : colors.foreground }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View className="px-6 pb-6">
          <Text className="text-muted text-sm mb-4">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] mb-4"
                activeOpacity={0.7}
                onPress={() => router.push(`/product-detail?id=${product.id}` as any)}
              >
                <View className="bg-surface rounded-xl overflow-hidden border border-border">
                  <Image source={{ uri: product.image }} className="w-full h-48" resizeMode="cover" />
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
                    <View className="flex-row items-center gap-1 mb-2">
                      <IconSymbol name="star.fill" size={12} color={colors.warning} />
                      <Text className="text-muted text-xs">
                        {product.rating} ({product.reviews})
                      </Text>
                    </View>
                    <View>
                      {product.originalPrice && (
                        <Text className="text-muted text-xs line-through">R$ {product.originalPrice.toFixed(2)}</Text>
                      )}
                      <Text className="text-primary text-lg font-bold">R$ {product.price.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
