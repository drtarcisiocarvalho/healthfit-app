# Guia de Teste Mobile - HealthFit

## Como Testar no Dispositivo Móvel

### Pré-requisitos
1. Instale o **Expo Go** no seu dispositivo:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Certifique-se de que seu dispositivo está na **mesma rede WiFi** que o servidor de desenvolvimento

### Método 1: Escanear QR Code (Recomendado)

1. O QR Code foi gerado em: `/home/ubuntu/health_fitness_app/expo-qr-code.png`
2. Abra o Expo Go no seu dispositivo
3. Toque em "Scan QR Code"
4. Escaneie o QR Code
5. O app será carregado automaticamente

### Método 2: URL Manual

1. Abra o Expo Go
2. Toque em "Enter URL manually"
3. Digite: `exps://8081-ishgid2gyu7rto10s24r2-7fcc9124.us2.manus.computer`
4. Pressione "Connect"

### Método 3: Preview Web no Mobile

Se o Expo Go não funcionar, você pode testar a versão web no navegador do celular:

1. Abra o navegador do seu celular
2. Acesse: `https://8081-ishgid2gyu7rto10s24r2-7fcc9124.us2.manus.computer`
3. A versão web responsiva será carregada

## Troubleshooting

### QR Code não funciona
- **Solução**: Use o Método 2 (URL Manual)
- **Causa**: Problemas de rede ou firewall

### "Unable to connect to server"
- **Solução 1**: Verifique se está na mesma rede WiFi
- **Solução 2**: Desative VPN no celular
- **Solução 3**: Use o Método 3 (Preview Web)

### Tela branca após carregar
- **Solução 1**: Force fechar o Expo Go e abrir novamente
- **Solução 2**: Limpar cache: Configurações > Apps > Expo Go > Limpar dados
- **Solução 3**: Reinstalar o Expo Go

### App carrega mas trava
- **Solução**: Verifique os logs no terminal do servidor
- **Causa**: Erro de JavaScript ou problema de compatibilidade

## Funcionalidades para Testar

### Módulo de Treinos
- [ ] Criar novo treino
- [ ] Iniciar treino com GPS
- [ ] Pausar e retomar treino
- [ ] Finalizar e salvar treino
- [ ] Ver histórico de treinos

### Módulo de Saúde
- [ ] Registrar sinais vitais
- [ ] Criar Avatar 3D
- [ ] Ver insights com IA
- [ ] Acessar bioimpedância

### Módulo de Sono
- [ ] Registrar sono manual
- [ ] Ver análise de qualidade
- [ ] Receber recomendações

### Módulo de Nutrição
- [ ] Registrar refeição
- [ ] Fotografar prato com IA
- [ ] Ver cálculo de macros
- [ ] Acompanhar diário alimentar

### Gamificação
- [ ] Ver XP e nível
- [ ] Desbloquear badges
- [ ] Participar de desafios
- [ ] Ver leaderboard

### Notificações
- [ ] Configurar lembretes
- [ ] Receber notificações push
- [ ] Interagir com notificações

### Marketplace
- [ ] Buscar profissionais
- [ ] Ver perfis
- [ ] Agendar consulta
- [ ] Avaliar profissional

## Notas Importantes

- O app funciona 100% offline após o primeiro carregamento
- Dados são salvos localmente no dispositivo
- Sincronização com backend acontece automaticamente quando online
- GPS real funciona apenas em dispositivos físicos (não em emulador)
- Notificações push requerem permissões do sistema

## Suporte

Se encontrar bugs ou problemas:
1. Anote a tela onde ocorreu
2. Descreva os passos para reproduzir
3. Tire screenshots se possível
4. Verifique os logs no terminal do servidor
