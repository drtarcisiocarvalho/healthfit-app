# Guia: Criar Build EAS Preview para Android

Este guia mostra como criar sua primeira build de teste do HealthFit usando EAS Build.

## Pré-requisitos

### 1. Instalar EAS CLI Globalmente

```bash
npm install -g eas-cli
```

### 2. Login no Expo

```bash
eas login
```

Use suas credenciais da conta Expo. Se não tiver uma conta, crie em https://expo.dev/signup

### 3. Configurar Projeto EAS

```bash
cd /home/ubuntu/health_fitness_app
eas build:configure
```

Este comando irá:
- Criar/atualizar `eas.json` com configurações de build
- Vincular o projeto à sua conta Expo

## Criar Build Preview (APK de Teste)

### Android APK

```bash
eas build --platform android --profile preview
```

**O que acontece:**
1. Código é enviado para servidores Expo
2. Build é compilado na nuvem (leva ~10-15 minutos)
3. APK é gerado e disponibilizado para download

**Após a build:**
- Link de download aparecerá no terminal
- Também disponível em: https://expo.dev/accounts/[seu-usuario]/projects/health_fitness_app/builds
- Baixe o APK e instale no seu dispositivo Android

### iOS Simulator (apenas para Mac)

```bash
eas build --platform ios --profile preview
```

Gera um arquivo `.app` que pode ser instalado no simulador iOS.

## Instalar APK no Dispositivo

### Método 1: Download Direto

1. Acesse o link de download no seu dispositivo Android
2. Baixe o APK
3. Ative "Instalar apps desconhecidos" nas configurações
4. Instale o APK

### Método 2: ADB (via computador)

```bash
# Conectar dispositivo via USB
adb devices

# Instalar APK
adb install caminho/para/healthfit.apk
```

## Perfis de Build Disponíveis

### `development`
- Build de desenvolvimento com DevClient
- Permite hot reload e debugging
- **Comando:** `eas build --platform android --profile development`

### `preview`
- Build de teste para distribuição interna
- Gera APK (Android) ou .app (iOS simulator)
- **Comando:** `eas build --platform android --profile preview`

### `production`
- Build de produção para lojas (Google Play / App Store)
- Gera AAB (Android) ou IPA (iOS)
- **Comando:** `eas build --platform android --profile production`

## Configuração do eas.json

```json
{
  "cli": {
    "version": ">= 13.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

## Troubleshooting

### Erro: "Project not configured"

```bash
eas build:configure
```

### Erro: "Not logged in"

```bash
eas login
```

### Build falha com erro de memória

Aumente `resourceClass` em `eas.json`:

```json
{
  "android": {
    "resourceClass": "m-large"
  }
}
```

### Erro de certificado/keystore

EAS gerencia certificados automaticamente. Na primeira build, será perguntado:

```
? Would you like us to handle the creation of a keystore for you? (Y/n)
```

Responda **Y** (sim).

## Monitorar Build

### Via Terminal

O progresso aparece no terminal após executar o comando.

### Via Dashboard Web

1. Acesse https://expo.dev
2. Login na sua conta
3. Vá em Projects → health_fitness_app → Builds
4. Veja status, logs e download

## Testar Build no Dispositivo

### Checklist de Testes

- [ ] App abre sem crashes
- [ ] Navegação entre tabs funciona
- [ ] Câmera funciona (Scanner de alimentos, Análise de refeição por foto)
- [ ] GPS funciona (Rastreamento de corrida)
- [ ] Notificações funcionam
- [ ] AsyncStorage persiste dados após fechar app
- [ ] Modo offline funciona (desconectar WiFi/dados)
- [ ] Sincronização funciona ao reconectar

## Distribuir para Testadores

### Método 1: Link Direto

Compartilhe o link de download da build:
```
https://expo.dev/accounts/[usuario]/projects/health_fitness_app/builds/[build-id]
```

### Método 2: Internal Distribution (EAS)

```bash
eas build --platform android --profile preview --auto-submit
```

Testadores podem instalar via Expo Go ou TestFlight.

## Próximos Passos

1. **Testar build preview** - Validar todas funcionalidades em dispositivo real
2. **Coletar feedback** - Compartilhar com beta testers
3. **Corrigir bugs** - Iterar baseado em feedback
4. **Build de produção** - Quando estiver pronto para lojas:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

## Recursos Adicionais

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Perfis de Build](https://docs.expo.dev/build/eas-json/)
- [Internal Distribution](https://docs.expo.dev/build/internal-distribution/)
- [Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

## Comandos Úteis

```bash
# Ver histórico de builds
eas build:list

# Ver detalhes de uma build específica
eas build:view [build-id]

# Cancelar build em andamento
eas build:cancel

# Limpar cache de build
eas build:clean --platform android

# Ver configuração atual
eas build:inspect --platform android --profile preview
```

## Custos

- **Conta Free**: 30 builds/mês
- **Conta Hobby**: Ilimitadas builds
- **Tempo médio**: 10-15 minutos por build

Mais informações: https://expo.dev/pricing
