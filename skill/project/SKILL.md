---
name: fbr-spec
description: >
  Skill de especificação algorítmica para projetos FBR. Use este skill SEMPRE que o usuário 
  apresentar um conceito geral de projeto FBR (em HTML, Markdown, texto ou verbal) e quiser 
  transformá-lo em especificação técnica rigorosa. Também acione quando o usuário pedir para 
  criar tarefas de desenvolvimento, definir batches, escrever tasks para agentes ou garantir 
  alinhamento entre código e algoritmo. Triggers incluem: "conceito geral", "PRD", "especificação", 
  "batch", "tarefa técnica", "implementation plan", "algorithmo do projeto", "task definition", 
  "definition of done", qualquer menção a FBR-Click, FBR-Leads, FBR-Dev ou FBR-Suporte seguida 
  de pedido de planejamento ou codificação.
compatibility:
  context_files:
    - fbr-arquitetura.md   # pressuposto canônico — carregar sempre que disponível
    - DESIGN_STANDARDS.md  # padrão visual — carregar para tasks de frontend
    - securitycoderules.md # regras de segurança — invariante em todas as tasks
---

# FBR Spec Skill — Conceito → Algoritmo → Tarefas

Este skill transforma um **Conceito Geral** (narrativo, visual, HTML) em uma **Especificação
Algorítmica** e depois em **Tarefas de Desenvolvimento** com critérios de Done binários.

O objetivo é eliminar 100% da ambiguidade entre o que o projeto deve fazer e o que será codificado.

---

## FASE 0 — Absorção de Contexto

Antes de qualquer output, carregar e processar:

1. `fbr-arquitetura.md` → extrair: stack canônica, pressupostos inegociáveis, sistemas existentes
2. `securitycoderules.md` → extrair: invariantes de segurança (nunca negociáveis)
3. `DESIGN_STANDARDS.md` → extrair: tokens de tipografia e cor (para tasks de frontend)
4. Conceito Geral do projeto alvo (arquivo .html, .md ou texto fornecido pelo usuário)

Se algum arquivo estiver ausente, avisar o usuário e pedir antes de continuar.

---

## FASE 1 — Extração de Algoritmo

A partir do Conceito Geral, produzir o **Documento de Algoritmo** com estas seções obrigatórias:

### 1.1 — Definição de Sistema

```
SISTEMA: <nome>
PROPÓSITO: <uma frase, verbo no infinitivo>
TIPO: [Hub Central | Sistema Satélite | Módulo Interno]
CANAL FBR-CLICK: #<nome-do-canal> | N/A
OWNER: <papel responsável>
```

### 1.2 — Entidades Centrais

Para cada entidade do sistema (tabelas, objetos de domínio):

```
ENTIDADE: <NomeEntidade>
ATRIBUTOS OBRIGATÓRIOS: <lista tipada: campo: Tipo>
ATRIBUTOS OPCIONAIS: <lista tipada>
INVARIANTES:
  - <condição que NUNCA pode ser falsa, ex: user_id NOT NULL, RLS ativo>
RELACIONAMENTOS:
  - <NomeEntidade> →[1:N]→ <OutraEntidade> via <campo_fk>
CICLO DE VIDA: [CREATED → ESTADO_A → ESTADO_B → TERMINAL]
```

### 1.3 — Fluxos Algorítmicos

Para cada fluxo de negócio relevante, descrever em pseudocódigo estruturado:

```
FLUXO: <NomeDoFluxo>
TRIGGER: <o que inicia — evento, request HTTP, mensagem WebSocket, cron>
PRÉ-CONDIÇÕES:
  - <o que deve ser verdade antes de executar>
PASSOS:
  1. <ação determinística, sujeito + verbo + objeto>
  2. SE <condição> ENTÃO <ação> SENÃO <ação alternativa>
  3. PARA CADA <entidade> EM <conjunto>: <ação>
  4. CHAMAR <serviço_externo>(parâmetros) → AGUARDAR resposta
  5. PERSISTIR <entidade> EM <tabela>
  6. EMITIR <evento> PARA <canal>
PÓS-CONDIÇÕES:
  - <o que deve ser verdade após execução bem-sucedida>
CASOS DE FALHA:
  - SE <erro_X>: <tratamento obrigatório>
  - SE <erro_Y>: <tratamento obrigatório>
INVARIANTES DE SEGURANÇA (da securitycoderules.md):
  - <quais regras se aplicam aqui>
```

### 1.4 — Contratos de Interface

Para cada ponto de integração (API, WebSocket, evento):

