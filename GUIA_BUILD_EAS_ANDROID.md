# Guia Completo: Build EAS para Android - HealthFit

**Autor:** Manus AI  
**Data:** 29 de Janeiro de 2026  
**Versão do App:** v22.0

---

## 📋 Índice

1. [Requisitos de Hardware e Software](#requisitos-de-hardware-e-software)
2. [Preparação do Ambiente](#preparação-do-ambiente)
3. [Execução do Build EAS](#execução-do-build-eas)
4. [Download e Instalação do APK](#download-e-instalação-do-apk)
5. [Solução de Problemas](#solução-de-problemas)

---

## 📱 Requisitos de Hardware e Software

### Requisitos do Computador

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **SO** | Windows 10, macOS 10.15, Linux | Windows 11, macOS 13+, Ubuntu 22.04+ |
| **CPU** | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| **RAM** | 4 GB | 8 GB+ |
| **Disco** | 2 GB livres | 5 GB+ livres |
| **Internet** | Banda larga | Fibra/4G/5G |
| **Node.js** | 18.x+ | 22.x |

### Requisitos do Android

| Especificação | Mínimo | Recomendado |
|---------------|--------|-------------|
| **Android OS** | 6.0 (API 23) | 10.0+ (API 29+) |
| **RAM** | 2 GB | 4 GB+ |
| **Armazenamento** | 500 MB | 2 GB+ |
| **Câmera** | 8 MP | 12 MP+ |
| **GPS** | Obrigatório | GPS + GLONASS |
| **Bluetooth** | 4.0+ | 5.0+ |

---

## 🛠️ Preparação do Ambiente

### 1. Instalar Node.js

**Windows:**
- Baixe em [nodejs.org](https://nodejs.org) (versão LTS 22.x)
- Execute o instalador
- Verifique: `node --version`

**macOS:**
```bash
brew install node@22
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalar EAS CLI

```bash
npm install -g eas-cli
eas --version
```

### 3. Criar Conta Expo

- Acesse [expo.dev](https://expo.dev)
- Clique em **Sign Up**
- Confirme o email

### 4. Fazer Login

```bash
eas login
```

### 5. Baixar o Projeto

- Download do checkpoint: `manus-webdev://985c10e7`
- Extraia para uma pasta

### 6. Instalar Dependências

```bash
cd /caminho/para/health_fitness_app
pnpm install
```

---

## 🚀 Execução do Build EAS

### 1. Configurar Projeto

```bash
eas build:configure
```

Responda:
- **Create EAS project?** → **Y**
- **Platform** → **Android**

### 2. Executar Build

```bash
eas build --platform android --profile preview
```

**Tempo estimado:** 15-20 minutos

### 3. Acompanhar Progresso

- No terminal: logs em tempo real
- No navegador: copie o link mostrado no terminal

### 4. Build Concluído

Você receberá um link como:
```
https://expo.dev/artifacts/eas/abc123xyz.apk
```

---

## 📥 Download e Instalação

### 1. Baixar APK

**Opção A (Recomendado):**
- Abra o navegador no celular
- Cole o link do APK
- Aguarde download (~50-80 MB)

**Opção B:**
- Baixe no PC
- Transfira via USB para pasta Downloads do celular

### 2. Habilitar Fontes Desconhecidas

**Android 8.0+:**
1. **Configurações** → **Segurança** → **Instalar apps desconhecidos**
2. Selecione o navegador usado
3. Ative **Permitir desta fonte**

**Android 7.1 ou inferior:**
1. **Configurações** → **Segurança**
2. Ative **Fontes desconhecidas**

### 3. Instalar APK

1. Abra **Arquivos** → **Downloads**
2. Toque no APK
3. Toque em **Instalar**
4. Aguarde e toque em **Abrir**

### 4. Conceder Permissões

| Permissão | Finalidade | Obrigatória? |
|-----------|------------|--------------|
| Câmera | Avatar 3D e análise refeições | ✅ Sim |
| Localização | GPS treinos | ✅ Sim |
| Armazenamento | Salvar dados | ✅ Sim |
| Notificações | Lembretes | ⚠️ Recomendado |
| Bluetooth | Wearables | ⚠️ Opcional |

---

## 🔧 Solução de Problemas

### "eas: command not found"
```bash
npm install -g eas-cli --force
```

### "Build failed: Out of memory"
```bash
eas build --platform android --profile production
```

### "App Parse Error"
- Verifique Android 6.0+
- Baixe APK novamente
- Confirme extensão `.apk`

### Tela branca ao abrir
- Aguarde 30-60s
- Force parada: **Configurações** → **Apps** → **HealthFit** → **Forçar parada**
- Limpe cache e reabra

### Câmera não funciona
- **Configurações** → **Apps** → **HealthFit** → **Permissões** → **Câmera** → **Permitir**

### GPS não rastreia
- Ative GPS do celular
- **Permissões** → **Localização** → **Permitir o tempo todo**

### Wearables não conectam
- Ative Bluetooth
- Pareie nas **Configurações do Android** primeiro
- Depois conecte no app

### "Insufficient storage"
- Libere 1 GB de espaço
- Exclua apps não usados
- Limpe cache

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] EAS CLI instalado
- [ ] Conta Expo criada
- [ ] Projeto baixado
- [ ] Build executado
- [ ] APK baixado
- [ ] Fontes desconhecidas habilitadas
- [ ] APK instalado
- [ ] Permissões concedidas
- [ ] Tutorial assistido
- [ ] Informações configuradas

---

**Parabéns!** HealthFit v22.0 instalado com sucesso!

**Suporte:** [help.manus.im](https://help.manus.im)

---

**Última atualização:** 29/01/2026  
**Autor:** Manus AI
