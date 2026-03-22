import { ScrollView, Text, View, TouchableOpacity, Image, TextInput, Modal, Alert, Linking } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    category: "supplements" as Product["category"],
    affiliateUrl: "",
    description: "",
  });

  useEffect(() => {
    loadProducts();
    loadCustomProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const loadCustomProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem("customProducts");
      if (stored) {
        setCustomProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erro ao carregar produtos customizados:", e);
    }
  };

  const loadProducts = async () => {
    const allProducts = await ecommerceService.getAllProducts();
    const stored = await AsyncStorage.getItem("customProducts");
    const custom: Product[] = stored ? JSON.parse(stored) : [];
    const merged = [...custom, ...allProducts];
    setProducts(merged);
    setFilteredProducts(merged);
  };

  const saveNewProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha o nome e o preço do produto");
      return;
    }
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      brand: newProduct.brand || "HealthFit",
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      description: newProduct.description || newProduct.name,
      affiliateUrl: newProduct.affiliateUrl || "",
      commission: 10,
      rating: 5.0,
      reviews: 0,
      tags: [newProduct.category],
      inStock: true,
    };
    const updated = [product, ...customProducts];
    setCustomProducts(updated);
    await AsyncStorage.setItem("customProducts", JSON.stringify(updated));
    setProducts((prev) => [product, ...prev]);
    setNewProduct({ name: "", brand: "", price: "", category: "supplements", affiliateUrl: "", description: "" });
    setShowAddProduct(false);
    Alert.alert("Produto adicionado!", `"${product.name}" foi adicionado à loja.`);
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
            <View className="flex-row items-center gap-3">
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddProduct(true)}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <IconSymbol name="cart.fill" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
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

      {/* Add Product Modal */}
      <Modal visible={showAddProduct} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-foreground text-xl font-bold">Adicionar Produto</Text>
                <TouchableOpacity onPress={() => setShowAddProduct(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              <Text className="text-muted text-sm mb-2">Nome do Produto *</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Ex: Whey Protein Gold"
                placeholderTextColor={colors.muted}
                value={newProduct.name}
                onChangeText={(t) => setNewProduct((p) => ({ ...p, name: t }))}
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Marca</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Ex: HealthFit"
                placeholderTextColor={colors.muted}
                value={newProduct.brand}
                onChangeText={(t) => setNewProduct((p) => ({ ...p, brand: t }))}
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Preço (R$) *</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Ex: 99.90"
                placeholderTextColor={colors.muted}
                value={newProduct.price}
                onChangeText={(t) => setNewProduct((p) => ({ ...p, price: t }))}
                keyboardType="numeric"
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Categoria</Text>
              <View className="flex-row gap-2 mb-4 flex-wrap">
                {(["supplements", "apparel", "equipment"] as const).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: newProduct.category === cat ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: newProduct.category === cat ? colors.primary : colors.border,
                    }}
                    onPress={() => setNewProduct((p) => ({ ...p, category: cat }))}
                  >
                    <Text style={{ color: newProduct.category === cat ? "#FFFFFF" : colors.foreground }}>
                      {cat === "supplements" ? "Suplementos" : cat === "apparel" ? "Vestuário" : "Equipamentos"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-muted text-sm mb-2">Link de Afiliado / Compra</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="https://..."
                placeholderTextColor={colors.muted}
                value={newProduct.affiliateUrl}
                onChangeText={(t) => setNewProduct((p) => ({ ...p, affiliateUrl: t }))}
                autoCapitalize="none"
                keyboardType="url"
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Descrição</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-6"
                placeholder="Descrição do produto..."
                placeholderTextColor={colors.muted}
                value={newProduct.description}
                onChangeText={(t) => setNewProduct((p) => ({ ...p, description: t }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ color: colors.foreground, minHeight: 80 }}
              />

              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={saveNewProduct}
              >
                <Text className="text-white font-bold text-lg">Salvar Produto</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
