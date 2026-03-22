import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum MusicProvider {
  SPOTIFY = "spotify",
  APPLE_MUSIC = "apple_music",
  NONE = "none",
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // em segundos
  bpm?: number;
  coverUrl?: string;
  uri: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  totalDuration: number;
  averageBpm?: number;
  coverUrl?: string;
}

export interface MusicSettings {
  provider: MusicProvider;
  autoPlay: boolean;
  volume: number; // 0-100
  preferredBpm?: number;
  enableBpmSync: boolean; // Sincronizar música com ritmo do treino
}

// Obter configurações de música
export async function getMusicSettings(): Promise<MusicSettings> {
  try {
    const stored = await AsyncStorage.getItem("musicSettings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar configurações de música:", error);
  }
  
  return {
    provider: MusicProvider.NONE,
    autoPlay: false,
    volume: 70,
    enableBpmSync: true,
  };
}

// Salvar configurações
export async function saveMusicSettings(settings: MusicSettings): Promise<void> {
  await AsyncStorage.setItem("musicSettings", JSON.stringify(settings));
}

// Conectar com Spotify
export async function connectSpotify(): Promise<boolean> {
  // Em produção, isso abriria OAuth do Spotify
  // Por enquanto, simula conexão bem-sucedida
  const settings = await getMusicSettings();
  settings.provider = MusicProvider.SPOTIFY;
  await saveMusicSettings(settings);
  return true;
}

// Conectar com Apple Music
export async function connectAppleMusic(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return false;
  }
  
  // Em produção, isso usaria MusicKit
  const settings = await getMusicSettings();
  settings.provider = MusicProvider.APPLE_MUSIC;
  await saveMusicSettings(settings);
  return true;
}

// Desconectar provedor
export async function disconnectMusicProvider(): Promise<void> {
  const settings = await getMusicSettings();
  settings.provider = MusicProvider.NONE;
  await saveMusicSettings(settings);
}

// Gerar playlist baseada em BPM e intensidade
export async function generateWorkoutPlaylist(
  workoutType: string,
  duration: number, // em minutos
  intensity: "low" | "medium" | "high"
): Promise<Playlist> {
  // Determinar BPM ideal baseado na intensidade
  let targetBpm: number;
  switch (intensity) {
    case "low":
      targetBpm = 100; // Caminhada, alongamento
      break;
    case "medium":
      targetBpm = 130; // Corrida leve, treino moderado
      break;
    case "high":
      targetBpm = 150; // HIIT, corrida intensa
      break;
  }
  
  // Em produção, isso consultaria API do Spotify/Apple Music
  // Por enquanto, gera playlist de exemplo
  const tracks: Track[] = [];
  const targetDuration = duration * 60; // converter para segundos
  let currentDuration = 0;
  
  // Músicas de exemplo por intensidade
  const exampleTracks = {
    low: [
      { title: "Weightless", artist: "Marconi Union", bpm: 60 },
      { title: "Clair de Lune", artist: "Debussy", bpm: 70 },
      { title: "Sunset Lover", artist: "Petit Biscuit", bpm: 85 },
      { title: "River Flows in You", artist: "Yiruma", bpm: 72 },
    ],
    medium: [
      { title: "Blinding Lights", artist: "The Weeknd", bpm: 171 },
      { title: "Levitating", artist: "Dua Lipa", bpm: 103 },
      { title: "Don't Start Now", artist: "Dua Lipa", bpm: 124 },
      { title: "Physical", artist: "Dua Lipa", bpm: 144 },
    ],
    high: [
      { title: "Till I Collapse", artist: "Eminem", bpm: 171 },
      { title: "Stronger", artist: "Kanye West", bpm: 104 },
      { title: "Eye of the Tiger", artist: "Survivor", bpm: 109 },
      { title: "Lose Yourself", artist: "Eminem", bpm: 171 },
    ],
  };
  
  const selectedTracks = exampleTracks[intensity];
  let trackIndex = 0;
  
  while (currentDuration < targetDuration) {
    const exampleTrack = selectedTracks[trackIndex % selectedTracks.length];
    const trackDuration = 180 + Math.random() * 60; // 3-4 minutos
    
    tracks.push({
      id: `track_${trackIndex}`,
      title: exampleTrack.title,
      artist: exampleTrack.artist,
      duration: trackDuration,
      bpm: exampleTrack.bpm,
      uri: `spotify:track:${trackIndex}`,
    });
    
    currentDuration += trackDuration;
    trackIndex++;
  }
  
  const playlist: Playlist = {
    id: `workout_${Date.now()}`,
    name: `Treino ${intensity === "low" ? "Leve" : intensity === "medium" ? "Moderado" : "Intenso"}`,
    description: `Playlist personalizada para ${workoutType} (${duration} min)`,
    tracks,
    totalDuration: currentDuration,
    averageBpm: targetBpm,
  };
  
  return playlist;
}

