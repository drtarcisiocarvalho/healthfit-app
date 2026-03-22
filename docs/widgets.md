# Widgets para Tela Inicial

## Visão Geral

Os widgets do HealthFit permitem que os usuários vejam informações importantes diretamente na tela inicial do dispositivo, sem precisar abrir o aplicativo.

## Tipos de Widgets

### Widget Pequeno (2x2)
**Resumo Diário**
- Calorias queimadas hoje
- Tempo de atividade
- Ícone de streak

### Widget Médio (4x2)
**Estatísticas Semanais**
- Gráfico de barras dos últimos 7 dias
- Total de treinos na semana
- Meta semanal (%)

### Widget Grande (4x4)
**Progresso Completo**
- Gráfico de evolução de peso
- Próximo treino agendado
- Conquistas recentes
- Botão de ação rápida

## Tecnologia

**Expo Widgets** (quando disponível no Expo SDK 54+)
- Atualmente, widgets nativos não são totalmente suportados no Expo
- Alternativa: usar React Native Widget Extension
- Requer configuração nativa adicional

## Implementação Futura

Para implementar widgets nativos:

1. **iOS (WidgetKit)**
```swift
// Widget nativo em Swift
struct HealthFitWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HealthFitWidget") { entry in
            HealthFitWidgetView(entry: entry)
        }
    }
}
```

2. **Android (App Widgets)**
```kotlin
// Widget nativo em Kotlin
class HealthFitWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        // Atualizar widget
    }
}
```

## Limitações Atuais

- Expo não suporta widgets nativos out-of-the-box
- Requer eject do Expo ou uso de config plugins customizados
- Dados precisam ser compartilhados entre app e widget via UserDefaults (iOS) ou SharedPreferences (Android)

## Alternativa Implementada

Por enquanto, o aplicativo oferece:
- Notificações ricas com informações do dia
- Quick Actions no ícone do app
- Tela inicial otimizada para acesso rápido
