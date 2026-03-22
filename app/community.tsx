import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  type: "workout" | "achievement" | "progress";
  content: string;
  workout?: {
    type: string;
    duration: number;
    calories: number;
  };
  achievement?: {
    badge: string;
    title: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

const POSTS: Post[] = [
  {
    id: "1",
    user: {
      name: "Maria Silva",
      avatar: "👩",
      level: 12,
    },
    type: "workout",
    content: "Acabei de completar meu melhor treino da semana! 🔥",
    workout: {
      type: "Corrida",
      duration: 45,
      calories: 420,
    },
    likes: 24,
    comments: 5,
    timestamp: "Há 2 horas",
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "João Santos",
      avatar: "👨",
      level: 8,
    },
    type: "achievement",
    content: "Nova conquista desbloqueada! 30 dias consecutivos treinando 💪",
    achievement: {
      badge: "🏆",
      title: "Guerreiro dos 30 Dias",
    },
    likes: 45,
    comments: 12,
    timestamp: "Há 4 horas",
    liked: true,
  },
  {
    id: "3",
    user: {
      name: "Ana Costa",
      avatar: "👩‍🦰",
      level: 15,
    },
    type: "progress",
    content: "Perdi 5kg em 2 meses! Muito feliz com o resultado 🎉",
    likes: 67,
    comments: 18,
    timestamp: "Há 1 dia",
    liked: false,
  },
];

export default function CommunityScreen() {
  const colors = useColors();
  const [posts, setPosts] = useState(POSTS);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View className="bg-surface rounded-2xl p-5 mb-3 border border-border">
        {/* User Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.health + "20" }}
            >
              <Text className="text-2xl">{item.user.avatar}</Text>
            </View>
            <View>
              <View className="flex-row items-center gap-2">
                <Text className="text-foreground font-bold">{item.user.name}</Text>
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.warning + "20" }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.warning }}>
                    Nível {item.user.level}
                  </Text>
                </View>
              </View>
              <Text className="text-muted text-xs">{item.timestamp}</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <IconSymbol name="ellipsis" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text className="text-foreground mb-4 leading-relaxed">{item.content}</Text>

        {/* Workout Card */}
        {item.workout && (
          <View
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: colors.health + "10" }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <IconSymbol name="figure.run" size={24} color={colors.health} />
                <View>
                  <Text className="text-foreground font-bold">{item.workout.type}</Text>
                  <Text className="text-muted text-sm">{item.workout.duration} minutos</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-foreground font-bold">{item.workout.calories}</Text>
                <Text className="text-muted text-sm">kcal</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievement Card */}
        {item.achievement && (
          <View
            className="rounded-xl p-4 mb-4 items-center"
            style={{ backgroundColor: colors.warning + "10" }}
          >
            <Text className="text-5xl mb-2">{item.achievement.badge}</Text>
            <Text className="text-foreground font-bold">{item.achievement.title}</Text>
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center gap-6 pt-3 border-t border-border">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            activeOpacity={0.7}
            onPress={() => handleLike(item.id)}
          >
            <IconSymbol
              name={item.liked ? "heart.fill" : "heart"}
              size={20}
              color={item.liked ? colors.error : colors.muted}
            />
            <Text
              className="font-semibold"
              style={{ color: item.liked ? colors.error : colors.muted }}
            >
              {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2" activeOpacity={0.7}>
            <IconSymbol name="bubble.left" size={20} color={colors.muted} />
            <Text className="text-muted font-semibold">{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2" activeOpacity={0.7}>
            <IconSymbol name="paperplane" size={20} color={colors.muted} />
            <Text className="text-muted font-semibold">Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Comunidade</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <IconSymbol name="person.2.fill" size={24} color={colors.health} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 py-3 gap-3 border-b border-border">
          <TouchableOpacity
            className="flex-1 py-2 rounded-xl items-center"
            style={{ backgroundColor: colors.health + "20" }}
            activeOpacity={0.7}
          >
            <Text className="font-semibold" style={{ color: colors.health }}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2 rounded-xl items-center"
            style={{ backgroundColor: colors.surface }}
            activeOpacity={0.7}
          >
            <Text className="text-foreground font-semibold">Amigos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-2 rounded-xl items-center"
            style={{ backgroundColor: colors.surface }}
            activeOpacity={0.7}
          >
            <Text className="text-foreground font-semibold">Grupos</Text>
          </TouchableOpacity>
        </View>

        {/* Feed */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          ListHeaderComponent={
            <View className="bg-surface rounded-2xl p-5 mb-4 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.health + "20" }}
                  >
                    <Text className="text-xl">👤</Text>
                  </View>
                  <Text className="text-muted">Compartilhe seu progresso...</Text>
                </View>
                <TouchableOpacity
                  className="px-4 py-2 rounded-xl"
                  style={{ backgroundColor: colors.health }}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold">Postar</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />

        {/* FAB */}
        <View className="absolute bottom-6 right-6">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.health }}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
