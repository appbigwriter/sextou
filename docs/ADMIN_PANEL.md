# 🎛️ Painel Administrativo - Sexta do Empreendedor

## 📋 Visão Geral

O painel administrativo é o centro de controle do sistema, permitindo gerenciar todos os aspectos da plataforma de forma eficiente e segura.

---

## 👥 Perfis de Acesso

### Super Admin
- Acesso total ao sistema
- Gerenciar outros administradores
- Configurações globais
- Relatórios financeiros completos

### Moderator
- Aprovar/rejeitar anúncios
- Editar anúncios
- Gerenciar categorias
- Enviar notificações

### Financial
- Confirmar pagamentos
- Ver relatórios financeiros
- Gerenciar cupons
- Liberar anúncios gratuitos

---

## 📊 Dashboard Principal

### Métricas em Destaque

**Cards no Topo:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Total Usuários │  │ Total Anúncios  │  │  Anúncios Pagos │  │ Anúncios Pendentes │
│      156        │  │      234        │  │       89        │  │        12        │
│   +15 esta sem. │  │   +23 esta sem. │  │   +8 hoje       │  │   Requer ação    │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Gráficos:**
- Anúncios por dia (últimos 30 dias)
- Taxa de aprovação vs. rejeição
- Receita mensal
- Categorias mais populares
- Cidades com mais anunciantes

**Ações Rápidas:**
- Ver anúncios pendentes de aprovação
- Ver pagamentos pendentes de confirmação
- Anúncios agendados para próxima sexta
- Usuários cadastrados hoje

---

## 📝 Gestão de Anúncios

### Visualizações

**Lista Completa:**
- Tabela com todos os anúncios
- Colunas: ID, Título, Anunciante, Categoria, Status, Data, Ações
- Paginação (50 itens por página)
- Ordenação por coluna

**Filtros Disponíveis:**
```typescript
- Por Data (range)
  - Hoje
  - Esta semana
  - Este mês
  - Custom range

- Por Categoria
  - Todas
  - Alimentação
  - Beleza
  - Construção
  - etc.

- Por Status
  - Todos
  - Draft
  - Aguardando Pagamento
  - Pago
  - Em Revisão
  - Aprovado
  - Rejeitado
  - Publicado
  - Expirado

- Por Pagamento
  - Todos
  - Pendente
  - Pago
  - Reembolsado

- Por Featured
  - Apenas destacados
  - Não destacados
```

### Ações por Anúncio

**Aprovar:**
- Botão verde "Aprovar"
- Modal de confirmação
- Adicionar observação (opcional)
- Registra ação no log

**Rejeitar:**
- Botão vermelho "Rejeitar"
- Modal obrigatório com motivo
- Lista de motivos pré-definidos:
  - Conteúdo inadequado
  - Informações incompletas
  - Imagens de baixa qualidade
  - Violação dos termos
  - Outro (campo livre)
- Envia notificação ao anunciante

**Editar:**
- Abrir formulário de edição
- Campos editáveis:
  - Título
  - Descrições
  - Categoria
  - Preço
  - Promoção
  - Cidade
  - Links
  - WhatsApp
- Registra modificação no log

**Excluir:**
- Botão com confirmação dupla
- Soft delete (status = DELETED)
- Mantém dados no banco para auditoria
- Não pode ser desfeito

**Definir Destaque:**
- Toggle "Featured"
- Anúncio aparece em posição privilegiada
- Limite de X anúncios em destaque simultâneos
- Pode definir período de destaque

---

## 💰 Gestão de Pagamentos

### Lista de Pagamentos

**Colunas:**
- ID do Pagamento
- Anunciante
- Anúncio
- Valor
- Método (Zelle, Stripe, PayPal)
- Status
- Data
- Ações

**Filtros:**
- Por Status (Pendente, Confirmado, Falhado, Reembolsado)
- Por Data
- Por Método de Pagamento
- Por Anunciante

### Confirmar Pagamento (Zelle Manual)

**Fluxo:**
1. Anunciante envia comprovante via upload
2. Pagamento aparece como PENDING
3. Admin clica em "Ver Comprovante"
4. Modal exibe:
   - Imagem do comprovante
   - Dados do anúncio
   - Valor esperado
   - Dados do anunciante
5. Admin confirma ou rejeita:
   - **Confirmar:** Status → CONFIRMED, Anúncio → PAID
   - **Rejeitar:** Status → FAILED, Motivo obrigatório

---

## 📊 Relatórios Financeiros

### Relatório Mensal

**Métricas:**
- Receita total do mês
- Número de anúncios pagos
- Ticket médio
- Taxa de conversão (cadastros → pagamentos)
- Receita por categoria
- Receita por cidade
- Comparativo com mês anterior

