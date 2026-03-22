# Design de Interface - HealthFit App

## Visão Geral

O **HealthFit** é um super aplicativo de saúde e bem-estar que integra rastreamento de exercícios, análise corporal, monitoramento de sono, sinais vitais, telemedicina e assistente virtual com IA. O design segue os padrões da Apple Human Interface Guidelines (HIG) com tema escuro inspirado no Nike Run Club.

## Orientação e Uso

- **Orientação**: Retrato (9:16) exclusivamente
- **Uso**: Otimizado para uma mão
- **Plataforma**: iOS e Android com design iOS-first

## Lista de Telas

### 1. Tela de Início (Home)
**Conteúdo Principal:**
- Card de resumo diário com métricas principais (calorias, passos, tempo de atividade)
- Streak de dias consecutivos treinando
- Atalhos rápidos para iniciar treino, ver sono, medir sinais vitais
- Feed de conquistas recentes e badges
- Gráfico semanal de atividades

**Funcionalidade:**
- Navegação rápida para todas as seções
- Visualização de progresso em tempo real
- Acesso ao assistente virtual (FAB)

### 2. Tela de Treinos
**Conteúdo Principal:**
- Botão FAB destacado para "Iniciar Novo Treino"
- Lista de treinos recentes com cards (tipo, duração, calorias, distância)
- Filtros por tipo de exercício e período
- Estatísticas semanais e mensais
- Calendário heatmap de atividades

**Funcionalidade:**
- Iniciar novo treino com seleção de tipo
- Ver detalhes completos de cada treino
- Editar ou excluir treinos
- Visualizar rotas GPS em mapa
- Exportar treinos

### 3. Tela de Novo Treino
**Conteúdo Principal:**
- Seletor de tipo de exercício com ícones visuais
- Botão grande "Iniciar" com contador de tempo
- Métricas em tempo real (tempo, distância, calorias, FC)
- Mapa GPS ao vivo (para atividades outdoor)
- Controles de pausa/retomar/finalizar

**Funcionalidade:**
- Rastreamento GPS em tempo real
- Captura de frequência cardíaca (se wearable conectado)
- Música integrada
- Alertas de km/milha
- Salvar treino com notas

### 4. Tela de Detalhes do Treino
**Conteúdo Principal:**
- Resumo completo (tipo, data, duração, distância, calorias)
- Gráfico de frequência cardíaca por tempo
- Mapa do percurso com marcadores
- Zonas de FC
- Ritmo/pace médio
- Elevação (se aplicável)
- Notas pessoais

**Funcionalidade:**
- Editar informações
- Compartilhar nas redes sociais
- Exportar GPX
- Excluir treino

### 5. Tela de Saúde (Hub)
**Conteúdo Principal:**
- Card de composição corporal atual (peso, IMC, % gordura)
- Miniatura do avatar 3D
- Card de sinais vitais recentes (PA, glicemia, FC)
- Botão "Nova Medição"
- Histórico de medições
- Gráficos de evolução

**Funcionalidade:**
- Acessar análise completa de bioimpedância
- Ver avatar 3D interativo
- Registrar novos sinais vitais
- Conectar dispositivos médicos
- Visualizar tendências

### 6. Tela de Bioimpedância
**Conteúdo Principal:**
- Todas as métricas de composição corporal organizadas em cards
- Indicadores coloridos (verde/amarelo/vermelho)
- Comparação com população saudável
- Gráficos de evolução temporal
- Segmentação corporal (braços, pernas, tronco)

**Funcionalidade:**
- Conectar balança Bluetooth
- Adicionar nova medição manual
- Comparar medições
- Exportar relatório PDF
- Ver metas personalizadas

### 7. Tela de Avatar 3D
**Conteúdo Principal:**
- Avatar 3D interativo centralizado
- Controles de rotação 360°
- Medições antropométricas anotadas
- Slider de comparação temporal
- Mapa de calor de gordura corporal

**Funcionalidade:**
- Capturar novas fotos (frontal + lateral)
- Rotacionar e dar zoom
- Alternar camadas visuais (pele, músculo, gordura)
- Comparar avatares de diferentes datas
- Exportar imagens/vídeo

### 8. Tela de Captura de Fotos
**Conteúdo Principal:**
- Guias visuais de silhueta
- Preview da câmera em tela cheia
- Instruções claras de posicionamento
- Indicador de qualidade da foto
- Botões de captura e refazer

**Funcionalidade:**
- Captura foto frontal
- Captura foto lateral
- Validação automática de qualidade
- Upload e processamento via IA
- Barra de progresso

### 9. Tela de Sono
**Conteúdo Principal:**
- Score de sono (circular progress)
- Resumo da última noite (duração, eficiência, despertares)
- Gráfico de fases do sono (leve, profundo, REM)
- Gráfico de FC e HRV durante o sono
- Calendário de sono do mês
- Insights e recomendações

