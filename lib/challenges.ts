import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "distance" | "workouts" | "calories" | "steps" | "consistency";
  goal: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  participants: ChallengeParticipant[];
  prizes: ChallengePrize[];
  status: "upcoming" | "active" | "completed";
  createdBy: string;
}

export interface ChallengeParticipant {
  userId: string;
  userName: string;
  avatar?: string;
  progress: number;
  rank: number;
  joinedAt: Date;
  lastUpdate: Date;
}

export interface ChallengePrize {
  rank: number;
  badge: string;
  title: string;
  xp: number;
}

export interface ChallengeLeaderboard {
  challengeId: string;
  participants: ChallengeParticipant[];
  myRank?: number;
  myProgress?: number;
}

// Obter desafios disponíveis
export async function getAvailableChallenges(): Promise<Challenge[]> {
  // Em produção, isso consultaria o backend
  // Por enquanto, retorna desafios simulados
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Domingo
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  return [
    {
      id: "weekly_distance",
      title: "Maratona Semanal",
      description: "Quem percorre a maior distância esta semana?",
      type: "distance",
      goal: 50,
      unit: "km",
      startDate: weekStart,
      endDate: weekEnd,
      participants: generateMockParticipants(15),
      prizes: [
        { rank: 1, badge: "🥇", title: "Campeão da Distância", xp: 500 },
        { rank: 2, badge: "🥈", title: "Vice-Campeão", xp: 300 },
        { rank: 3, badge: "🥉", title: "Terceiro Lugar", xp: 200 },
      ],
      status: "active",
      createdBy: "system",
    },
    {
      id: "weekly_workouts",
      title: "Desafio 7 Treinos",
      description: "Complete 7 treinos em 7 dias!",
      type: "workouts",
      goal: 7,
      unit: "treinos",
      startDate: weekStart,
      endDate: weekEnd,
      participants: generateMockParticipants(20),
      prizes: [
        { rank: 1, badge: "💪", title: "Guerreiro Incansável", xp: 400 },
        { rank: 2, badge: "🔥", title: "Dedicado", xp: 250 },
        { rank: 3, badge: "⭐", title: "Persistente", xp: 150 },
      ],
      status: "active",
      createdBy: "system",
    },
    {
      id: "monthly_calories",
      title: "Queima Total",
      description: "Quem queima mais calorias este mês?",
      type: "calories",
      goal: 10000,
      unit: "kcal",
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      participants: generateMockParticipants(30),
      prizes: [
        { rank: 1, badge: "🔥", title: "Forno de Calorias", xp: 800 },
        { rank: 2, badge: "💥", title: "Queimador Pro", xp: 500 },
        { rank: 3, badge: "⚡", title: "Energético", xp: 300 },
      ],
      status: "active",
      createdBy: "system",
    },
  ];
}

// Gerar participantes simulados
function generateMockParticipants(count: number): ChallengeParticipant[] {
  const names = [
    "João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Souza",
    "Juliana Lima", "Rafael Alves", "Fernanda Rocha", "Lucas Martins", "Camila Ferreira",
    "Bruno Carvalho", "Patrícia Gomes", "Diego Ribeiro", "Amanda Dias", "Felipe Barbosa",
    "Beatriz Castro", "Rodrigo Monteiro", "Larissa Araújo", "Thiago Correia", "Gabriela Pinto",
  ];
  
  const participants: ChallengeParticipant[] = [];
  
  for (let i = 0; i < Math.min(count, names.length); i++) {
    participants.push({
      userId: `user_${i + 1}`,
      userName: names[i],
      progress: Math.random() * 100,
      rank: i + 1,
      joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastUpdate: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    });
  }
  
  // Ordenar por progresso
  participants.sort((a, b) => b.progress - a.progress);
  
  // Atualizar ranks
  participants.forEach((p, i) => {
    p.rank = i + 1;
  });
  
  return participants;
}

// Participar de um desafio
export async function joinChallenge(challengeId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log(`🎯 Participando do desafio ${challengeId}...`);
    
    // Simular participação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Salvar desafios ativos
    const activeIds = await getActiveChallengeIds();
    if (!activeIds.includes(challengeId)) {
      activeIds.push(challengeId);
      await AsyncStorage.setItem("activeChallenges", JSON.stringify(activeIds));
    }
    
    console.log("✅ Participação confirmada!");
    
    return {
      success: true,
      message: "Você entrou no desafio! Boa sorte! 🎉",
    };
  } catch (error) {
    console.error("❌ Erro ao participar do desafio:", error);
    return {
      success: false,
      message: "Não foi possível entrar no desafio. Tente novamente.",
    };
  }
}

// Sair de um desafio
export async function leaveChallenge(challengeId: string): Promise<void> {
  const activeIds = await getActiveChallengeIds();
  const filtered = activeIds.filter(id => id !== challengeId);
  await AsyncStorage.setItem("activeChallenges", JSON.stringify(filtered));
  console.log(`👋 Você saiu do desafio ${challengeId}`);
}