**Visualizações:**
- Gráfico de linha (receita diária)
- Gráfico de pizza (receita por categoria)
- Tabela de top anunciantes (por valor gasto)

### Exportação de Dados

**Formatos:**
- CSV (Excel-ready)
- PDF (relatório formatado)

**Dados Exportáveis:**
- Todos os anúncios (com filtros aplicados)
- Todos os pagamentos (com filtros aplicados)
- Lista de usuários
- Relatório financeiro completo
- Logs de auditoria

**CSV Headers (Anúncios):**
```csv
id,titulo,anunciante,email,categoria,status,status_pagamento,valor,data_criacao,data_publicacao,views,clicks
```

**CSV Headers (Pagamentos):**
```csv
id,anunciante,email,anuncio_id,valor,metodo,status,data_pagamento,confirmado_por
```

---

## 🏷️ Gestão de Categorias

### Lista de Categorias

**Colunas:**
- Nome
- Slug
- Ícone
- Ordem de Exibição
- Quantidade de Anúncios
- Status (Ativa/Inativa)
- Ações

### Criar/Editar Categoria

**Campos:**
- Nome (ex: "Alimentação")
- Slug (auto-gerado, editável: "alimentacao")
- Descrição (opcional)
- Ícone (seletor de ícone ou upload)
- Ordem (número, para ordenar na listagem)
- Status (ativo/inativo)

### Reordenar Categorias

- Drag and drop para reordenar
- Atualiza ordem de exibição no site

---

## 🎨 Gestão de Banners da Home

### Lista de Banners

**Tipos de Banner:**
- Hero principal (1920x600px)
- Banner secundário (800x400px)
- Banner lateral (400x800px)

**Campos:**
- Título do Banner
- Imagem (upload)
- Link de Destino (opcional)
- Posição (hero, secondary, sidebar)
- Ordem
- Data de Início
- Data de Fim
- Status (ativo/inativo)

### Preview

- Visualizar como ficará na landing page
- Preview mobile e desktop

---

## 🎟️ Gestão de Cupons

### Lista de Cupons

**Colunas:**
- Código
- Tipo de Desconto (%, Valor Fixo, Grátis)
- Valor do Desconto
- Válido De → Até
- Usos Máximos
- Vezes Usado
- Status (Ativo/Inativo)
- Ações

### Criar Cupom

**Campos:**
- Código (ex: "PRIMEIRACOMPRA")
- Tipo de Desconto:
  - Porcentagem (ex: 20%)
  - Valor Fixo (ex: $10 off)
  - Grátis (100% off)
- Valor
- Válido De (data/hora)
- Válido Até (data/hora)
- Máximo de Usos (ex: 50)
- Uso por Usuário (1x, ilimitado)
- Status

### Histórico de Uso

- Lista de anúncios que usaram o cupom
- Data/hora de uso
- Anunciante

---

## 👑 Gestão de Usuários VIP

### Marcar como VIP

**Fluxo:**
1. Na lista de usuários, clicar em "Tornar VIP"
2. Modal de confirmação:
   - Motivo (parceiro estratégico, volume alto, etc)
   - Benefícios a conceder:
     - [ ] Desconto permanente (valor ou %)
     - [ ] Anúncios destacados automaticamente
     - [ ] Prioridade na aprovação
     - [ ] Badge "VIP" no perfil
3. Confirmar → Usuário recebe badge VIP

### Benefícios VIP

**Automáticos:**
- Aprovação em até 2h (vs. 24h normal)
- Suporte prioritário
- Badge visível no perfil público
- Estatísticas avançadas

**Opcionais (configuráveis):**
- Desconto em anúncios
- X anúncios grátis por mês
- Destaque automático

---

## 📝 Observações Internas

### Por Anunciante

**Funcionalidade:**
- Campo de notas privadas visível apenas para admins
- Histórico de observações (quem escreveu, quando)
- Útil para:
  - Registrar conversas importantes
  - Marcar comportamentos (ex: "sempre paga em dia")
  - Alertas (ex: "já teve anúncio rejeitado 3x")

**Interface:**
```
┌────────────────────────────────────────────┐
│ Observações sobre José Silva              │
├────────────────────────────────────────────┤
│ [01/04/2026 10:30] Admin Maria:            │
│ Cliente pediu desconto. Negado.            │
│                                            │
│ [28/03/2026 14:15] Admin João:             │
│ Pagamento confirmado rapidamente. Bom!     │
│                                            │
│ [+ Adicionar Nova Observação]              │
└────────────────────────────────────────────┘
```

---

## 📈 Performance dos Anúncios

