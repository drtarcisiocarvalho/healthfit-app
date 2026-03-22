# Integração Apple Watch - HealthFit

## Visão Geral

Este documento descreve a arquitetura e implementação da integração entre o aplicativo HealthFit iOS e o companion app para Apple Watch.

## Arquitetura

### Comunicação Watch-iPhone

A comunicação entre o Watch e o iPhone utiliza o framework **WatchConnectivity** da Apple, que permite:

- **Transferência de dados em tempo real** durante treinos ativos
- **Sincronização em background** de métricas históricas
- **Mensagens instantâneas** para comandos de controle
- **Compartilhamento de contexto** do aplicativo

### Fluxo de Dados

```
Apple Watch App (watchOS)
    ↓ WatchConnectivity
iPhone App (React Native + Native Module)
    ↓ AsyncStorage / API
Backend Server
```

## Funcionalidades do Watch App

### 1. Tela de Treino Ativo

**Métricas exibidas:**
- Frequência cardíaca (BPM) - atualização a cada 1s
- Calorias queimadas - cálculo em tempo real
- Distância percorrida (km) - via GPS do Watch
- Tempo decorrido - cronômetro
- Ritmo atual (min/km) - para corridas

**Controles:**
- Botão Pausar/Retomar
- Botão Finalizar Treino
- Botão de Bloqueio de Tela

### 2. Complicações

**Modular:**
- Calorias do dia
- Último treino

**Circular:**
- Streak de dias consecutivos

**Gráfica:**
- Progresso de meta semanal

### 3. Notificações

- Lembrete de treino (configurável)
- Meta diária alcançada
- Conquista desbloqueada
- Check-in semanal disponível

## Implementação Técnica

### Passo 1: Criar Native Module (iOS)

Arquivo: `ios/HealthFitWatch/WatchConnectivityManager.swift`

```swift
import WatchConnectivity
import React

@objc(WatchConnectivityManager)
class WatchConnectivityManager: RCTEventEmitter, WCSessionDelegate {
  
  override init() {
    super.init()
    if WCSession.isSupported() {
      let session = WCSession.default
      session.delegate = self
      session.activate()
    }
  }
  
  // Enviar dados de treino para o Watch
  @objc func sendWorkoutData(_ data: NSDictionary) {
    guard WCSession.default.isReachable else { return }
    
    let message = data as! [String: Any]
    WCSession.default.sendMessage(message, replyHandler: nil) { error in
      print("Error sending message: \\(error.localizedDescription)")
    }
  }
  
  // Receber dados do Watch
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    // Enviar evento para React Native
    sendEvent(withName: "WatchMessage", body: message)
  }
  
  // Eventos suportados
  override func supportedEvents() -> [String]! {
    return ["WatchMessage", "WatchStateChanged"]
  }
  
  // Métodos do WCSessionDelegate
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if let error = error {
      print("WCSession activation failed: \\(error.localizedDescription)")
    }
  }
  
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) {}
}
```

### Passo 2: Bridge React Native

Arquivo: `ios/HealthFitWatch/WatchConnectivityManager.m`

```objc
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(WatchConnectivityManager, RCTEventEmitter)

RCT_EXTERN_METHOD(sendWorkoutData:(NSDictionary *)data)

@end
```

### Passo 3: Usar no React Native

Arquivo: `lib/watch-connectivity.ts`

```typescript
import { NativeModules, NativeEventEmitter } from 'react-native';

const { WatchConnectivityManager } = NativeModules;
const watchEmitter = new NativeEventEmitter(WatchConnectivityManager);

export interface WorkoutData {
  heartRate: number;
  calories: number;
  distance: number;
  duration: number;
  pace?: number;
}

export const WatchConnectivity = {
  // Enviar dados de treino para o Watch
  sendWorkoutData: (data: WorkoutData) => {
    if (WatchConnectivityManager) {
      WatchConnectivityManager.sendWorkoutData(data);
    }
  },

  // Ouvir mensagens do Watch
  addListener: (callback: (data: any) => void) => {
    return watchEmitter.addListener('WatchMessage', callback);
  },

  // Remover listener
  removeListener: (subscription: any) => {
    subscription.remove();
  },
};
```

### Passo 4: Integrar no Componente de Treino

