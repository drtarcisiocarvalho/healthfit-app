import { ScrollView, Text, View, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
  bio: string;
  available: boolean;
  price: string;
}

interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  availableDoctors: number;
}

const DEFAULT_SPECIALTIES: Specialty[] = [
  { id: "1", name: "Clínico Geral", icon: "heart.fill", description: "Consultas gerais e check-ups", availableDoctors: 12 },
  { id: "2", name: "Cardiologista", icon: "heart.fill", description: "Saúde cardiovascular", availableDoctors: 8 },
  { id: "3", name: "Endocrinologista", icon: "bolt.fill", description: "Hormônios e metabolismo", availableDoctors: 6 },
  { id: "4", name: "Nutricionista", icon: "leaf.fill", description: "Alimentação e nutrição", availableDoctors: 15 },
  { id: "5", name: "Educador Físico", icon: "figure.run", description: "Prescrição de exercícios", availableDoctors: 10 },
  { id: "6", name: "Psicólogo", icon: "brain", description: "Saúde mental e bem-estar", availableDoctors: 20 },
  { id: "7", name: "Fisioterapeuta", icon: "hand.raised.fill", description: "Reabilitação e movimento", availableDoctors: 9 },
  { id: "8", name: "Ortopedista", icon: "bandage.fill", description: "Ossos, articulações e músculos", availableDoctors: 7 },
  { id: "9", name: "Angiologista/Cirurgião Vascular", icon: "drop.fill", description: "Saúde vascular e circulação", availableDoctors: 5 },
  { id: "10", name: "Médico do Exercício e Esporte", icon: "figure.run", description: "Performance esportiva e prevenção de lesões", availableDoctors: 8 },
  { id: "11", name: "Nutrólogo", icon: "pills.fill", description: "Tratamento médico nutricional", availableDoctors: 6 },
  { id: "12", name: "Cirurgião Plástico", icon: "scissors", description: "Cirurgias estéticas e reparadoras", availableDoctors: 4 },
];

const SPECIALTY_NAMES = DEFAULT_SPECIALTIES.map((s) => s.name);