```
CONTRATO: <Nome>
TIPO: [REST | WebSocket | Redis Pub/Sub | FBR-Click Event]
DIREÇÃO: <Sistema_A> → <Sistema_B>
AUTENTICAÇÃO: [JWT via X-User-Id | iron-session | HMAC-SHA256 | N/A]
PAYLOAD:
  {
    campo_obrigatório: Tipo,       // descrição
    campo_opcional?: Tipo,         // descrição
  }
RESPOSTA_SUCESSO: <status code> + <estrutura>
RESPOSTA_ERRO: <status code> + <estrutura>
IDEMPOTENTE: [SIM | NÃO]
RATE_LIMIT: [SIM — <regra> | NÃO]
```

### 1.5 — Invariantes Globais do Sistema

Lista consolidada de condições que NUNCA podem ser violadas em nenhum batch:

```
INVARIANTE_GLOBAL_01: RLS habilitado em TODAS as tabelas sem exceção
INVARIANTE_GLOBAL_02: Toda ação irreversível requer aprovação humana explícita
INVARIANTE_GLOBAL_03: Nenhum secret hardcoded — exclusivamente em .env
INVARIANTE_GLOBAL_04: Frontend NUNCA chama o backend diretamente — sempre via Next.js API Route proxy
INVARIANTE_GLOBAL_05: Todo agente tem SOUL.md e owner designado
... (adicionar invariantes específicas do sistema)
```

---

## FASE 2 — Plano de Batches

Com o algoritmo definido, organizar a execução em batches sequenciais (ou paralelos onde indicado).

### Template de Batch

```
BATCH: <N> — <Nome Descritivo>
DIAS: <início>–<fim>
PARALELO_COM: Batch <X> | N/A
OBJETIVO_ALGORÍTMICO: <o que do algoritmo este batch implementa>

PRÉ-REQUISITOS:
  - Batch <N-1> com todos os Critérios de Done validados
  - <outros pré-requisitos explícitos>

ESCOPO (o que ENTRA):
  - <item concreto e verificável>

FORA DE ESCOPO (o que NÃO entra):
  - <item que pode ser confundido mas não pertence aqui>

CRITÉRIOS DE DONE DO BATCH (todos obrigatórios, binários):
  [ ] <critério mensurável — ex: "endpoint POST /api/messages retorna 201 com payload válido">
  [ ] <critério de segurança — ex: "RLS testado: User A não acessa dados de User B">
  [ ] <critério de integração — ex: "WebSocket entrega mensagem em < 200ms em ambiente local">
```

---

## FASE 3 — Definição de Tarefas

Para cada batch, decompor em tarefas. Cada tarefa segue este template rigoroso:

```
────────────────────────────────────────────
TASK: <BATCH>-<NN> — <Nome da Tarefa>
────────────────────────────────────────────
BATCH: <N>
DOMÍNIO: [Backend | Frontend | Database | Infra | Agente | Integração | Teste]
ESTIMATIVA: <horas ou pontos>
DEPENDE DE: TASK <BATCH>-<NN> | N/A

OBJETIVO ALGORÍTMICO:
  Implementar o <Fluxo/Entidade/Contrato> definido no Algoritmo seção <X.Y>.

INPUT:
  - <o que chega para esta task começar: arquivos existentes, APIs disponíveis, dados de seed>

OUTPUT ESPERADO:
  - <arquivo criado/modificado com caminho exato>
  - <endpoint criado com método + rota>
  - <tabela criada com schema resumido>

ESPECIFICAÇÃO TÉCNICA:
  <pseudocódigo ou estrutura de dados da implementação — sem ambiguidade>
  
  Exemplo para uma rota FastAPI:
    POST /api/spaces/{space_id}/channels
    Auth: X-User-Id (header, obrigatório)
    Body: { name: str[3..50], type: "text"|"agent"|"announcement" }
    Guard: user deve ser member do space com role >= "admin"
    Ação: INSERT INTO channels + EMIT channel.created via Redis
    Return: 201 { id, name, type, created_at }
    Erro 403: se role insuficiente
    Erro 404: se space não existe ou user não é member

INVARIANTES QUE ESTA TASK DEVE RESPEITAR:
  - INVARIANTE_GLOBAL_01: (se aplicável) ...
  - INVARIANTE_GLOBAL_04: (se aplicável) ...
  - <invariante específica desta task>

CASOS DE BORDA OBRIGATÓRIOS (testar antes de marcar Done):
  - [ ] <cenário edge — ex: "enviar payload com name vazio → deve retornar 422">
  - [ ] <cenário de segurança — ex: "User de outro space tenta acessar → deve retornar 404">
  - [ ] <cenário de concorrência — ex: "dois inserts simultâneos com mesmo name → único constraint">

CRITÉRIO DE DONE (binário — passou ou falhou):
  [ ] <teste automatizado verde OU evidência manual reproduzível>
  [ ] <invariante de segurança verificada com teste de isolamento>
  [ ] <integração com task dependente validada end-to-end>
  [ ] README.md atualizado com a feature (conforme securitycoderules.md)

NÃO FAZER NESTA TASK:
  - <o que está fora do escopo e pode ser tentação>
────────────────────────────────────────────
```