// Controle de reprodução
export class MusicPlayer {
  private currentTrack: Track | null = null;
  private isPlaying: boolean = false;
  private currentPosition: number = 0;
  private volume: number = 70;
  
  async play(track: Track): Promise<void> {
    this.currentTrack = track;
    this.isPlaying = true;
    this.currentPosition = 0;
    
    // Em produção, isso chamaria API do Spotify/Apple Music
    console.log(`▶️ Tocando: ${track.title} - ${track.artist}`);
  }
  
  async pause(): Promise<void> {
    this.isPlaying = false;
    console.log("⏸️ Música pausada");
  }
  
  async resume(): Promise<void> {
    this.isPlaying = true;
    console.log("▶️ Música retomada");
  }
  
  async stop(): Promise<void> {
    this.isPlaying = false;
    this.currentTrack = null;
    this.currentPosition = 0;
    console.log("⏹️ Música parada");
  }
  
  async next(playlist: Playlist): Promise<void> {
    if (!this.currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === this.currentTrack!.id);
    if (currentIndex < playlist.tracks.length - 1) {
      await this.play(playlist.tracks[currentIndex + 1]);
    }
  }
  
  async previous(playlist: Playlist): Promise<void> {
    if (!this.currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === this.currentTrack!.id);
    if (currentIndex > 0) {
      await this.play(playlist.tracks[currentIndex - 1]);
    }
  }
  
  async setVolume(volume: number): Promise<void> {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`🔊 Volume: ${this.volume}%`);
  }
  
  async seek(position: number): Promise<void> {
    this.currentPosition = position;
    console.log(`⏩ Posição: ${position}s`);
  }
  
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }
  
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
  
  getCurrentPosition(): number {
    return this.currentPosition;
  }
  
  getVolume(): number {
    return this.volume;
  }
}

// Instância global do player
export const musicPlayer = new MusicPlayer();

// Ajustar BPM da música baseado no ritmo do treino
export async function syncMusicWithWorkout(currentPace: number): Promise<void> {
  const settings = await getMusicSettings();
  if (!settings.enableBpmSync) return;
  
  // Calcular BPM ideal baseado no pace (min/km)
  // Pace mais rápido = BPM mais alto
  const idealBpm = Math.round(180 - (currentPace * 10));
  
  console.log(`🎵 Ajustando música para ${idealBpm} BPM (pace: ${currentPace} min/km)`);
  
  // Em produção, isso ajustaria a playlist ou velocidade da música
}

// Salvar playlist favorita
export async function saveFavoritePlaylist(playlist: Playlist): Promise<void> {
  const favorites = await getFavoritePlaylists();
  favorites.push(playlist);
  await AsyncStorage.setItem("favoritePlaylists", JSON.stringify(favorites));
}

// Obter playlists favoritas
export async function getFavoritePlaylists(): Promise<Playlist[]> {
  try {
    const stored = await AsyncStorage.getItem("favoritePlaylists");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar playlists favoritas:", error);
  }
  return [];
}

// Buscar músicas
export async function searchTracks(query: string): Promise<Track[]> {
  // Em produção, isso consultaria API do Spotify/Apple Music
  // Por enquanto, retorna resultados de exemplo
  return [
    {
      id: "1",
      title: "Exemplo 1",
      artist: "Artista 1",
      duration: 200,
      bpm: 120,
      uri: "spotify:track:1",
    },
    {
      id: "2",
      title: "Exemplo 2",
      artist: "Artista 2",
      duration: 180,
      bpm: 140,
      uri: "spotify:track:2",
    },
  ];
}

// Obter playlists recomendadas
export async function getRecommendedPlaylists(): Promise<Playlist[]> {
  // Em produção, isso consultaria API e histórico do usuário
  return [
    {
      id: "recommended_1",
      name: "Treino Matinal",
      description: "Energia para começar o dia",
      tracks: [],
      totalDuration: 1800,
      averageBpm: 130,
    },
    {
      id: "recommended_2",
      name: "Corrida Intensa",
      description: "Para treinos de alta intensidade",
      tracks: [],
      totalDuration: 2400,
      averageBpm: 150,
    },
  ];
}
