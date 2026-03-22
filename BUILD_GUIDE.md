# Guia de Build e Deploy - HealthFit

Este documento descreve como criar builds de produção do HealthFit para iOS e Android.

## Pré-requisitos

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login no Expo

```bash
eas login
```

### 3. Configurar Projeto

```bash
eas build:configure
```

## Builds de Desenvolvimento

### Android (APK para testes internos)

```bash
eas build --platform android --profile development
```

### iOS (Simulador)

```bash
eas build --platform ios --profile preview
```

## Builds de Produção

### Android (AAB para Google Play)

```bash
eas build --platform android --profile production
```

**Requisitos:**
- Conta Google Play Developer ($25 taxa única)
- Service Account Key JSON configurado
- Keystore configurado (EAS gera automaticamente na primeira build)

### iOS (IPA para App Store)

```bash
eas build --platform ios --profile production
```

**Requisitos:**
- Apple Developer Account ($99/ano)
- Bundle Identifier configurado em `app.config.ts`
- Certificados e provisioning profiles (EAS gerencia automaticamente)

## Submissão para Lojas

### Google Play Store

```bash
eas submit --platform android --profile production
```

**Passos:**
1. Criar app no Google Play Console
2. Preencher informações do app (descrição, screenshots, etc.)
3. Configurar `service-account-key.json` com permissões adequadas
4. Executar comando de submit

### Apple App Store

```bash
eas submit --platform ios --profile production
```

**Passos:**
1. Criar app no App Store Connect
2. Preencher informações do app
3. Configurar `appleId`, `ascAppId` e `appleTeamId` em `eas.json`
4. Executar comando de submit

## Configurações Importantes

### app.config.ts

Certifique-se de que as seguintes configurações estão corretas:

```typescript
{
  name: "HealthFit",
  slug: "health_fitness_app",
  version: "1.0.0",
  ios: {
    bundleIdentifier: "space.manus.health.fitness.app.t...",
  },
  android: {
    package: "space.manus.health.fitness.app.t...",
  }
}
```

### Variáveis de Ambiente

Para builds de produção, configure as seguintes variáveis:

```bash
eas secret:create --scope project --name API_URL --value "https://api.healthfit.app"
eas secret:create --scope project --name SENTRY_DSN --value "your-sentry-dsn"
```

## Versionamento

### Incrementar Versão

Antes de cada build de produção:

1. Atualizar `version` em `app.config.ts`
2. Atualizar `versionCode` (Android) e `buildNumber` (iOS)

```typescript
{
  version: "1.0.1",
  android: {
    versionCode: 2
  },
  ios: {
    buildNumber: "2"
  }
}
```

## Troubleshooting

### Build falha no Android

- Verificar se `gradlew` tem permissões de execução
- Limpar cache: `eas build:clean --platform android`

### Build falha no iOS

- Verificar certificados no Apple Developer Portal
- Limpar cache: `eas build:clean --platform ios`

### Erro de memória durante build

- Aumentar `resourceClass` em `eas.json`:
  ```json
  {
    "ios": {
      "resourceClass": "m-large"
    }
  }
  ```

## Monitoramento Pós-Deploy

### Sentry (Crash Reporting)

- Acesse https://sentry.io para ver crashes em produção
- Configure alertas para erros críticos

### Firebase Analytics

- Acesse Firebase Console para ver métricas de uso
- Monitore eventos customizados implementados

## Checklist de Pré-Publicação

- [ ] Todos os testes passando (`pnpm test`)
- [ ] TypeScript sem erros (`pnpm check`)
- [ ] Versão atualizada em `app.config.ts`
- [ ] Screenshots atualizados para lojas
- [ ] Descrição e keywords otimizadas
- [ ] Política de privacidade publicada
- [ ] Termos de uso publicados
- [ ] Variáveis de ambiente configuradas
- [ ] Sentry e Firebase configurados
- [ ] Build de teste instalado e validado em dispositivo real

## Recursos Adicionais

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
