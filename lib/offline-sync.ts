import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { trpc } from "./trpc";

interface PendingSync {
  id: string;
  type: "workout" | "vitalSign" | "bodyComposition" | "sleep" | "meal" | "avatar3D";
  data: any;
  timestamp: number;
  synced: boolean;
}

const PENDING_SYNC_KEY = "pendingSyncQueue";
const LAST_SYNC_KEY = "lastSyncTimestamp";

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private syncInProgress = false;
  private listeners: ((status: string) => void)[] = [];

  private constructor() {
    this.setupNetworkListener();
  }

  static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected && !this.syncInProgress) {
        this.syncPendingData();
      }
    });
  }

  async addToSyncQueue(type: PendingSync["type"], data: any) {
    try {
      const queue = await this.getSyncQueue();
      const newItem: PendingSync = {
        id: `${type}_${Date.now()}_${Math.random()}`,
        type,
        data,
        timestamp: Date.now(),
        synced: false,
      };
      queue.push(newItem);
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
      
      // Notificar listeners
      this.notifyListeners(`Item adicionado à fila: ${type}`);
      
      // Tentar sincronizar imediatamente se houver conexão
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        this.syncPendingData();
      }
    } catch (error) {
      console.error("Erro ao adicionar à fila de sincronização:", error);
    }
  }

  private async getSyncQueue(): Promise<PendingSync[]> {
    try {
      const queueStr = await AsyncStorage.getItem(PENDING_SYNC_KEY);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch (error) {
      console.error("Erro ao carregar fila de sincronização:", error);
      return [];
    }
  }

  async syncPendingData(): Promise<boolean> {
    if (this.syncInProgress) {
      return false;
    }

    try {
      this.syncInProgress = true;
      this.notifyListeners("Sincronização iniciada");

      const queue = await this.getSyncQueue();
      const pendingItems = queue.filter((item) => !item.synced);

      if (pendingItems.length === 0) {
        this.notifyListeners("Nenhum item pendente");
        return true;
      }

      let syncedCount = 0;
      const updatedQueue = [...queue];

      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];
        try {
          await this.syncItem(item);
          
          // Marcar como sincronizado
          const index = updatedQueue.findIndex((q) => q.id === item.id);
          if (index !== -1) {
            updatedQueue[index].synced = true;
          }
          syncedCount++;
          
          this.notifyListeners(`Sincronizado ${syncedCount}/${pendingItems.length}`);
        } catch (error) {
          console.error(`Erro ao sincronizar item ${item.id}:`, error);
        }
      }

      // Remover itens sincronizados (manter apenas os últimos 100)
      const cleanedQueue = updatedQueue
        .filter((item) => !item.synced)
        .slice(-100);
      
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(cleanedQueue));
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());

      this.notifyListeners(`Sincronização concluída: ${syncedCount} itens`);
      return true;
    } catch (error) {
      console.error("Erro na sincronização:", error);
      this.notifyListeners("Erro na sincronização");
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: PendingSync): Promise<void> {
    // Aqui você implementaria a lógica real de sincronização com o backend
    // Por enquanto, apenas simula o envio
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Item ${item.type} sincronizado:`, item.data);
        resolve();
      }, 500);
    });
  }

  async getPendingCount(): Promise<number> {
    const queue = await this.getSyncQueue();
    return queue.filter((item) => !item.synced).length;
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? new Date(parseInt(timestamp)) : null;
    } catch (error) {
      return null;
    }
  }

  addListener(callback: (status: string) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (status: string) => void) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  private notifyListeners(status: string) {
    this.listeners.forEach((callback) => callback(status));
  }

  async clearSyncQueue() {
    await AsyncStorage.removeItem(PENDING_SYNC_KEY);
    this.notifyListeners("Fila de sincronização limpa");
  }
}

export const offlineSyncService = OfflineSyncService.getInstance();