**Funcionalidade:**
- Sincronizar wearable
- Ver detalhes de cada noite
- Comparar com noites anteriores
- Configurar alarme inteligente
- Exportar dados de sono

### 10. Tela de Detalhes do Sono
**Conteúdo Principal:**
- Linha do tempo visual das fases
- Métricas cardiovasculares (FC, HRV, SpO2)
- Temperatura corporal
- Movimentos e despertares
- Fatores externos (temperatura ambiente, ruído)
- Notas e eventos

**Funcionalidade:**
- Adicionar notas sobre a noite
- Marcar fatores que afetaram o sono
- Comparar com média pessoal
- Ver tendências semanais

### 11. Tela de Sinais Vitais (RPM)
**Conteúdo Principal:**
- Cards de cada sinal vital (PA, glicemia, FC, SpO2, temperatura)
- Indicadores de status (normal/alerta)
- Gráficos de tendência
- Última medição e data/hora
- Botão "Medir Agora"
- Alertas críticos destacados

**Funcionalidade:**
- Conectar dispositivos médicos Bluetooth
- Registrar medição manual
- Ver histórico completo
- Configurar alertas personalizados
- Compartilhar com médico

### 12. Tela de Medição de Sinal Vital
**Conteúdo Principal:**
- Instruções de medição
- Animação de sincronização com dispositivo
- Valor em tempo real (grande e destacado)
- Status da conexão Bluetooth
- Botão "Salvar Medição"

**Funcionalidade:**
- Conectar dispositivo via Bluetooth
- Capturar medição em tempo real
- Adicionar notas contextuais
- Salvar no histórico
- Alerta se valor crítico

### 13. Tela de Telemedicina
**Conteúdo Principal:**
- Lista de especialidades médicas
- Médicos disponíveis com foto e avaliação
- Consultas agendadas (próximas e passadas)
- Botão "Agendar Consulta"
- Acesso rápido a exames e documentos

**Funcionalidade:**
- Buscar especialidade
- Ver perfil do médico
- Agendar consulta
- Entrar na sala de espera
- Enviar documentos pré-consulta

### 14. Tela de Perfil do Médico
**Conteúdo Principal:**
- Foto e nome do profissional
- Especialidade e CRM
- Avaliação e número de consultas
- Bio e áreas de expertise
- Calendário de disponibilidade
- Valores de consulta

**Funcionalidade:**
- Selecionar data e horário
- Confirmar agendamento
- Ver avaliações de outros pacientes
- Favoritar médico

### 15. Tela de Sala de Espera Virtual
**Conteúdo Principal:**
- Mensagem de aguardo
- Timer de espera
- Preview da câmera e microfone
- Checagem de conexão
- Dicas de saúde enquanto espera

**Funcionalidade:**
- Testar câmera e microfone
- Verificar conexão de internet
- Cancelar consulta
- Entrar na videochamada quando médico chamar

### 16. Tela de Videochamada
**Conteúdo Principal:**
- Vídeo do médico (grande)
- Vídeo próprio (pequeno, canto)
- Controles de áudio/vídeo
- Botão de encerrar chamada
- Chat lateral (opcional)
- Compartilhamento de tela

**Funcionalidade:**
- Controlar áudio e vídeo
- Trocar câmera (frontal/traseira)
- Enviar mensagens de texto
- Compartilhar documentos
- Gravar consulta (se permitido)
- Encerrar chamada

### 17. Tela de Assistente Virtual
**Conteúdo Principal:**
- Interface de chat com histórico de mensagens
- Input de texto com botão de enviar
- Botão de microfone para voz
- Sugestões rápidas de perguntas
- Avatar do assistente
- Indicador de digitação

**Funcionalidade:**
- Enviar mensagens de texto
- Gravar e enviar áudio
- Receber respostas com IA
- Acessar histórico de conversas
- Marcar respostas como favoritas
- Escalar para atendimento humano

### 18. Tela de Perfil do Usuário
**Conteúdo Principal:**
- Foto de perfil e nome
- Informações básicas (idade, altura, peso)
- Metas pessoais (peso alvo, treinos/semana)
- Dispositivos conectados
- Configurações de privacidade
- Plano de assinatura

**Funcionalidade:**
- Editar perfil
- Configurar metas
- Gerenciar dispositivos
- Ajustar notificações
- Exportar dados
- Sair da conta

### 19. Tela de Configurações
**Conteúdo Principal:**
- Seções organizadas (Conta, Privacidade, Notificações, Dispositivos, Sobre)
- Toggles e seletores
- Versão do app
- Links para suporte e termos

