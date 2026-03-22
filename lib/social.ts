import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: number;
  totalWorkouts: number;
  totalDistance: number;
  badges: number;
  followers: number;
  following: number;
  isFollowing?: boolean;
  joinedAt: Date;
}

export enum ActivityType {
  WORKOUT = "workout",
  ACHIEVEMENT = "achievement",
  BADGE = "badge",
  LEVEL_UP = "level_up",
  CHALLENGE = "challenge",
  MILESTONE = "milestone",
}

export interface Activity {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  type: ActivityType;
  title: string;
  description: string;
  data?: any;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  activityId: string;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp: Date;
}

// Obter perfil do usuário atual
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem("userProfile");
    if (stored) {
      const profile = JSON.parse(stored);
      profile.joinedAt = new Date(profile.joinedAt);
      return profile;
    }
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
  }
  return null;
}

// Criar/atualizar perfil
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const current = await getCurrentUserProfile();
  
  const updated: UserProfile = {
    id: current?.id || Date.now().toString(),
    username: profile.username || current?.username || "user",
    displayName: profile.displayName || current?.displayName || "Usuário",
    avatar: profile.avatar || current?.avatar,
    bio: profile.bio || current?.bio,
    level: profile.level || current?.level || 1,
    totalWorkouts: profile.totalWorkouts || current?.totalWorkouts || 0,
    totalDistance: profile.totalDistance || current?.totalDistance || 0,
    badges: profile.badges || current?.badges || 0,
    followers: profile.followers || current?.followers || 0,
    following: profile.following || current?.following || 0,
    joinedAt: current?.joinedAt || new Date(),
  };
  
  await AsyncStorage.setItem("userProfile", JSON.stringify(updated));
}

// Publicar atividade
export async function postActivity(
  type: ActivityType,
  title: string,
  description: string,
  data?: any
): Promise<Activity> {
  const profile = await getCurrentUserProfile();
  
  const activity: Activity = {
    id: Date.now().toString(),
    userId: profile?.id || "user",
    username: profile?.username || "Usuário",
    avatar: profile?.avatar,
    type,
    title,
    description,
    data,
    timestamp: new Date(),
    likes: 0,
    comments: 0,
    isLiked: false,
  };
  
  // Salvar atividade
  const activities = await getAllActivities();
  activities.unshift(activity);
  await AsyncStorage.setItem("activities", JSON.stringify(activities));
  
  return activity;
}

// Obter feed de atividades
export async function getFeedActivities(limit: number = 20): Promise<Activity[]> {
  try {
    const stored = await AsyncStorage.getItem("activities");
    if (stored) {
      const activities = JSON.parse(stored);
      return activities
        .map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }))
        .slice(0, limit);
    }
  } catch (error) {
    console.error("Erro ao carregar feed:", error);
  }
  return [];
}

