# Sexta do Empreendedor 🚀

Sistema completo de marketplace comunitário para anunciantes empreendedores da comunidade brasileira nos Estados Unidos.

## 🎯 Visão Geral

Plataforma que conecta mais de 6.000 membros da comunidade brasileira com empreendedores locais através de anúncios semanais publicados todas as sextas-feiras.

### Funcionalidades Principais

- 📝 Cadastro e gestão de anunciantes
- 💰 Sistema de pagamento via Zelle ($30/anúncio)
- 🎨 Vitrine pública com filtros inteligentes
- ⚡ Painel administrativo completo
- 📱 Integração com WhatsApp
- 🔔 Sistema de aprovação de anúncios
- 📊 Analytics e relatórios

## 🛠️ Stack Técnica

- **Frontend:** Next.js 14 + React + TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **UI Components:** shadcn/ui
- **Deploy:** Vercel-ready

## 📋 Status do Projeto

**Versão:** 0.1.0 (MVP em desenvolvimento)  
**Data de Início:** 01/04/2026  
**Previsão de Entrega MVP:** 02/04/2026  

## 👥 Equipe

- **Chiara Garcia** - Arquitetura e Coordenação
- **Lia Salazar** - Frontend e UI/UX
- **David Novaes** - Backend e APIs

## 📁 Estrutura do Projeto

```
/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes reutilizáveis
│   ├── lib/             # Utilitários e configurações
│   └── styles/          # Estilos globais
├── prisma/
│   └── schema.prisma    # Modelagem do banco
├── public/
│   └── assets/          # Imagens e assets estáticos
└── docs/                # Documentação do projeto
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar migrações do banco
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📖 Documentação

- [Arquitetura do Sistema](./docs/ARCHITECTURE.md)
- [Modelagem do Banco](./docs/DATABASE.md)
- [Guia de Estilo](./docs/STYLEGUIDE.md)
- [API Reference](./docs/API.md)

## 🎨 Identidade Visual

Cores principais baseadas no logo:
- Azul: #0066CC
- Amarelo: #FFD700
- Laranja: #FF8C00
- Branco: #FFFFFF

## 📝 Licença

Propriedade da Facebrasil Group - Todos os direitos reservados.