**Funcionalidade:**
- Alterar senha
- Configurar notificações
- Gerenciar permissões
- Conectar/desconectar dispositivos
- Limpar cache
- Deletar conta

### 20. Tela de Exportação de Dados
**Conteúdo Principal:**
- Checklist de categorias de dados
- Filtros temporais
- Seletor de formato (CSV, JSON, PDF, FHIR)
- Opções avançadas (anonimizar, criptografar)
- Estimativa de tamanho do arquivo
- Botão "Exportar"

**Funcionalidade:**
- Selecionar dados para exportar
- Escolher formato
- Definir período
- Configurar opções de privacidade
- Gerar arquivo
- Compartilhar ou baixar

## Fluxos de Usuário Principais

### Fluxo 1: Registrar Treino Completo
1. Usuário abre app → Tela de Início
2. Toca em "Treinos" na bottom nav → Tela de Treinos
3. Toca no FAB "+" → Tela de Novo Treino
4. Seleciona tipo de exercício (ex: Corrida)
5. Toca "Iniciar" → Rastreamento GPS começa
6. Durante o treino: vê métricas em tempo real
7. Toca "Finalizar" → Treino é salvo
8. Vê resumo completo → Tela de Detalhes do Treino
9. Pode compartilhar ou voltar para lista

### Fluxo 2: Criar Avatar 3D
1. Usuário abre app → Tela de Início
2. Toca em "Saúde" na bottom nav → Tela de Saúde (Hub)
3. Toca no card "Avatar 3D" → Tela de Avatar 3D
4. Toca "Criar Novo Avatar" → Tela de Captura de Fotos
5. Segue instruções e captura foto frontal
6. Captura foto lateral
7. Fotos são enviadas para processamento → Barra de progresso
8. Avatar 3D é gerado → Tela de Avatar 3D
9. Pode rotacionar, ver medições e comparar

### Fluxo 3: Agendar Consulta Médica
1. Usuário toca no FAB de telemedicina (ou aba dedicada)
2. → Tela de Telemedicina
3. Seleciona especialidade (ex: Cardiologista)
4. Vê lista de médicos disponíveis
5. Toca em um médico → Tela de Perfil do Médico
6. Seleciona data e horário no calendário
7. Preenche motivo da consulta
8. Confirma agendamento → Recebe confirmação
9. No dia/hora: recebe notificação
10. Toca "Entrar na Sala" → Tela de Sala de Espera Virtual
11. Médico inicia chamada → Tela de Videochamada
12. Consulta é realizada
13. Encerra chamada → Recebe resumo e receita

### Fluxo 4: Monitorar Sono
1. Usuário dorme com wearable no pulso
2. Ao acordar: abre app → Tela de Início
3. Vê card de sono com score da noite
4. Toca em "Sono" na bottom nav → Tela de Sono
5. Vê resumo completo da última noite
6. Toca na noite → Tela de Detalhes do Sono
7. Vê fases, FC, HRV, despertares
8. Pode adicionar notas sobre fatores externos
9. Compara com noites anteriores

### Fluxo 5: Medir Pressão Arterial
1. Usuário abre app → Tela de Início
2. Toca em "Saúde" na bottom nav → Tela de Saúde (Hub)
3. Toca em "Sinais Vitais" → Tela de Sinais Vitais (RPM)
4. Toca no card "Pressão Arterial"
5. Toca "Medir Agora" → Tela de Medição
6. Liga o monitor de PA e conecta via Bluetooth
7. Coloca a braçadeira e inicia medição
8. App captura valores em tempo real
9. Toca "Salvar" → Medição é registrada
10. Se valor crítico: recebe alerta
11. Volta para lista de sinais vitais

### Fluxo 6: Conversar com Assistente Virtual
1. Usuário tem dúvida sobre nutrição
2. Toca no FAB do assistente (ícone roxo)
3. → Tela de Assistente Virtual
4. Digita ou fala pergunta: "Quantas calorias devo comer?"
5. Assistente processa e responde com recomendação personalizada
6. Usuário faz pergunta de follow-up
7. Assistente acessa dados do app e responde
8. Usuário marca resposta como favorita
9. Fecha chat → Conversa é salva no histórico

## Escolhas de Cores

### Paleta Principal (Tema Escuro)

**Backgrounds:**
- Preto Absoluto: `#000000` (fundo principal)
- Cinza Muito Escuro: `#0A0A0A` (seções)
- Cinza Escuro: `#1A1A1A` (cards, modals)
- Cinza Médio Escuro: `#2D2D2D` (borders, dividers)

**Textos:**
- Branco: `#FFFFFF` (textos principais)
- Cinza Claro: `#A0A0A0` (textos secundários)