// Obter IDs dos desafios ativos do usuário
async function getActiveChallengeIds(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem("activeChallenges");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

// Obter desafios ativos do usuário
export async function getMyActiveChallenges(): Promise<Challenge[]> {
  const activeIds = await getActiveChallengeIds();
  const allChallenges = await getAvailableChallenges();
  
  return allChallenges.filter(c => activeIds.includes(c.id) && c.status === "active");
}

// Atualizar progresso em um desafio
export async function updateChallengeProgress(
  challengeId: string,
  value: number
): Promise<void> {
  console.log(`📊 Atualizando progresso no desafio ${challengeId}: +${value}`);
  
  // Em produção, isso enviaria para o backend
  // Por enquanto, apenas salva localmente
  
  const progressKey = `challenge_progress_${challengeId}`;
  const currentStr = await AsyncStorage.getItem(progressKey);
  const current = currentStr ? parseFloat(currentStr) : 0;
  const newProgress = current + value;
  
  await AsyncStorage.setItem(progressKey, newProgress.toString());
  
  console.log(`✅ Progresso atualizado: ${newProgress}`);
}

// Obter progresso em um desafio
export async function getChallengeProgress(challengeId: string): Promise<number> {
  const progressKey = `challenge_progress_${challengeId}`;
  const stored = await AsyncStorage.getItem(progressKey);
  return stored ? parseFloat(stored) : 0;
}

// Obter leaderboard de um desafio
export async function getChallengeLeaderboard(
  challengeId: string
): Promise<ChallengeLeaderboard> {
  const challenges = await getAvailableChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    return {
      challengeId,
      participants: [],
    };
  }
  
  // Adicionar progresso do usuário atual
  const myProgress = await getChallengeProgress(challengeId);
  const myUserId = "current_user"; // Em produção, viria do contexto de autenticação
  
  // Atualizar ou adicionar usuário na lista
  let participants = [...challenge.participants];
  const myIndex = participants.findIndex(p => p.userId === myUserId);
  
  if (myIndex >= 0) {
    participants[myIndex].progress = myProgress;
    participants[myIndex].lastUpdate = new Date();
  } else {
    participants.push({
      userId: myUserId,
      userName: "Você",
      progress: myProgress,
      rank: 0,
      joinedAt: new Date(),
      lastUpdate: new Date(),
    });
  }
  
  // Reordenar por progresso
  participants.sort((a, b) => b.progress - a.progress);
  
  // Atualizar ranks
  participants.forEach((p, i) => {
    p.rank = i + 1;
  });
  
  const myRank = participants.findIndex(p => p.userId === myUserId) + 1;
  
  return {
    challengeId,
    participants,
    myRank: myRank > 0 ? myRank : undefined,
    myProgress,
  };
}

// Criar desafio personalizado
export async function createCustomChallenge(
  title: string,
  description: string,
  type: Challenge["type"],
  goal: number,
  durationDays: number,
  friendIds: string[]
): Promise<{
  success: boolean;
  challenge?: Challenge;
  message: string;
}> {
  try {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + durationDays);
    
    const challenge: Challenge = {
      id: `custom_${Date.now()}`,
      title,
      description,
      type,
      goal,
      unit: getUnitForType(type),
      startDate: now,
      endDate,
      participants: [
        {
          userId: "current_user",
          userName: "Você",
          progress: 0,
          rank: 1,
          joinedAt: now,
          lastUpdate: now,
        },
      ],
      prizes: [
        { rank: 1, badge: "🏆", title: "Vencedor", xp: 300 },
      ],
      status: "active",
      createdBy: "current_user",
    };
    
    // Salvar desafio personalizado
    const customChallenges = await getCustomChallenges();
    customChallenges.push(challenge);
    await AsyncStorage.setItem("customChallenges", JSON.stringify(customChallenges));
    
    // Adicionar aos desafios ativos
    await joinChallenge(challenge.id);
    
    console.log("✅ Desafio personalizado criado:", challenge.title);
    
    return {
      success: true,
      challenge,
      message: "Desafio criado com sucesso! Convide seus amigos!",
    };
  } catch (error) {
    console.error("❌ Erro ao criar desafio:", error);
    return {
      success: false,
      message: "Não foi possível criar o desafio. Tente novamente.",
    };
  }
}

// Obter desafios personalizados
async function getCustomChallenges(): Promise<Challenge[]> {
  try {
    const stored = await AsyncStorage.getItem("customChallenges");
    if (stored) {
      const challenges = JSON.parse(stored);
      return challenges.map((c: any) => ({
        ...c,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        participants: c.participants.map((p: any) => ({
          ...p,
          joinedAt: new Date(p.joinedAt),
          lastUpdate: new Date(p.lastUpdate),
        })),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar desafios personalizados:", error);
  }
  return [];
}

// Obter unidade para tipo de desafio
function getUnitForType(type: Challenge["type"]): string {
  switch (type) {
    case "distance":
      return "km";
    case "workouts":
      return "treinos";
    case "calories":
      return "kcal";
    case "steps":
      return "passos";
    case "consistency":
      return "dias";
    default:
      return "";
  }
}

// Verificar se ganhou prêmio
export async function checkChallengeRewards(challengeId: string): Promise<{
  hasReward: boolean;
  prize?: ChallengePrize;
  message?: string;
}> {
  const challenges = await getAvailableChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (!challenge || challenge.status !== "completed") {
    return { hasReward: false };
  }
  
  const leaderboard = await getChallengeLeaderboard(challengeId);
  
  if (!leaderboard.myRank) {
    return { hasReward: false };
  }
  
  const prize = challenge.prizes.find(p => p.rank === leaderboard.myRank);
  
  if (prize) {
    return {
      hasReward: true,
      prize,
      message: `Parabéns! Você ficou em ${leaderboard.myRank}º lugar e ganhou ${prize.xp} XP e o badge "${prize.badge} ${prize.title}"!`,
    };
  }
  
  return { hasReward: false };
}

// Obter estatísticas de desafios
export async function getChallengeStats(): Promise<{
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  totalWins: number;
  totalPodiums: number;
  totalXpEarned: number;
}> {
  const activeIds = await getActiveChallengeIds();
  
  // Em produção, isso consultaria histórico real
  // Por enquanto, retorna estatísticas simuladas
  
  return {
    totalChallenges: 12,
    activeChallenges: activeIds.length,
    completedChallenges: 9,
    totalWins: 3,
    totalPodiums: 7,
    totalXpEarned: 2400,
  };
}
