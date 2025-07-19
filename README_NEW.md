# 🚀 MotoTrack AI - Sistema Completo de Gestão de Entregas

> **Sistema profissional de controle de entregas com AI, desenvolvido para estabelecimentos modernos de delivery**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

O **MotoTrack AI** é um sistema completo de gestão de entregas que combina inteligência artificial com uma interface moderna e intuitiva. Desenvolvido especificamente para estabelecimentos que trabalham com delivery, oferece desde funcionalidades básicas até recursos avançados de analytics e automação.

### ✨ Diferenciais

- 🤖 **Inteligência Artificial** integrada para otimização
- 📱 **Interface Responsiva** - funciona em desktop e mobile
- 💾 **Persistência Local** - dados salvos automaticamente
- 🔧 **Configurável** - totalmente customizável
- 📊 **Analytics Avançado** - relatórios detalhados
- 🔐 **Seguro** - validações e backups automáticos

## 🚀 Principais Funcionalidades

### 👥 Gestão de Usuários

- **Multi-perfis**: Vendedor e Entregador
- **Autenticação segura** por estabelecimento
- **Alternar perfis** sem fazer logout
- **Gestão de entregadores** completa

### 📦 Controle de Entregas

- ✅ **Cadastro completo** de entregas
- 🎯 **Atribuição automática/manual** de entregadores
- 📍 **Controle de status** em tempo real
- 💰 **Gestão de pagamentos** (dinheiro, cartão, PIX)
- ⏱️ **Tempo estimado** de entrega
- 📝 **Observações** e notas especiais

### 🔍 Filtros Avançados

- 📅 **Filtro por datas** (intervalo personalizado)
- 💵 **Filtro por valores** (faixa mín/máx)
- 📊 **Status e prioridade**
- 👤 **Por entregador específico**
- 🗺️ **Por zona de entrega**
- 👥 **Por cliente ou endereço**
- ⚡ **Filtros rápidos**: urgentes, atribuídas, com observações

### ⚙️ Configurações do Sistema

- 🏢 **Configurações Gerais**: dados da empresa, timezone, moeda
- 🔔 **Notificações**: email, SMS, push, horários silenciosos
- 🎨 **Personalização**: cores, tema escuro, layout compacto
- 🚚 **Entrega**: auto-atribuição, tempo padrão, raio de entrega
- 🔐 **Segurança**: 2FA, criptografia, política de senhas
- 🔗 **Integrações**: WhatsApp, Google Maps, SMS Gateway

### 💾 Backup e Restauração

- 📥 **Backup automático** antes de operações críticas
- 💾 **Backup manual** com notas explicativas
- 📋 **Lista de backups** com detalhes completos
- ⚡ **Restauração** com validações de segurança
- 🗑️ **Limpeza de dados** com confirmações duplas

### 📊 Relatórios e Analytics

- 📈 **Dashboard de performance** em tempo real
- 📊 **Gráficos interativos** por período
- 🏆 **Ranking de entregadores** com estatísticas
- 🗺️ **Análise por zona** e horário
- 💰 **Relatórios financeiros** com projeções
- 📄 **Exportação** em múltiplos formatos

### 🖨️ Funcionalidades Adicionais

- 🖨️ **Impressão POS** para pedidos
- 🔔 **Sistema de notificações** integrado
- 📱 **Interface adaptativa** para todos os dispositivos
- 🔄 **Sincronização automática** de dados
- 💬 **Feedback visual** para todas as ações

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 18+** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **Tailwind CSS** - Framework CSS
- **Shadcn/UI** - Componentes de interface

### Funcionalidades

- **Lucide React** - Ícones modernos
- **React Router** - Roteamento
- **LocalStorage** - Persistência local
- **Date-fns** - Manipulação de datas

### Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Babel** - Transpilação
- **Bun** - Gerenciador de pacotes

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou Bun
- NPM, Yarn ou Bun

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/moto-track-ai-delivery.git

# Entre na pasta do projeto
cd moto-track-ai-delivery

# Instale as dependências
npm install
# ou
bun install

# Execute o projeto
npm run dev
# ou
bun dev

# Acesse no navegador
http://localhost:8080
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 💡 Como Usar

### 1. Primeiro Acesso

1. 🏢 **Crie um estabelecimento** na tela inicial
2. 👤 **Escolha o perfil** (Vendedor ou Entregador)
3. ✅ **Configure o sistema** na aba "Sistema"