### Métricas por Anúncio

**Visualizações:**
- Total de views
- Views por dia (gráfico)
- Taxa de cliques (CTR)

**Interações:**
- Cliques no WhatsApp
- Cliques no Site
- Cliques no Instagram
- Botão "Tenho Interesse"

**Conversão:**
- Leads gerados
- Taxa de conversão (views → leads)

### Dashboard de Performance

**Ranking:**
- Top 10 anúncios mais vistos
- Top 10 anúncios com mais cliques
- Top 10 anúncios com mais leads

**Por Categoria:**
- Categoria mais popular
- Taxa de cliques por categoria

---

## 📢 Notificações

### Enviar Notificação

**Para quem:**
- Todos os usuários
- Usuários com anúncios ativos
- Usuários VIP
- Usuário específico

**Tipo:**
- E-mail
- SMS (futuro)
- Notificação in-app

**Conteúdo:**
- Assunto
- Mensagem
- Link (opcional)
- Agendar envio (opcional)

**Templates Pré-Definidos:**
- "Seu anúncio foi aprovado!"
- "Seu anúncio foi rejeitado"
- "Pagamento confirmado"
- "Seu anúncio foi publicado"
- "Seu anúncio expira em 2 dias"
- "Novidades da plataforma"

---

## 📋 Área de Leads

### Painel de Leads

**Lista de Leads:**

| Anúncio | Data/Hora | Origem | Usuário | Ações |
|---------|-----------|--------|---------|-------|
| Pizza Delivery | 01/04 14:30 | WhatsApp Click | João Silva | Ver |
| Encanador 24h | 01/04 14:25 | Interest Button | Anônimo | - |
| Personal Trainer | 01/04 14:20 | Website Click | Maria Santos | Ver |

**Filtros:**
- Por Anúncio
- Por Data
- Por Origem (WhatsApp, Site, Instagram, Interest Button)
- Com/sem identificação do usuário

**Exportar:**
- CSV com todos os leads (para o anunciante acompanhar)

### Detalhes do Lead

**Informações Capturadas:**
- Anúncio de interesse
- Data e hora exata
- Origem do clique
- Dados do usuário (se fornecidos):
  - Nome
  - E-mail
  - Telefone
- IP Address (para auditoria)
- User Agent (dispositivo/navegador)

---

## 🔐 Logs de Auditoria

### Registro Automático

**Ações Registradas:**
- Login/Logout de admin
- Aprovação de anúncio
- Rejeição de anúncio
- Edição de anúncio
- Exclusão de anúncio
- Confirmação de pagamento
- Criação de cupom
- Marcar usuário como VIP
- Envio de notificação
- Alteração de configurações

**Dados Salvos:**
- Admin que executou
- Data/hora
- Tipo de ação
- Entidade afetada (ID)
- Detalhes (JSON com dados relevantes)

### Visualizar Logs

**Interface:**
- Tabela cronológica
- Filtros:
  - Por Admin
  - Por Tipo de Ação
  - Por Data
  - Por Entidade (Anúncio X, Usuário Y)
- Exportar logs (CSV)

---

## ⚙️ Configurações do Sistema

### Gerais
- Nome da plataforma
- E-mail de contato
- Telefone de suporte
- WhatsApp de suporte
- Redes sociais

### Anúncios
- Preço padrão por anúncio ($30)
- Duração de publicação (7 dias)
- Limite de imagens por anúncio (5)
- Tamanho máximo de imagem (5MB)
- Tamanho máximo de vídeo (50MB)
- Categorias ativas

### Pagamentos
- Métodos ativos (Zelle, Stripe, PayPal)
- Instruções para Zelle
- Chave PIX (futuro)

### E-mails
- Servidor SMTP
- E-mail remetente
- Templates personalizados

---

## 📱 Responsividade

O painel administrativo deve ser:
- **Desktop-first** (uso principal)
- Mas **responsivo** para tablets
- Funcionalidades básicas em mobile (aprovar, ver dashboard)

---

## 🔒 Segurança

### Acesso Restrito
- Login separado do usuário comum
- Autenticação two-factor (futuro)
- Timeout de sessão (30 min de inatividade)

### Permissões Granulares
```typescript
const permissions = {
  super_admin: ['*'], // todas
  moderator: [
    'view_ads',
    'approve_ads',
    'reject_ads',
    'edit_ads',
    'manage_categories',
    'send_notifications'
  ],
  financial: [
    'view_payments',
    'confirm_payments',
    'view_reports',
    'manage_coupons'
  ]
}
```

---

**Documento criado em:** 01/04/2026  
**Mantido por:** Chiara Garcia  
**Versão:** 1.0