```typescript
import { WatchConnectivity } from '@/lib/watch-connectivity';

// Durante treino ativo
useEffect(() => {
  if (isWorkoutActive) {
    const interval = setInterval(() => {
      WatchConnectivity.sendWorkoutData({
        heartRate: currentHeartRate,
        calories: totalCalories,
        distance: totalDistance,
        duration: elapsedTime,
        pace: currentPace,
      });
    }, 1000); // Atualizar a cada 1 segundo

    return () => clearInterval(interval);
  }
}, [isWorkoutActive, currentHeartRate, totalCalories, totalDistance, elapsedTime]);

// Receber comandos do Watch
useEffect(() => {
  const subscription = WatchConnectivity.addListener((message) => {
    if (message.action === 'pause') {
      pauseWorkout();
    } else if (message.action === 'resume') {
      resumeWorkout();
    } else if (message.action === 'finish') {
      finishWorkout();
    }
  });

  return () => WatchConnectivity.removeListener(subscription);
}, []);
```

## Watch App (watchOS)

### Estrutura do Projeto

```
HealthFitWatch/
  ├── HealthFitWatch Watch App/
  │   ├── ContentView.swift          # Tela principal
  │   ├── WorkoutView.swift          # Tela de treino
  │   ├── WorkoutManager.swift       # Gerenciador de treino
  │   └── ConnectivityManager.swift  # Comunicação com iPhone
  └── HealthFitWatch Watch App Extension/
      └── Complications/
          └── ComplicationController.swift
```

### Exemplo: WorkoutView.swift

```swift
import SwiftUI
import HealthKit

struct WorkoutView: View {
    @StateObject var workoutManager = WorkoutManager()
    
    var body: some View {
        VStack(spacing: 20) {
            // Heart Rate
            VStack {
                Text("\\(workoutManager.heartRate)")
                    .font(.system(size: 48, weight: .bold))
                Text("BPM")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            // Calories & Distance
            HStack(spacing: 30) {
                VStack {
                    Text("\\(workoutManager.calories)")
                        .font(.title2)
                    Text("kcal")
                        .font(.caption)
                }
                
                VStack {
                    Text(String(format: "%.2f", workoutManager.distance))
                        .font(.title2)
                    Text("km")
                        .font(.caption)
                }
            }
            
            // Time
            Text(workoutManager.formattedElapsedTime)
                .font(.title3)
            
            // Controls
            HStack(spacing: 20) {
                Button(action: { workoutManager.togglePause() }) {
                    Image(systemName: workoutManager.isPaused ? "play.fill" : "pause.fill")
                        .font(.title2)
                }
                
                Button(action: { workoutManager.endWorkout() }) {
                    Image(systemName: "stop.fill")
                        .font(.title2)
                        .foregroundColor(.red)
                }
            }
        }
        .padding()
        .onAppear {
            workoutManager.startWorkout()
        }
    }
}
```

## Requisitos

### Permissões necessárias (Info.plist)

```xml
<key>NSHealthShareUsageDescription</key>
<string>HealthFit precisa acessar seus dados de saúde para rastrear treinos</string>
<key>NSHealthUpdateUsageDescription</key>
<string>HealthFit precisa salvar seus treinos no Apple Health</string>
```

### Capabilities

- **HealthKit** - Acesso aos dados de saúde
- **Background Modes** - Workout Processing
- **WatchConnectivity** - Comunicação com Watch

## Limitações do Expo

⚠️ **Importante:** O Expo não suporta nativamente o desenvolvimento de apps watchOS. Para implementar esta funcionalidade, é necessário:

1. Ejetar do Expo (`npx expo prebuild`)
2. Adicionar target watchOS no Xcode
3. Implementar código nativo Swift/SwiftUI
4. Configurar WatchConnectivity manualmente

## Alternativa: React Native Watch Connectivity

Biblioteca de terceiros que facilita a integração:

```bash
npm install react-native-watch-connectivity
```

Documentação: https://github.com/mtford90/react-native-watch-connectivity

## Próximos Passos

1. ✅ Documentação criada
2. ⏳ Ejetar do Expo (se necessário)
3. ⏳ Criar Watch App target no Xcode
4. ⏳ Implementar Native Module
5. ⏳ Desenvolver interface watchOS
6. ⏳ Testar em dispositivo físico (Watch Simulator tem limitações)

## Recursos

- [WatchConnectivity Framework](https://developer.apple.com/documentation/watchconnectivity)
- [HealthKit Framework](https://developer.apple.com/documentation/healthkit)
- [watchOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/watchos)