**Acentos (Cores Vibrantes):**
- Laranja Neon: `#FF6B35` (treinos, energia, ação) - COR PRIMÁRIA
- Verde Elétrico: `#00FF88` (saúde, sucesso, sono)
- Azul Royal: `#0066FF` (dados médicos, telemedicina)
- Roxo Vibrante: `#9D4EDD` (IA, assistente, premium)
- Amarelo Dourado: `#FFD700` (conquistas, badges)
- Vermelho Alerta: `#FF3B30` (emergência, alertas críticos)

**Gradientes:**
- Energia: `linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)` - Para botões de treino
- Saúde: `linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)` - Para cards de saúde
- Noite: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - Para sono
- Fogo: `linear-gradient(135deg, #FF512F 0%, #DD2476 100%)` - Para metas/conquistas

### Mapeamento de Cores por Contexto

| Contexto | Cor Principal | Uso |
|----------|---------------|-----|
| Treinos | Laranja Neon | Botões de ação, ícones de treino, FAB |
| Saúde/Composição Corporal | Verde Elétrico | Cards de métricas positivas, progresso |
| Sono | Roxo/Azul Noite | Gráficos de sono, fases, score |
| Telemedicina | Azul Royal | Ícones médicos, botões de consulta |
| Assistente IA | Roxo Vibrante | Avatar do assistente, mensagens |
| Conquistas | Amarelo Dourado | Badges, streaks, recordes |
| Alertas | Vermelho | Sinais vitais críticos, emergências |

## Tipografia

**Fonte Principal:** Inter (weights: 400, 500, 600, 700, 800)

**Hierarquia:**
- H1 (Títulos de tela): 32px, weight 800
- H2 (Subtítulos): 24px, weight 700
- H3 (Seções): 20px, weight 600
- Body (Texto corrido): 16px, weight 400
- Caption (Legendas): 14px, weight 500
- Small (Pequenos): 12px, weight 400

## Bottom Navigation Bar

**5 Abas Principais:**

1. **Início** 🏠
   - Ícone: casa
   - Cor ativa: Laranja Neon
   - Tela: Dashboard geral

2. **Treinos** 💪
   - Ícone: raio/dumbbell
   - Cor ativa: Laranja Neon
   - Tela: Lista de treinos

3. **Saúde** ❤️
   - Ícone: coração/pulse
   - Cor ativa: Verde Elétrico
   - Tela: Hub de saúde

4. **Sono** 😴
   - Ícone: lua
   - Cor ativa: Roxo Vibrante
   - Tela: Dashboard de sono

5. **Perfil** 👤
   - Ícone: pessoa
   - Cor ativa: Azul Royal
   - Tela: Perfil e configurações

**FAB (Floating Action Button):**
- Posição: Canto inferior direito (sobrepõe a bottom nav)
- Cor: Gradiente Roxo (Assistente IA)
- Ícone: Sparkles/estrela (IA)
- Ação: Abrir assistente virtual

## Componentes de UI

### Cards
- Background: `#1A1A1A`
- Border-radius: 16px
- Padding: 20px
- Sombra: `0 4px 20px rgba(0,0,0,0.4)`

### Botões Primários
- Background: Gradiente (energia ou saúde)
- Color: `#FFF`
- Border-radius: 12px
- Padding: 16px 32px
- Font-weight: 700

### Progress Bars
- Height: 8px
- Background: `#2D2D2D`
- Fill: Gradiente baseado em contexto
- Border-radius: 4px

### Circular Progress (Score)
- Tamanho: 120px
- Espessura: 12px
- Background: `#2D2D2D`
- Foreground: Gradiente baseado em valor
- Número central: 48px, weight 800

## Animações

**Princípios:**
- Duração: 200-300ms (rápidas), 400-600ms (complexas)
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Performance: usar transform e opacity

**Micro-interações:**
- Botões: escala 0.97 + haptic
- Cards: elevação + escala
- Ícones: rotate 180° (setas), bounce (ações positivas)
- Loading: skeleton shimmer

## Considerações de Design

1. **Acessibilidade:**
   - Contraste mínimo WCAG AA
   - Tamanhos de toque mínimos (44x44pt)
   - Suporte a VoiceOver/TalkBack
   - Textos escaláveis

2. **Performance:**
   - Lazy loading de imagens
   - Virtualização de listas longas
   - Animações GPU-accelerated
   - Cache de dados locais

3. **Responsividade:**
   - Design mobile-first
   - Suporte a diferentes tamanhos de tela
   - Adaptação para tablets (se aplicável)

4. **Feedback Visual:**
   - Estados de loading claros
   - Feedback tátil (haptics)
   - Confirmações visuais de ações
   - Mensagens de erro amigáveis

5. **Consistência:**
   - Padrões de navegação uniformes
   - Iconografia consistente
   - Espaçamento regular (sistema 8pt)
   - Linguagem e tom de voz coesos