export default function TelemedicineScreen() {
  const colors = useColors();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    specialty: SPECIALTY_NAMES[0],
    crm: "",
    email: "",
    phone: "",
    bio: "",
    price: "",
  });

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const stored = await AsyncStorage.getItem("telemedicine_professionals");
      if (stored) setProfessionals(JSON.parse(stored));
    } catch (e) {
      console.error("Erro ao carregar profissionais:", e);
    }
  };

  const saveProfessionals = async (list: Professional[]) => {
    setProfessionals(list);
    await AsyncStorage.setItem("telemedicine_professionals", JSON.stringify(list));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.specialty.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha o nome e a especialidade do profissional.");
      return;
    }

    if (editingProfessional) {
      const updated = professionals.map((p) =>
        p.id === editingProfessional.id
          ? { ...p, ...form, available: true }
          : p
      );
      await saveProfessionals(updated);
      Alert.alert("Atualizado!", `Dr(a). ${form.name} foi atualizado(a).`);
    } else {
      const newPro: Professional = {
        id: `pro-${Date.now()}`,
        ...form,
        available: true,
      };
      await saveProfessionals([newPro, ...professionals]);
      Alert.alert("Adicionado!", `Dr(a). ${form.name} foi adicionado(a) à telemedicina.`);
    }

    resetForm();
    setShowAddModal(false);
    setEditingProfessional(null);
  };

  const handleRemove = (pro: Professional) => {
    Alert.alert(
      "Remover Profissional",
      `Tem certeza que deseja remover Dr(a). ${pro.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const updated = professionals.filter((p) => p.id !== pro.id);
            await saveProfessionals(updated);
          },
        },
      ]
    );
  };

  const handleEdit = (pro: Professional) => {
    setEditingProfessional(pro);
    setForm({
      name: pro.name,
      specialty: pro.specialty,
      crm: pro.crm,
      email: pro.email,
      phone: pro.phone,
      bio: pro.bio,
      price: pro.price,
    });
    setShowManageModal(false);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setForm({ name: "", specialty: SPECIALTY_NAMES[0], crm: "", email: "", phone: "", bio: "", price: "" });
    setEditingProfessional(null);
  };

  const getSpecialtyProfessionals = (specName: string) =>
    professionals.filter((p) => p.specialty === specName && p.available);

  const specialtiesWithCounts = DEFAULT_SPECIALTIES.map((s) => ({
    ...s,
    availableDoctors: s.availableDoctors + getSpecialtyProfessionals(s.name).length,
  }));

  const renderSpecialty = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-5 mb-3 border border-border"
      activeOpacity={0.7}
      onPress={() => setSelectedSpecialty(item.name)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: colors.medical + "33" }}>
            <IconSymbol name={item.icon as any} size={28} color={colors.medical} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-lg font-semibold mb-1">{item.name}</Text>
            <Text className="text-muted text-sm mb-2">{item.description}</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
              <Text className="text-muted text-xs">{item.availableDoctors} profissionais disponíveis</Text>
            </View>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );

  // Specialty detail view
  if (selectedSpecialty) {
    const specPros = getSpecialtyProfessionals(selectedSpecialty);
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View className="flex-1">
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <TouchableOpacity onPress={() => setSelectedSpecialty(null)} activeOpacity={0.7}>
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-xl font-bold">{selectedSpecialty}</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView className="flex-1 p-6">
            {specPros.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-muted text-base">Nenhum profissional cadastrado nesta especialidade.</Text>
              </View>
            ) : (
              specPros.map((pro) => (
                <View key={pro.id} className="bg-surface rounded-2xl p-5 mb-3 border border-border">
                  <View className="flex-row items-center gap-4">
                    <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + "20" }}>
                      <Text className="text-2xl">👨‍⚕️</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-lg font-semibold">Dr(a). {pro.name}</Text>
                      {pro.crm ? <Text className="text-muted text-sm">CRM: {pro.crm}</Text> : null}
                      {pro.bio ? <Text className="text-muted text-sm mt-1">{pro.bio}</Text> : null}
                      {pro.price ? <Text className="text-primary font-bold mt-1">R$ {pro.price}</Text> : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    className="rounded-xl p-3 items-center mt-4"
                    style={{ backgroundColor: colors.medical }}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold">Agendar Consulta</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Telemedicina</Text>
          <TouchableOpacity onPress={() => setShowManageModal(true)} activeOpacity={0.7}>
            <IconSymbol name="gearshape.fill" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View className="bg-surface rounded-2xl p-5 mb-6 border border-border">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.medical + "33" }}>
                <IconSymbol name="video.fill" size={24} color={colors.medical} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-lg font-semibold">Consultas Online</Text>
                <Text className="text-muted text-sm">Atendimento rápido e seguro</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">24/7</Text>
                <Text className="text-muted text-xs text-center">Disponível</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">15min</Text>
                <Text className="text-muted text-xs text-center">Tempo médio</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center">
                <Text className="text-foreground text-2xl font-bold mb-1">4.8</Text>
                <Text className="text-muted text-xs text-center">Avaliação</Text>
              </View>
            </View>
          </View>

          {/* Custom professionals count */}
          {professionals.length > 0 && (
            <View className="bg-primary/10 rounded-xl p-4 mb-4 flex-row items-center justify-between">
              <Text className="text-foreground font-semibold">
                {professionals.length} profissional(is) cadastrado(s)
              </Text>
              <TouchableOpacity onPress={() => setShowManageModal(true)}>
                <Text className="text-primary font-bold">Gerenciar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="text-foreground text-xl font-semibold mb-4">Escolha a Especialidade</Text>

          <FlatList
            data={specialtiesWithCounts}
            renderItem={renderSpecialty}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          <View className="h-20" />
        </ScrollView>

        {/* FAB - Add Professional */}
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.medical }}
            activeOpacity={0.8}
            onPress={() => { resetForm(); setShowAddModal(true); }}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Add/Edit Professional Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background, maxHeight: "85%" }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-foreground text-xl font-bold">
                    {editingProfessional ? "Editar Profissional" : "Adicionar Profissional"}
                  </Text>
                  <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }}>
                    <IconSymbol name="xmark" size={24} color={colors.foreground} />
                  </TouchableOpacity>
                </View>

                <Text className="text-muted text-sm mb-2">Nome Completo *</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                  placeholder="Dr(a). Nome Completo"
                  placeholderTextColor={colors.muted}
                  value={form.name}
                  onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                  style={{ color: colors.foreground }}
                />

                <Text className="text-muted text-sm mb-2">Especialidade *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {SPECIALTY_NAMES.map((spec) => (
                    <TouchableOpacity
                      key={spec}
                      className="mr-2 px-3 py-2 rounded-full"
                      style={{
                        backgroundColor: form.specialty === spec ? colors.medical : colors.surface,
                        borderWidth: 1,
                        borderColor: form.specialty === spec ? colors.medical : colors.border,
                      }}
                      onPress={() => setForm((f) => ({ ...f, specialty: spec }))}
                    >
                      <Text style={{ color: form.specialty === spec ? "#FFF" : colors.foreground, fontSize: 12 }}>
                        {spec}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text className="text-muted text-sm mb-2">CRM</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                  placeholder="Ex: 123456/SP"
                  placeholderTextColor={colors.muted}
                  value={form.crm}
                  onChangeText={(t) => setForm((f) => ({ ...f, crm: t }))}
                  style={{ color: colors.foreground }}
                />

                <Text className="text-muted text-sm mb-2">E-mail</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.muted}
                  value={form.email}
                  onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ color: colors.foreground }}
                />

                <Text className="text-muted text-sm mb-2">Telefone</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                  placeholder="(11) 99999-9999"
                  placeholderTextColor={colors.muted}
                  value={form.phone}
                  onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                  keyboardType="phone-pad"
                  style={{ color: colors.foreground }}
                />

                <Text className="text-muted text-sm mb-2">Valor da Consulta (R$)</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-4"
                  placeholder="Ex: 150.00"
                  placeholderTextColor={colors.muted}
                  value={form.price}
                  onChangeText={(t) => setForm((f) => ({ ...f, price: t }))}
                  keyboardType="numeric"
                  style={{ color: colors.foreground }}
                />

                <Text className="text-muted text-sm mb-2">Bio / Descrição</Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 border border-border mb-6"
                  placeholder="Breve descrição do profissional..."
                  placeholderTextColor={colors.muted}
                  value={form.bio}
                  onChangeText={(t) => setForm((f) => ({ ...f, bio: t }))}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{ color: colors.foreground, minHeight: 80 }}
                />

                <TouchableOpacity
                  className="rounded-xl p-4 items-center"
                  style={{ backgroundColor: colors.medical }}
                  activeOpacity={0.8}
                  onPress={handleSave}
                >
                  <Text className="text-white font-bold text-lg">
                    {editingProfessional ? "Salvar Alterações" : "Adicionar Profissional"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Manage Professionals Modal */}
        <Modal visible={showManageModal} animationType="slide" transparent>
          <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: colors.background, maxHeight: "80%" }}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-foreground text-xl font-bold">Gerenciar Profissionais</Text>
                <TouchableOpacity onPress={() => setShowManageModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              {professionals.length === 0 ? (
                <View className="items-center py-12">
                  <Text className="text-muted text-base mb-4">Nenhum profissional cadastrado ainda.</Text>
                  <TouchableOpacity
                    className="rounded-xl px-6 py-3"
                    style={{ backgroundColor: colors.medical }}
                    onPress={() => { setShowManageModal(false); resetForm(); setShowAddModal(true); }}
                  >
                    <Text className="text-white font-bold">Adicionar Primeiro</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView>
                  {professionals.map((pro) => (
                    <View key={pro.id} className="bg-surface rounded-xl p-4 mb-3 border border-border">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-foreground font-bold">Dr(a). {pro.name}</Text>
                          <Text className="text-muted text-sm">{pro.specialty}</Text>
                          {pro.crm ? <Text className="text-muted text-xs">CRM: {pro.crm}</Text> : null}
                        </View>
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: colors.primary + "20" }}
                            onPress={() => handleEdit(pro)}
                          >
                            <IconSymbol name="pencil" size={18} color={colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: colors.error + "20" }}
                            onPress={() => handleRemove(pro)}
                          >
                            <IconSymbol name="trash.fill" size={18} color={colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