### 2. Cadastro de Entregadores

1. 📍 Acesse a aba **"Entregadores"**
2. ➕ Clique em **"Novo Entregador"**
3. 📝 Preencha os dados completos
4. ✅ Salve e gerencie status

### 3. Registro de Entregas

1. 📦 Acesse a aba **"Entregas"**
2. ➕ Clique em **"Nova Entrega"**
3. 📝 Preencha dados do cliente e entrega
4. 👤 Atribua a um entregador (ou deixe automático)
5. ✅ Acompanhe o status em tempo real

### 4. Filtros Avançados

1. 🔍 Na aba **"Sistema"**, acesse **"Ferramentas Avançadas"**
2. 🎯 Configure filtros por data, valor, status, entregador
3. 📊 Aplique filtros para análises específicas

### 5. Configurações

1. ⚙️ Acesse **"Configurações do Sistema"**
2. 🎨 Personalize tema, notificações e integrações
3. 💾 Configurações são salvas automaticamente

### 6. Backup de Dados

1. 💾 Acesse **"Backup e Restauração"**
2. 📥 Crie backups manuais ou automáticos
3. 🔄 Restaure dados quando necessário

## 📁 Estrutura do Projeto

```
moto-track-ai-delivery/
├── src/
│   ├── components/
│   │   ├── ui/                 # Componentes base
│   │   │   ├── advanced-filters.tsx
│   │   │   ├── system-settings.tsx
│   │   │   ├── backup-restore.tsx
│   │   │   ├── reports-analytics.tsx
│   │   │   └── ...
│   │   ├── DeliveryModal.tsx   # Modal de entregas
│   │   ├── DelivererModal.tsx  # Modal de entregadores
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── hooks/
│   │   ├── useDatabase.tsx     # Hook de dados
│   │   └── useToast.tsx        # Hook de notificações
│   ├── pages/
│   │   └── Index.tsx           # Página principal
│   ├── lib/
│   │   └── utils.ts            # Utilitários
│   └── styles/
│       └── index.css           # Estilos globais
├── public/                     # Arquivos estáticos
├── docs/                       # Documentação
├── CHANGELOG.md               # Histórico de mudanças
├── README.md                  # Este arquivo
└── package.json              # Dependências e scripts
```

## 📈 Status do Projeto

### ✅ Funcionalidades Completas

- ✅ Sistema de autenticação
- ✅ Gestão de entregas e entregadores
- ✅ Filtros avançados
- ✅ Configurações do sistema
- ✅ Backup e restauração
- ✅ Relatórios e analytics
- ✅ Interface responsiva
- ✅ Persistência de dados
- ✅ Sistema de notificações

### 🚧 Roadmap Futuro

- 🔲 Sistema de permissões granulares
- 🔲 API REST para integrações
- 🔲 PWA (Progressive Web App)
- 🔲 Tracking GPS em tempo real
- 🔲 Chatbot para clientes
- 🔲 Machine Learning para otimização

## 🤝 Contribuição

### Como Contribuir

1. 🍴 **Fork** o projeto
2. 🌟 **Clone** sua fork
3. 🔧 **Crie uma branch** para sua feature
4. ✅ **Commit** suas mudanças
5. 📤 **Push** para a branch
6. 🔀 **Abra um Pull Request**

### Padrões de Código

- **TypeScript** obrigatório
- **ESLint** configurado
- **Componentes funcionais** com hooks
- **Nomes descritivos** para variáveis e funções
- **Comentários** em código complexo

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 **Email**: suporte@mototrack.ai
- 💬 **Discord**: [Servidor da Comunidade](https://discord.gg/mototrack)
- 📖 **Documentação**: [docs.mototrack.ai](https://docs.mototrack.ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/moto-track-ai-delivery/issues)

## 🏆 Créditos

### Desenvolvido por

**GitHub Copilot** - Assistente de Programação AI

### Agradecimentos

- ✨ **React Team** - Framework incrível
- 🎨 **Tailwind CSS** - Estilização moderna
- 🎯 **Shadcn/UI** - Componentes elegantes
- 🚀 **Vite** - Build tool rápida

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela! ⭐**

Feito com ❤️ para a comunidade de delivery

[🚀 Demo Online](https://mototrack-ai.vercel.app) | [📖 Documentação](https://docs.mototrack.ai) | [💬 Discord](https://discord.gg/mototrack)

</div>
