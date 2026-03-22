# Guia de Troubleshooting - Expo Go Tela Branca

## Problema
O aplicativo mostra tela branca ao escanear o QR Code no Expo Go, sem nenhuma mensagem de erro.

## Causa Provável
O Expo Go não consegue se conectar ao servidor de desenvolvimento devido a:
- Restrições de rede/firewall
- Celular e computador em redes diferentes
- URL do sandbox não acessível do celular

## Soluções

### Solução 1: Usar URL Manual (RECOMENDADO)

1. **Abra o Expo Go** no seu celular
2. **Toque em "Enter URL manually"** (no Android) ou **"Connect manually"** (no iOS)
3. **Digite a URL**:
   ```
   exp://8081-ilv3ahzpfu14gfavhltoc-84785619.us2.manus.computer
   ```
4. **Pressione Connect/Conectar**

### Solução 2: Testar Preview Web no Celular

1. Abra o navegador do seu celular (Chrome/Safari)
2. Acesse: `https://8081-ilv3ahzpfu14gfavhltoc-84785619.us2.manus.computer`
3. O app funcionará no navegador móvel

### Solução 3: Build de Desenvolvimento Local

Se você tem acesso ao código localmente:

```bash
# 1. Clone ou baixe o projeto
cd health_fitness_app

# 2. Instale dependências
pnpm install

# 3. Inicie o servidor
pnpm mobile

# 4. Escaneie o QR Code que aparece no terminal
```

### Solução 4: Testar Tela Simples

Acesse diretamente a tela de teste:
```
exp://8081-ilv3ahzpfu14gfavhltoc-84785619.us2.manus.computer/test-mobile
```

## Verificações de Rede

### No Celular:
1. Certifique-se que está conectado à internet (WiFi ou dados móveis)
2. Tente acessar qualquer site para confirmar conectividade
3. Desative VPN se estiver usando

### No Computador:
1. Verifique se o servidor está rodando: `ps aux | grep expo`
2. Teste a URL no navegador do computador primeiro
3. Verifique firewall/antivírus

## Logs de Debug

Se ainda não funcionar, verifique os logs:

```bash
# Logs do Metro Bundler
tail -f /tmp/expo.log

# Logs do Backend
tail -f /tmp/backend.log
```

## Informações Técnicas

- **Servidor Metro**: Porta 8081
- **Servidor Backend**: Porta 3000  
- **URL Base**: `https://8081-ilv3ahzpfu14gfavhltoc-84785619.us2.manus.computer`
- **Protocolo Expo**: `exp://` (não HTTPS)

## Alternativa: Build de Produção

Para uso em produção (sem Expo Go):

```bash
# Android APK
eas build --platform android --profile preview

# iOS (requer conta Apple Developer)
eas build --platform ios --profile preview
```

## Suporte

Se nenhuma solução funcionar, o problema é de infraestrutura de rede. Considere:
1. Usar um computador e celular na mesma rede local
2. Configurar ngrok ou tunnel para expor o servidor
3. Fazer build de produção e instalar diretamente no celular