// Obter todas as atividades
async function getAllActivities(): Promise<Activity[]> {
  try {
    const stored = await AsyncStorage.getItem("activities");
    if (stored) {
      const activities = JSON.parse(stored);
      return activities.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar atividades:", error);
  }
  return [];
}

// Curtir atividade
export async function likeActivity(activityId: string): Promise<void> {
  const activities = await getAllActivities();
  const activity = activities.find(a => a.id === activityId);
  
  if (activity) {
    if (activity.isLiked) {
      activity.likes--;
      activity.isLiked = false;
    } else {
      activity.likes++;
      activity.isLiked = true;
    }
    
    await AsyncStorage.setItem("activities", JSON.stringify(activities));
  }
}

// Adicionar comentário
export async function addComment(activityId: string, text: string): Promise<Comment> {
  const profile = await getCurrentUserProfile();
  
  const comment: Comment = {
    id: Date.now().toString(),
    activityId,
    userId: profile?.id || "user",
    username: profile?.username || "Usuário",
    avatar: profile?.avatar,
    text,
    timestamp: new Date(),
  };
  
  // Salvar comentário
  const comments = await getActivityComments(activityId);
  comments.push(comment);
  await AsyncStorage.setItem(`comments_${activityId}`, JSON.stringify(comments));
  
  // Atualizar contador de comentários
  const activities = await getAllActivities();
  const activity = activities.find(a => a.id === activityId);
  if (activity) {
    activity.comments++;
    await AsyncStorage.setItem("activities", JSON.stringify(activities));
  }
  
  return comment;
}

// Obter comentários de uma atividade
export async function getActivityComments(activityId: string): Promise<Comment[]> {
  try {
    const stored = await AsyncStorage.getItem(`comments_${activityId}`);
    if (stored) {
      const comments = JSON.parse(stored);
      return comments.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar comentários:", error);
  }
  return [];
}

// Seguir usuário
export async function followUser(userId: string): Promise<void> {
  const following = await getFollowing();
  if (!following.includes(userId)) {
    following.push(userId);
    await AsyncStorage.setItem("following", JSON.stringify(following));
    
    // Atualizar contador
    const profile = await getCurrentUserProfile();
    if (profile) {
      profile.following++;
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    }
  }
}

// Deixar de seguir usuário
export async function unfollowUser(userId: string): Promise<void> {
  let following = await getFollowing();
  following = following.filter(id => id !== userId);
  await AsyncStorage.setItem("following", JSON.stringify(following));
  
  // Atualizar contador
  const profile = await getCurrentUserProfile();
  if (profile) {
    profile.following = Math.max(0, profile.following - 1);
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  }
}

// Obter lista de usuários seguidos
export async function getFollowing(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem("following");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar seguindo:", error);
  }
  return [];
}

// Verificar se está seguindo um usuário
export async function isFollowing(userId: string): Promise<boolean> {
  const following = await getFollowing();
  return following.includes(userId);
}

// Compartilhar conquista
export async function shareAchievement(
  type: "badge" | "level" | "workout" | "milestone",
  title: string,
  description: string,
  data?: any
): Promise<Activity> {
  let activityType: ActivityType;
  
  switch (type) {
    case "badge":
      activityType = ActivityType.BADGE;
      break;
    case "level":
      activityType = ActivityType.LEVEL_UP;
      break;
    case "workout":
      activityType = ActivityType.WORKOUT;
      break;
    case "milestone":
      activityType = ActivityType.MILESTONE;
      break;
  }
  
  return await postActivity(activityType, title, description, data);
}

// Gerar texto para compartilhamento externo
export function generateShareText(activity: Activity): string {
  let text = `🏆 ${activity.title}\n\n${activity.description}\n\n`;
  
  switch (activity.type) {
    case ActivityType.WORKOUT:
      if (activity.data) {
        text += `📊 Detalhes:\n`;
        if (activity.data.duration) text += `⏱️ Duração: ${activity.data.duration} min\n`;
        if (activity.data.distance) text += `📏 Distância: ${activity.data.distance.toFixed(2)} km\n`;
        if (activity.data.calories) text += `🔥 Calorias: ${activity.data.calories} kcal\n`;
      }
      break;
      
    case ActivityType.BADGE:
      text += `🎖️ Badge desbloqueado!\n`;
      break;
      
    case ActivityType.LEVEL_UP:
      text += `⬆️ Novo nível alcançado!\n`;
      break;
      
    case ActivityType.MILESTONE:
      text += `🎯 Marco importante conquistado!\n`;
      break;
  }
  
  text += `\n#HealthFit #Fitness #Saúde`;
  
  return text;
}

// Obter estatísticas sociais
export async function getSocialStats(): Promise<{
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
}> {
  const activities = await getAllActivities();
  
  const totalPosts = activities.length;
  const totalLikes = activities.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = activities.reduce((sum, a) => sum + a.comments, 0);
  
  const engagementRate = totalPosts > 0 
    ? ((totalLikes + totalComments) / totalPosts) 
    : 0;
  
  return {
    totalPosts,
    totalLikes,
    totalComments,
    engagementRate: Math.round(engagementRate * 10) / 10,
  };
}

// Buscar usuários (simulado - em produção seria API)
export async function searchUsers(query: string): Promise<UserProfile[]> {
  // Em produção, isso faria uma busca no backend
  // Por enquanto, retorna perfis de exemplo
  const examples: UserProfile[] = [
    {
      id: "user1",
      username: "atleta_pro",
      displayName: "João Silva",
      bio: "Corredor de maratona 🏃‍♂️",
      level: 15,
      totalWorkouts: 120,
      totalDistance: 450,
      badges: 12,
      followers: 234,
      following: 89,
      joinedAt: new Date("2025-01-01"),
    },
    {
      id: "user2",
      username: "fitness_girl",
      displayName: "Maria Santos",
      bio: "Personal trainer 💪",
      level: 20,
      totalWorkouts: 200,
      totalDistance: 300,
      badges: 18,
      followers: 567,
      following: 123,
      joinedAt: new Date("2024-12-15"),
    },
  ];
  
  return examples.filter(u => 
    u.username.toLowerCase().includes(query.toLowerCase()) ||
    u.displayName.toLowerCase().includes(query.toLowerCase())
  );
}

// Obter ranking de usuários
export async function getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
  // Em produção, isso viria do backend
  // Por enquanto, retorna dados simulados
  const users: UserProfile[] = [
    {
      id: "user1",
      username: "atleta_pro",
      displayName: "João Silva",
      level: 25,
      totalWorkouts: 300,
      totalDistance: 1200,
      badges: 20,
      followers: 500,
      following: 150,
      joinedAt: new Date("2024-01-01"),
    },
    {
      id: "user2",
      username: "fitness_girl",
      displayName: "Maria Santos",
      level: 22,
      totalWorkouts: 250,
      totalDistance: 900,
      badges: 18,
      followers: 450,
      following: 200,
      joinedAt: new Date("2024-02-15"),
    },
  ];
  
  // Ordenar por XP total (level * 1000 + totalWorkouts)
  return users
    .sort((a, b) => {
      const scoreA = a.level * 1000 + a.totalWorkouts;
      const scoreB = b.level * 1000 + b.totalWorkouts;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