---

## FASE 4 — Checklist de Qualidade do Documento

Antes de entregar o documento completo ao usuário, verificar:

**Completude do Algoritmo:**
- [ ] Todas as entidades têm invariantes definidas
- [ ] Todos os fluxos têm pré-condições, pós-condições e casos de falha
- [ ] Todos os contratos de interface têm autenticação explícita

**Alinhamento com FBR Arquitetura:**
- [ ] Stack usada é a canônica (FastAPI, Next.js 15, PostgreSQL 16, Redis 7)
- [ ] Todo evento humano relevante passa pelo FBR-Click
- [ ] Agentes têm os 7 Markdowns e owner definido
- [ ] LLM em cascata: Ollama → Claude API → GPT-4o

**Qualidade das Tasks:**
- [ ] Toda task tem Critério de Done binário
- [ ] Toda task tem pelo menos 2 casos de borda
- [ ] Dependências entre tasks formam um grafo acíclico
- [ ] Nenhuma task tem "NÃO FAZER" vazio (significa que o escopo está mal definido)

**Segurança:**
- [ ] RLS aparece como invariante em toda task de Database
- [ ] iron-session aparece em toda task de Auth
- [ ] Rate limiting está nas tasks de rotas sensíveis
- [ ] Nenhuma task expõe IDs internos no frontend

---

## REGRAS DE LINGUAGEM ALGORÍTMICA

Ao escrever qualquer especificação, aplicar estas regras de linguagem:

| ❌ Ambíguo (proibido) | ✅ Algorítmico (obrigatório) |
|---|---|
| "salvar os dados" | "INSERT INTO tabela (campos) VALUES (...) RETURNING id" |
| "notificar o usuário" | "EMIT event 'task.created' via Redis channel 'space:{space_id}'" |
| "validar o input" | "SE name.length < 3 OU name.length > 50: RAISE ValidationError 422" |
| "verificar permissão" | "SE user.role NOT IN ['admin','owner']: RAISE ForbiddenError 403" |
| "processar a mensagem" | "PARA CADA mention EM parse_mentions(content): CRIAR notification{...}" |
| "retornar erro" | "RETURN 404 { error: 'space_not_found', detail: '...' }" |
| "quando apropriado" | "SE author_type == 'agent' E approved_by IS NULL" |
| "dados sensíveis" | "user_id, session_id, empresa_id — NUNCA em URL, NUNCA em console.log" |

---

## INSTRUÇÕES DE USO

### Fluxo padrão (conceito → tasks)

1. Usuário fornece o Conceito Geral do projeto
2. Executar Fase 0 (absorver contexto dos arquivos FBR)
3. Produzir Fase 1 (Algoritmo) e apresentar ao usuário para validação
4. Após validação, produzir Fase 2 (Batches) para aprovação
5. Após aprovação, produzir Fase 3 (Tasks) — um batch de cada vez se o escopo for grande
6. Executar Fase 4 (Checklist) antes de entregar

### Fluxo de task avulsa

Se o usuário pedir uma task específica sem o fluxo completo:
1. Identificar a qual Fluxo Algorítmico a task pertence
2. Perguntar se há Documento de Algoritmo do sistema já criado
3. Se sim, usar como fonte. Se não, extrair o mínimo necessário do conceito disponível
4. Aplicar o template de Task da Fase 3 integralmente

### Fluxo de revisão

Se o usuário apresentar uma task já escrita e pedir revisão:
1. Verificar cada campo obrigatório do template
2. Identificar ambiguidades usando a tabela de linguagem algorítmica
3. Apontar invariantes ausentes
4. Reescrever a task corrigida

---

## REFERÊNCIA RÁPIDA — Parâmetros de Qualidade de Task

Para garantir que 100% do que for codificado está alinhado com o algoritmo:

| Parâmetro | Por quê é obrigatório |
|---|---|
| **Objetivo Algorítmico** (com referência à seção) | Rastreabilidade: toda linha de código tem origem no algoritmo |
| **Input/Output explícito** | Elimina "interpretação" do desenvolvedor sobre o que entra e sai |
| **Especificação Técnica em pseudocódigo** | O desenvolvedor implementa, não decide |
| **Invariantes listadas** | As regras inegociáveis ficam visíveis na task, não só na doc geral |
| **Casos de Borda obrigatórios** | Implementações ingênuas passam no happy path e quebram no edge |
| **Critério de Done binário** | Elimina "achei que estava feito" — passou ou não passou |
| **NÃO FAZER explícito** | Previne scope creep e acoplamento indevido |
| **Dependências explícitas** | Impede task ser executada antes do contrato de integração existir |
