import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, Alert, FlatList } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface AppItem {
  id: string;
  type: "product" | "challenge" | "workout" | "tip";
  title: string;
  description: string;
  imageUrl: string;
  data: string;
  active: boolean;
}

const ITEM_TYPES = [
  { id: "product" as const, label: "Produtos", icon: "cart.fill" },
  { id: "challenge" as const, label: "Desafios", icon: "flag.fill" },
  { id: "workout" as const, label: "Treinos", icon: "figure.run" },
  { id: "tip" as const, label: "Dicas", icon: "lightbulb.fill" },
] as const;

export default function AdminScreen() {
  const colors = useColors();
  const [items, setItems] = useState<AppItem[]>([]);
  const [selectedType, setSelectedType] = useState<AppItem["type"]>("product");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AppItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", data: "" });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem("admin_app_items");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error("Erro ao carregar itens:", e);
    }
  };

  const saveItems = async (list: AppItem[]) => {
    setItems(list);
    await AsyncStorage.setItem("admin_app_items", JSON.stringify(list));
  };

  const filteredItems = items.filter((i) => i.type === selectedType);

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("Campo obrigatório", "Preencha o título do item.");
      return;
    }

    if (editingItem) {
      const updated = items.map((i) =>
        i.id === editingItem.id ? { ...i, ...form } : i
      );
      await saveItems(updated);
      Alert.alert("Atualizado!", `"${form.title}" foi atualizado.`);
    } else {
      const newItem: AppItem = {
        id: `item-${Date.now()}`,
        type: selectedType,
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        data: form.data,
        active: true,
      };
      await saveItems([newItem, ...items]);
      Alert.alert("Adicionado!", `"${form.title}" foi adicionado.`);
    }

    resetForm();
    setShowFormModal(false);
  };

  const handleDelete = (item: AppItem) => {
    Alert.alert("Excluir Item", `Tem certeza que deseja excluir "${item.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await saveItems(items.filter((i) => i.id !== item.id));
        },
      },
    ]);
  };

  const handleToggleActive = async (item: AppItem) => {
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, active: !i.active } : i
    );
    await saveItems(updated);
  };

  const handleEdit = (item: AppItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      data: item.data,
    });
    setShowFormModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setForm({ title: "", description: "", imageUrl: "", data: "" });
  };

  const getTypeLabel = (type: AppItem["type"]) =>
    ITEM_TYPES.find((t) => t.id === type)?.label ?? type;

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Painel Admin</Text>
          <TouchableOpacity
            onPress={() => { resetForm(); setShowFormModal(true); }}
            activeOpacity={0.7}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row px-6 py-4 gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 items-center border border-border">
            <Text className="text-foreground text-2xl font-bold">{items.length}</Text>
            <Text className="text-muted text-xs">Total Itens</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 items-center border border-border">
            <Text className="text-foreground text-2xl font-bold">{items.filter((i) => i.active).length}</Text>
            <Text className="text-muted text-xs">Ativos</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 items-center border border-border">
            <Text className="text-foreground text-2xl font-bold">{items.filter((i) => !i.active).length}</Text>
            <Text className="text-muted text-xs">Inativos</Text>
          </View>
        </View>

        {/* Type Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-4">
          {ITEM_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              className="mr-3 px-4 py-2 rounded-full flex-row items-center gap-2"
              style={{
                backgroundColor: selectedType === type.id ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: selectedType === type.id ? colors.primary : colors.border,
              }}
              activeOpacity={0.7}
              onPress={() => setSelectedType(type.id)}
            >
              <IconSymbol
                name={type.icon as any}
                size={16}
                color={selectedType === type.id ? "#FFFFFF" : colors.foreground}
              />
              <Text style={{ color: selectedType === type.id ? "#FFFFFF" : colors.foreground, fontWeight: "600" }}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items List */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 0 }}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-muted text-base mb-4">
                Nenhum(a) {getTypeLabel(selectedType).toLowerCase()} cadastrado(a).
              </Text>
              <TouchableOpacity
                className="rounded-xl px-6 py-3"
                style={{ backgroundColor: colors.primary }}
                onPress={() => { resetForm(); setShowFormModal(true); }}
              >
                <Text className="text-white font-bold">Adicionar</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View
              className="bg-surface rounded-xl p-4 mb-3 border border-border"
              style={{ opacity: item.active ? 1 : 0.5 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-foreground font-bold text-base">{item.title}</Text>
                  {item.description ? (
                    <Text className="text-muted text-sm mt-1" numberOfLines={2}>{item.description}</Text>
                  ) : null}
                  <Text className="text-muted text-xs mt-1">
                    {item.active ? "Ativo" : "Inativo"}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.warning + "20" }}
                    onPress={() => handleToggleActive(item)}
                  >
                    <IconSymbol
                      name={item.active ? "eye.fill" : "eye.slash.fill"}
                      size={18}
                      color={colors.warning}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.primary + "20" }}
                    onPress={() => handleEdit(item)}
                  >
                    <IconSymbol name="pencil" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.error + "20" }}
                    onPress={() => handleDelete(item)}
                  >
                    <IconSymbol name="trash.fill" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Form Modal */}
      <Modal visible={showFormModal} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-foreground text-xl font-bold">
                  {editingItem ? "Editar Item" : `Novo(a) ${getTypeLabel(selectedType)}`}
                </Text>
                <TouchableOpacity onPress={() => { setShowFormModal(false); resetForm(); }}>
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              <Text className="text-muted text-sm mb-2">Título *</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Nome do item"
                placeholderTextColor={colors.muted}
                value={form.title}
                onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Descrição</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="Descrição do item"
                placeholderTextColor={colors.muted}
                value={form.description}
                onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ color: colors.foreground, minHeight: 80 }}
              />

              <Text className="text-muted text-sm mb-2">URL da Imagem</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                placeholder="https://..."
                placeholderTextColor={colors.muted}
                value={form.imageUrl}
                onChangeText={(t) => setForm((f) => ({ ...f, imageUrl: t }))}
                autoCapitalize="none"
                keyboardType="url"
                style={{ color: colors.foreground }}
              />

              <Text className="text-muted text-sm mb-2">Dados Extras (JSON)</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 border border-border mb-6"
                placeholder='{"preco": 99.90, "link": "..."}'
                placeholderTextColor={colors.muted}
                value={form.data}
                onChangeText={(t) => setForm((f) => ({ ...f, data: t }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                autoCapitalize="none"
                style={{ color: colors.foreground, minHeight: 60 }}
              />

              <TouchableOpacity
                className="rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={handleSave}
              >
                <Text className="text-white font-bold text-lg">
                  {editingItem ? "Salvar Alterações" : "Adicionar"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
