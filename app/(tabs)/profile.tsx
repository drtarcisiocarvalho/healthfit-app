import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ProfileScreen() {
  const colors = useColors();

  const menuItems = [
    { icon: "person.fill", title: "Informações Pessoais", color: colors.primary, action: () => router.push("/personal-info" as any) },
    { icon: "sparkles", title: "Insights e Análises", color: colors.health, action: () => router.push("/insights") },
    { icon: "trophy.fill", title: "Metas e Conquistas", color: colors.health, action: () => router.push("/goals") },
    { icon: "flag.fill", title: "Desafios Comunitários", color: colors.health, action: () => router.push("/challenges") },
    { icon: "list.bullet", title: "Planos de Treino", color: colors.health, action: () => router.push("/workout-plans") },
    { icon: "fork.knife", title: "Nutrição", color: colors.health, action: () => router.push("/nutrition") },
    { icon: "camera.viewfinder", title: "Reconhecimento IA", color: colors.health, action: () => router.push("/ai-exercise-recognition") },
    { icon: "applewatch", title: "Wearables", color: colors.health, action: () => router.push("/wearables") },
    { icon: "sparkles", title: "Recomendações ML", color: colors.health, action: () => router.push("/recommendations") },
    { icon: "person.2.fill", title: "Comunidade", color: colors.health, action: () => router.push("/community") },
    { icon: "video.fill", title: "Análise de Vídeo", color: colors.health, action: () => router.push("/video-analysis") },
    { icon: "person.badge.clock.fill", title: "Coaching Virtual", color: colors.health, action: () => router.push("/coaching-program") },
    { icon: "cart.fill", title: "Marketplace", color: colors.health, action: () => router.push("/marketplace") },
    { icon: "crown.fill", title: "Assinaturas", color: colors.warning, action: () => router.push("/subscription") },
    { icon: "trophy.fill", title: "Conquistas", color: colors.warning, action: () => router.push("/achievements") },
    { icon: "paintbrush.fill", title: "Tema e Aparência", color: colors.primary, action: () => router.push("/theme-settings") },
    { icon: "icloud.fill", title: "Backup e Restauração", color: colors.health, action: () => router.push("/backup") },
    { icon: "gift.fill", title: "Indicar Amigos", color: colors.warning, action: () => router.push("/referral") },
    { icon: "link.circle.fill", title: "Integrações de Apps", color: colors.primary, action: () => router.push("/app-integrations") },
    { icon: "doc.text.fill", title: "Relatórios PDF", color: colors.health, action: () => router.push("/reports") },
    { icon: "square.and.arrow.up.fill", title: "Compartilhar Conquista", color: colors.health, action: () => router.push("/share-achievement") },
    { icon: "arrow.triangle.2.circlepath", title: "Sincronização", color: colors.health, action: () => router.push("/sync-status") },
    { icon: "video.fill", title: "Telemedicina", color: colors.medical, action: () => router.push("/telemedicine") },
    { icon: "heart.fill", title: "Apple Health", color: colors.health, action: () => router.push("/health-sync") },
    { icon: "antenna.radiowaves.left.and.right", title: "Dispositivos Bluetooth", color: colors.health, action: () => router.push("/bluetooth-devices") },
    { icon: "bell.fill", title: "Notificações", color: colors.health, action: () => router.push("/notifications-settings") },
    { icon: "square.and.arrow.up", title: "Exportar Dados", color: colors.medical, action: () => router.push("/export-data") },
    { icon: "gear", title: "Configurações", color: colors.muted, action: () => router.push("/settings" as any) },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-3xl font-bold mb-6">Perfil</Text>

        {/* Card de Perfil */}
        <View className="bg-surface rounded-2xl p-6 mb-6 border border-border items-center">
          <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-4">
            <IconSymbol name="person.fill" size={48} color={colors.primary} />
          </View>
          <Text className="text-foreground text-2xl font-bold mb-1">Usuário</Text>
          <Text className="text-muted text-sm">Membro desde 2026</Text>
        </View>

        {/* Estatísticas Rápidas */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <Text className="text-foreground text-2xl font-bold mb-1">0</Text>
            <Text className="text-muted text-xs">Treinos</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <Text className="text-foreground text-2xl font-bold mb-1">0</Text>
            <Text className="text-muted text-xs">Dias Ativos</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <Text className="text-foreground text-2xl font-bold mb-1">0</Text>
            <Text className="text-muted text-xs">Conquistas</Text>
          </View>
        </View>

        {/* Menu */}
        <View className="gap-3">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
              activeOpacity={0.7}
              onPress={item.action}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: item.color + "33" }}>
                  <IconSymbol name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="text-foreground text-base font-medium">{item.title}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Versão */}
        <Text className="text-muted text-center text-xs mt-8 mb-4">
          HealthFit v1.0.0
        </Text>

        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
