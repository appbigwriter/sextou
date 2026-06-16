# PRD — SextouTools PRO

**Versão:** 1.0  
**Data:** 15 de junho de 2026  
**Produto:** SextouTools PRO  
**Formato:** Suite de mini-apps gratuitos para empreendedores cadastrados  
**Status:** Proposta para MVP  

---

## 1. Visão geral

O **SextouTools PRO** é uma suite de mini-apps gratuitos, criada para ajudar pequenos empreendedores, freelancers, prestadores de serviço, negócios locais e criadores a resolverem tarefas comerciais do dia a dia com IA leve.

A proposta não é oferecer um “chat genérico com IA”, mas sim ferramentas objetivas, rápidas e guiadas, cada uma com um formulário simples, resposta estruturada, histórico salvo e possibilidade de copiar, editar, reaproveitar ou transformar o resultado em uma próxima ação comercial.

Todos os mini-apps serão acessíveis **apenas para membros cadastrados**. O cadastro gratuito é parte central da estratégia, pois permite histórico, personalização, limite justo de uso, recuperação de resultados e criação de funis para serviços pagos.

---

## 2. Objetivos do produto

### 2.1 Objetivo principal

Criar uma plataforma gratuita de alta utilidade para empreendedores, com 15 mini-apps baseados em IA leve, capazes de gerar materiais comerciais, estratégicos e operacionais em poucos segundos.

### 2.2 Objetivos de negócio

- Aumentar aquisição de membros cadastrados.
- Gerar recorrência de uso por meio de histórico e reaproveitamento de conteúdos.
- Capturar sinais de intenção comercial dos usuários.
- Criar portas de entrada para serviços pagos da empresa, como design, tráfego, automação, sites, branding, social media, CRM e consultoria.
- Posicionar a marca como um ecossistema de ferramentas práticas para empreendedores.

### 2.3 Objetivos do usuário

- Criar rapidamente textos, ideias, propostas e campanhas.
- Economizar tempo em tarefas comerciais repetitivas.
- Melhorar comunicação com clientes.
- Organizar ideias de negócio sem precisar entender de marketing, copywriting ou tecnologia.
- Manter um histórico de tudo que foi gerado.

---

## 3. Público-alvo

### 3.1 Perfil principal

Empreendedores pequenos e médios, especialmente:

- Prestadores de serviço.
- Negócios locais.
- Profissionais autônomos.
- Pequenas empresas familiares.
- Criadores e produtores de conteúdo.
- Imigrantes empreendedores.
- Profissionais que vendem por WhatsApp, Instagram, Google Business Profile e indicações.

### 3.2 Dor central

O usuário sabe o que vende, mas tem dificuldade para transformar isso em comunicação clara, posts, propostas, respostas comerciais, campanhas, roteiros e ofertas.

---

## 4. Princípios do produto

1. **Uma tarefa por app.** Cada mini-app resolve uma dor específica.
2. **Formulário antes de chat.** O usuário responde campos simples; a IA entrega o resultado.
3. **IA invisível.** O foco é o resultado, não a conversa com o modelo.
4. **Histórico obrigatório.** Toda geração fica salva por usuário e por app.
5. **Mobile-first.** A maioria dos usuários deve conseguir usar tudo pelo celular.
6. **Leve por padrão.** Uma chamada principal de LLM por geração sempre que possível.
7. **Gratuito com limites inteligentes.** O acesso é gratuito para membros cadastrados, com controle de uso.
8. **Design system único.** Todos os apps seguem a mesma identidade visual, componentes e padrões de UX.
9. **Resultado acionável.** Toda saída deve ter botões como copiar, salvar, editar, regenerar e transformar em próxima ação.
10. **Caminho para monetização indireta.** Cada app pode sugerir serviços complementares sem bloquear o uso gratuito.

---

## 5. Acesso, autenticação e membros

### 5.1 Regra de acesso

Todos os mini-apps do SextouTools PRO devem exigir autenticação.

Usuários não logados podem ver:

- Landing page da suite.
- Lista dos mini-apps.
- Descrição de benefícios.
- Exemplos públicos de resultado.
- CTA para cadastro/login.

Usuários logados podem:

- Usar todos os mini-apps gratuitos.
- Ver histórico completo.
- Favoritar resultados.
- Editar e reutilizar entradas anteriores.
- Copiar, exportar ou compartilhar resultados.
- Acessar recomendações personalizadas de próximos passos.

### 5.2 Tipos de membro no MVP

| Tipo | Descrição |
|---|---|
| Visitante | Pode explorar a landing page, mas não gera conteúdo. |
| Membro gratuito | Pode usar os 15 mini-apps com limites diários. |
| Admin | Gerencia apps, prompts, limites, usuários, histórico e métricas. |

### 5.3 Cadastro recomendado

- Nome.
- E-mail.
- Senha ou login social.
- Tipo de negócio.
- Idioma preferencial.
- País/cidade opcional.
- Segmento de atuação.

### 5.4 Onboarding mínimo

Após cadastro, o usuário responde:

1. Qual é o tipo do seu negócio?
2. O que você vende?
3. Quem é seu cliente ideal?
4. Qual canal você mais usa para vender? WhatsApp, Instagram, Google, indicação, loja física ou outro.
5. Qual idioma prefere para gerar conteúdos?

Essas respostas alimentam valores padrão dos mini-apps, reduzindo fricção.

---

## 6. Histórico obrigatório

### 6.1 Conceito

Todo resultado gerado dentro do SextouTools PRO deve criar um registro no histórico do usuário.

O histórico não é apenas uma lista de outputs. Ele deve funcionar como uma biblioteca de materiais comerciais reaproveitáveis.

### 6.2 Funcionalidades do histórico

Cada geração deve permitir:

- Visualizar resultado.
- Ver data e horário.
- Ver app usado.
- Ver campos de entrada usados.
- Copiar resultado.
- Editar entrada e gerar nova versão.
- Duplicar geração.
- Favoritar.
- Arquivar.
- Excluir.
- Marcar como usado.
- Adicionar nota manual.

### 6.3 Filtros do histórico

- Por app.
- Por data.
- Por favoritos.
- Por status: rascunho, usado, arquivado.
- Por canal: WhatsApp, Instagram, Google, proposta, campanha etc.
- Por idioma.

### 6.4 Dados mínimos de cada geração

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "app_id": "offer_generator",
  "title": "Oferta para serviço de limpeza residencial",
  "input_data": {},
  "output_data": {},
  "output_text": "",
  "language": "pt-BR",
  "model": "gemma-4-light",
  "prompt_version": "1.0.0",
  "status": "active",
  "is_favorite": false,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## 7. Estratégia de IA leve

### 7.1 Premissa

A suite deve ser desenhada para rodar com uso leve de LLM, priorizando modelos pequenos, prompts curtos, saídas estruturadas e custo previsível.

### 7.2 Padrão de execução

Cada mini-app deve seguir o fluxo:

1. Usuário preenche formulário curto.
2. Backend valida e normaliza entradas.
3. Prompt fixo é montado com base no app.
4. LLM retorna JSON estruturado.
5. Backend valida o JSON.
6. Interface renderiza o resultado em componentes próprios.
7. Histórico é salvo.

### 7.3 Regras para manter custo baixo

- Evitar chat aberto no MVP.
- Limitar tamanho de entrada por campo.
- Limitar saída máxima por app.
- Usar templates fixos.
- Fazer cálculos fora da LLM sempre que possível.
- Usar cache para entradas similares.
- Salvar prompt versionado.
- Retornar JSON e não texto livre sempre que possível.
- Usar apenas uma chamada principal por geração.
- Criar botão “melhorar resultado” como segunda chamada opcional, não automática.

### 7.4 Saída em JSON

Exemplo de resposta padrão:

```json
{
  "title": "Oferta de lançamento para consultoria",
  "summary": "Resumo curto do resultado",
  "sections": [
    {
      "heading": "Oferta principal",
      "content": "Texto final da oferta"
    }
  ],
  "cta": "Copiar e enviar no WhatsApp",
  "next_actions": [
    "Criar post para Instagram",
    "Transformar em proposta comercial",
    "Gerar follow-up"
  ]
}
```

---

## 8. Design system obrigatório

Todos os mini-apps devem usar o mesmo design system padrão da empresa, baseado no arquivo anexado `design-system-v2.html`.

### 8.1 Direção visual

- Tema escuro como padrão.
- Interface mobile-first.
- Visual moderno, energético e amigável.
- Gradiente de marca usado com parcimônia.
- Linguagem visual voltada para usuários leigos.
- Uma decisão por tela sempre que possível.

### 8.2 Tokens principais

| Categoria | Token/Valor |
|---|---|
| Background | `#0D0D0D` |
| Surface | `#171717` |
| Surface 2 | `#1F1F1F` |
| Surface 3 | `#2A2A2A` |
| Texto principal | `#F0EDE6` |
| Texto secundário | `#A09D97` |
| Vermelho ação | `#FF3D57` |
| Laranja mídia | `#FF8C00` |
| Verde sucesso | `#1FBA7A` |
| Amarelo atenção | `#FFD600` |
| Azul informação | `#4A9EFF` |
| Roxo voz/criatividade | `#9B6DFF` |
| Gradiente marca | Vermelho `#FF3D57` → Laranja `#FF8C00` |
| Gradiente celebração | Vermelho → Roxo → Azul |

### 8.3 Tipografia

| Uso | Fonte |
|---|---|
| Títulos e display | Bricolage Grotesque |
| Corpo e interface | Inter |
| Dados, custos, timestamps | JetBrains Mono |

### 8.4 Componentes obrigatórios

Todos os mini-apps devem compartilhar:

- Header com marca SextouTools PRO.
- Dashboard de apps.
- Cards de mini-apps.
- Formulários com campos grandes.
- Botão principal com gradiente.
- Botões secundários e ghost.
- Coach tips com dicas simples.
- Empty states amigáveis.
- Friendly errors, sem mensagens técnicas como “HTTP 429”.
- Barra de progresso amigável durante geração.
- Tela de resultado com celebração discreta.
- Histórico por app.
- Badges de status.
- Tags de categoria.
- Cards de resultado.
- Ações rápidas: copiar, salvar, editar, regenerar.

### 8.5 Microcopy

A linguagem deve evitar termos técnicos. Exemplos:

- Em vez de “prompt enviado”, usar “Criando sua resposta”.
- Em vez de “erro de inferência”, usar “Não conseguimos gerar agora”.
- Em vez de “limite excedido”, usar “Você usou suas gerações de hoje”.
- Em vez de “payload inválido”, usar “Revise os campos destacados”.

---

## 9. Arquitetura sugerida para MVP

### 9.1 Frontend

- Next.js ou React.
- Tailwind ou CSS tokens baseado no design system.
- Componentes reutilizáveis por app.
- Rotas protegidas para membros.
- Layout mobile-first.

### 9.2 Backend

- API para autenticação, geração, histórico e administração.
- Supabase Auth ou equivalente.
- Banco Postgres com RLS.
- Serviço de inferência para chamadas ao modelo.
- Versionamento de prompts.

### 9.3 Entidades principais

```txt
users
profiles
apps
generations
generation_inputs
generation_outputs
prompt_templates
usage_limits
favorites
tags
admin_logs
```

### 9.4 Tabelas mínimas

#### apps

| Campo | Tipo | Descrição |
|---|---|---|
| id | text | Identificador do app |
| name | text | Nome público |
| description | text | Descrição curta |
| category | text | Categoria |
| is_active | boolean | Se está disponível |
| icon | text | Emoji ou ícone |
| sort_order | integer | Ordem no dashboard |

#### generations

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | ID da geração |
| user_id | uuid | Dono do registro |
| app_id | text | Mini-app usado |
| title | text | Título da geração |
| input_data | jsonb | Campos enviados |
| output_data | jsonb | Saída estruturada |
| output_text | text | Texto renderizado |
| model | text | Modelo usado |
| prompt_version | text | Versão do prompt |
| is_favorite | boolean | Favorito |
| status | text | active, archived, deleted |
| created_at | timestamp | Criação |
| updated_at | timestamp | Atualização |

---

## 10. Limites gratuitos sugeridos

Como todos os apps são gratuitos para membros cadastrados, o produto precisa de limites claros.

### 10.1 Limite inicial

- 5 gerações por dia por membro.
- Máximo de 2 regenerações por resultado.
- Histórico ilimitado no MVP, com possibilidade futura de limite por plano.
- Campos com limite de caracteres.
- Saídas curtas por padrão.

### 10.2 Liberação extra

Possibilidades futuras:

- Créditos extras por indicação.
- Créditos extras por completar perfil.
- Créditos extras por compartilhar ferramenta.
- Créditos extras por assinar newsletter.

---

# 11. Mini-PRDs dos 15 apps

---

## App 01 — Diagnóstico Express do Negócio

### Objetivo

Ajudar o empreendedor a entender rapidamente onde seu negócio está forte, onde está fraco e quais próximos passos deve priorizar.

### Usuário-alvo

Empreendedores que sentem que estão vendendo pouco, comunicando mal ou sem clareza sobre o que melhorar primeiro.

### Entrada do usuário

- Nome do negócio.
- Tipo de negócio.
- Produto ou serviço principal.
- Público-alvo.
- Canal principal de venda.
- Maior dificuldade atual.
- Faturamento aproximado opcional.
- Cidade/mercado opcional.

### Saída gerada

- Resumo do diagnóstico.
- 3 pontos fortes.
- 3 pontos fracos.
- 3 oportunidades rápidas.
- 3 riscos.
- Plano de ação de 7 dias.
- Sugestão de próximo mini-app a usar.

### Regras de IA leve

- Uma chamada de LLM.
- Saída máxima de 700 palavras.
- Prompt baseado em checklist fixo.
- Não fazer análises financeiras profundas.

### Histórico

Salvar como “Diagnóstico — [nome do negócio]”. Permitir comparar diagnósticos ao longo do tempo.

### Ações pós-resultado

- Criar oferta.
- Criar calendário de conteúdo.
- Criar plano de lançamento.

### Critérios de sucesso

- Usuário completa o formulário em menos de 2 minutos.
- Pelo menos 40% dos usuários clicam em um próximo app após o diagnóstico.

### Fora do escopo MVP

- Benchmark real com concorrentes.
- Análise de dados financeiros.
- Integrações externas.

---

## App 02 — Gerador de Oferta Irresistível

### Objetivo

Transformar um produto ou serviço em uma oferta comercial clara, com benefício, bônus, urgência e chamada para ação.

### Usuário-alvo

Empreendedores que vendem por WhatsApp, Instagram, site, landing page ou atendimento direto.

### Entrada do usuário

- Produto ou serviço.
- Público-alvo.
- Problema que resolve.
- Benefício principal.
- Preço ou faixa de preço opcional.
- Bônus disponível opcional.
- Garantia opcional.
- Tom da comunicação: direto, premium, popular, divertido ou consultivo.

### Saída gerada

- Nome da oferta.
- Headline principal.
- Promessa clara.
- Estrutura da oferta.
- Bônus sugeridos.
- Garantia sugerida.
- Urgência ética.
- CTA para WhatsApp.
- Versão curta para post.

### Regras de IA leve

- Template fixo de oferta.
- Máximo de 5 variações curtas.
- Não gerar promessas enganosas ou garantias absolutas.

### Histórico

Salvar por produto/serviço. Permitir marcar a oferta como “ativa”, “testada” ou “arquivada”.

### Ações pós-resultado

- Criar anúncio local.
- Criar roteiro de Reels.
- Criar proposta comercial.

### Critérios de sucesso

- Taxa alta de cópia do CTA.
- Usuário reutiliza ou regenera oferta para outro canal.

### Fora do escopo MVP

- Teste A/B automatizado.
- Cálculo de margem.
- Publicação direta em canais.

---

## App 03 — Pitch de 30 Segundos

### Objetivo

Criar uma apresentação curta e convincente para o empreendedor explicar o que faz em networking, reuniões, vídeos ou mensagens.

### Usuário-alvo

Profissionais que precisam apresentar seu negócio rapidamente e com clareza.

### Entrada do usuário

- Nome do negócio ou profissional.
- O que vende.
- Para quem vende.
- Problema que resolve.
- Diferencial.
- Tom desejado: profissional, caloroso, direto, sofisticado ou informal.

### Saída gerada

- Pitch de 30 segundos.
- Versão de 10 segundos.
- Versão para WhatsApp.
- Versão para bio curta.
- Frase de encerramento.

### Regras de IA leve

- Saída curta.
- Máximo de 4 versões.
- Sem análise externa.

### Histórico

Salvar como “Pitch — [nome do negócio]”. Permitir favoritar a versão principal.

### Ações pós-resultado

- Criar bio profissional.
- Criar roteiro de vídeo.
- Criar descrição institucional.

### Critérios de sucesso

- Alto uso do botão copiar.
- Usuário salva uma versão favorita.

### Fora do escopo MVP

- Gravação de áudio.
- Treinamento de apresentação em vídeo.

---

## App 04 — Bio Profissional para Instagram, Google e LinkedIn

### Objetivo

Criar bios e descrições comerciais prontas para perfis digitais, com clareza, autoridade e CTA.

### Usuário-alvo

Empreendedores que usam redes sociais e perfis de busca para atrair clientes.

### Entrada do usuário

- Nome do negócio ou profissional.
- Segmento.
- Público-alvo.
- Cidade/região opcional.
- Principal serviço/produto.
- Diferencial.
- Link ou CTA desejado.
- Tom de voz.

### Saída gerada

- Bio curta para Instagram.
- Bio profissional para LinkedIn.
- Descrição para Google Business Profile.
- Headline curta.
- CTA para perfil.
- 5 palavras-chave de posicionamento.

### Regras de IA leve

- Saída curta e estruturada.
- Limites específicos por canal.
- Evitar emojis em excesso, exceto quando o tom permitir.

### Histórico

Salvar por canal. Permitir duplicar para outro canal.

### Ações pós-resultado

- Criar calendário de conteúdo.
- Criar posts de apresentação.
- Criar FAQ do negócio.

### Critérios de sucesso

- Usuário copia pelo menos uma versão.
- Usuário gera mais de uma bio por canal.

### Fora do escopo MVP

- Publicação automática nos perfis.
- Auditoria real de SEO local.

---

## App 05 — Calendário de Conteúdo de 7 Dias

### Objetivo

Gerar uma semana de ideias de conteúdo para redes sociais, com temas, legendas curtas e CTAs.

### Usuário-alvo

Empreendedores que não sabem o que postar ou não têm tempo para planejar conteúdo.

### Entrada do usuário

- Tipo de negócio.
- Produto ou serviço principal.
- Público-alvo.
- Objetivo da semana: vender, educar, engajar, lançar, autoridade ou relacionamento.
- Canal principal: Instagram, Facebook, LinkedIn, TikTok ou WhatsApp Status.
- Tom de voz.

### Saída gerada

- 7 ideias de posts.
- Formato sugerido por dia.
- Legenda curta.
- CTA.
- Ideia visual simples.
- Hashtags opcionais.

### Regras de IA leve

- Exatamente 7 dias.
- Cada item com texto curto.
- Não gerar calendário mensal no MVP.

### Histórico

Salvar como “Calendário — Semana de [data]”. Permitir marcar posts como publicados.

### Ações pós-resultado

- Gerar roteiro de Reels para um dos posts.
- Criar anúncio local.
- Criar resposta para comentários ou leads.

### Critérios de sucesso

- Usuário marca pelo menos um post como usado.
- Usuário volta semanalmente.

### Fora do escopo MVP

- Agendamento automático.
- Integração com Meta, LinkedIn ou TikTok.

---

## App 06 — Roteiro de Reels/Shorts de 30s

### Objetivo

Criar roteiros curtos para vídeos verticais de até 30 segundos, com gancho, desenvolvimento e CTA.

### Usuário-alvo

Empreendedores que precisam gravar vídeos rápidos, mas não sabem estruturar a fala.

### Entrada do usuário

- Tema do vídeo.
- Produto ou serviço.
- Público-alvo.
- Objetivo: vender, educar, gerar autoridade, responder dúvida ou chamar para WhatsApp.
- Tom: energético, educativo, emocional, direto ou premium.
- Duração: 15s, 30s ou 45s.

### Saída gerada

- Gancho inicial.
- Roteiro falado.
- Sugestão de cenas.
- Texto para legenda na tela.
- CTA final.
- Descrição curta para publicar.

### Regras de IA leve

- Limitar duração.
- Retornar estrutura fixa.
- Não gerar storyboard complexo.

### Histórico

Salvar por tema. Permitir marcar como gravado, publicado ou arquivado.

### Ações pós-resultado

- Criar legenda do post.
- Criar oferta associada.
- Criar follow-up para quem respondeu.

### Critérios de sucesso

- Alto uso do botão copiar roteiro.
- Usuário gera mais de um roteiro por semana.

### Fora do escopo MVP

- Geração de vídeo.
- Narração automática.
- Edição de vídeo.

---

## App 07 — Gerador de Anúncios Locais

### Objetivo

Criar textos de anúncios simples para negócios locais, campanhas promocionais e divulgação em canais pagos ou orgânicos.

### Usuário-alvo

Negócios locais que anunciam no Instagram, Facebook, Google, grupos de WhatsApp, panfletos ou mídia comunitária.

### Entrada do usuário

- Nome do negócio.
- Produto ou serviço.
- Cidade/região.
- Público-alvo.
- Oferta ou promoção.
- Diferencial.
- Canal do anúncio.
- CTA.

### Saída gerada

- Texto curto de anúncio.
- Headline.
- Descrição.
- CTA.
- Versão para WhatsApp.
- Versão para panfleto.
- 3 variações de abordagem.

### Regras de IA leve

- Não configurar campanha paga.
- Apenas texto e estrutura.
- Máximo de 3 variações.

### Histórico

Salvar por campanha e canal. Permitir marcar como “em uso”.

### Ações pós-resultado

- Criar plano de lançamento.
- Criar oferta irresistível.
- Criar sequência de follow-up.

### Critérios de sucesso

- Usuário copia mais de uma variação.
- Usuário transforma anúncio em campanha de 48 horas.

### Fora do escopo MVP

- Criação de criativos visuais.
- Configuração de mídia paga.
- Estimativa de orçamento de tráfego.

---

## App 08 — Respostas Prontas para WhatsApp

### Objetivo

Gerar respostas comerciais prontas para situações frequentes de atendimento, vendas, objeções e pós-venda no WhatsApp.

### Usuário-alvo

Empreendedores que atendem clientes diretamente pelo WhatsApp e perdem tempo respondendo sempre as mesmas perguntas.

### Entrada do usuário

- Tipo de negócio.
- Situação da resposta: orçamento, preço, atraso, reclamação, objeção, follow-up, confirmação, pós-venda ou cobrança amigável.
- Tom desejado.
- Informações específicas do caso.
- CTA desejado.

### Saída gerada

- Resposta curta.
- Resposta completa.
- Versão mais simpática.
- Versão mais firme.
- Versão com CTA.

### Regras de IA leve

- Respostas curtas.
- Máximo de 5 versões.
- Evitar linguagem jurídica ou agressiva.

### Histórico

Salvar por situação. Permitir criar uma biblioteca de respostas favoritas.

### Ações pós-resultado

- Salvar como template.
- Criar sequência de follow-up.
- Criar FAQ do negócio.

### Critérios de sucesso

- Uso recorrente.
- Alto número de favoritos.
- Alto número de cópias por geração.

### Fora do escopo MVP

- Integração direta com WhatsApp.
- Envio automático de mensagens.
- Chatbot completo.

---

## App 09 — Follow-up Comercial em 5 Mensagens

### Objetivo

Criar uma sequência curta de mensagens para recuperar leads, acompanhar orçamentos e aumentar conversão.

### Usuário-alvo

Empreendedores que enviam propostas ou orçamentos e não sabem como retomar contato sem parecer insistentes.

### Entrada do usuário

- Produto ou serviço vendido.
- Situação do lead.
- Tempo desde o último contato.
- Objeção conhecida opcional.
- Tom: leve, profissional, urgente, consultivo ou amigável.
- Canal: WhatsApp, e-mail, Instagram DM ou ligação.

### Saída gerada

- 5 mensagens de follow-up.
- Intervalo sugerido entre mensagens.
- CTA de cada mensagem.
- Versão curta da primeira mensagem.
- Mensagem final de encerramento elegante.

### Regras de IA leve

- Estrutura fixa de 5 mensagens.
- Não insistir de forma abusiva.
- Linguagem ética e respeitosa.

### Histórico

Salvar sequência por lead/campanha. Permitir marcar mensagens como enviadas manualmente.

### Ações pós-resultado

- Criar resposta para objeção.
- Criar proposta comercial.
- Criar oferta melhorada.

### Critérios de sucesso

- Usuário marca mensagens como enviadas.
- Usuário retorna para gerar novas sequências.

### Fora do escopo MVP

- CRM completo.
- Envio automático.
- Rastreamento real de abertura.

---

## App 10 — Proposta Comercial One-Page

### Objetivo

Gerar uma proposta comercial simples, clara e profissional em uma página, pronta para copiar, revisar e enviar ao cliente.

### Usuário-alvo

Prestadores de serviço, freelancers, agências pequenas, consultores e empresas que precisam enviar propostas rápidas.

### Entrada do usuário

- Nome do cliente opcional.
- Nome do negócio/profissional.
- Serviço ou produto proposto.
- Problema do cliente.
- Escopo.
- Prazo.
- Valor opcional.
- Condições de pagamento opcional.
- Garantias ou observações.

### Saída gerada

- Título da proposta.
- Contexto do cliente.
- Solução proposta.
- Escopo em bullets.
- Prazo.
- Investimento.
- Próximos passos.
- Mensagem de envio por WhatsApp ou e-mail.

### Regras de IA leve

- Saída limitada a uma página textual.
- Sem geração de PDF no MVP inicial.
- Sem cláusulas jurídicas complexas.

### Histórico

Salvar por cliente e serviço. Permitir duplicar proposta para novo cliente.

### Ações pós-resultado

- Criar follow-up da proposta.
- Criar oferta irresistível.
- Criar briefing visual para apresentação.

### Critérios de sucesso

- Usuário copia ou exporta proposta.
- Usuário duplica proposta existente.

### Fora do escopo MVP

- Assinatura digital.
- Contrato jurídico.
- PDF diagramado automático.

---

## App 11 — Briefing de Logo, Site ou Material Gráfico

### Objetivo

Ajudar o empreendedor a organizar as informações necessárias antes de contratar design, site, identidade visual, flyer, anúncio ou material gráfico.

### Usuário-alvo

Empreendedores que precisam pedir um serviço criativo, mas não sabem explicar exatamente o que querem.

### Entrada do usuário

- Tipo de projeto: logo, site, flyer, cartão, banner, mídia social, landing page ou outro.
- Nome do negócio.
- Público-alvo.
- Objetivo do material.
- Estilo desejado.
- Cores preferidas opcional.
- Referências opcionais.
- Informações obrigatórias que devem aparecer.

### Saída gerada

- Briefing organizado.
- Objetivo do projeto.
- Público-alvo.
- Mensagem principal.
- Direção visual.
- Conteúdo obrigatório.
- Perguntas pendentes.
- Checklist para enviar ao designer/agência.

### Regras de IA leve

- Organizar dados fornecidos.
- Gerar perguntas pendentes.
- Não criar identidade visual completa.

### Histórico

Salvar por tipo de projeto. Permitir transformar briefing em solicitação de orçamento.

### Ações pós-resultado

- Solicitar serviço pago.
- Criar proposta.
- Criar anúncio local.

### Critérios de sucesso

- Usuário gera briefing e clica em CTA de orçamento.
- Usuário salva briefing como favorito.

### Fora do escopo MVP

- Geração de imagem.
- Criação de logo.
- Wireframe completo de site.

---

## App 12 — FAQ & Objeções do Cliente

### Objetivo

Criar perguntas frequentes e respostas para site, WhatsApp, Google Business Profile, redes sociais e atendimento comercial.

### Usuário-alvo

Empreendedores que recebem dúvidas repetidas e precisam educar melhor seus clientes.

### Entrada do usuário

- Tipo de negócio.
- Produto ou serviço.
- Principais dúvidas conhecidas.
- Principais objeções.
- Tom de resposta.
- Canal de uso.

### Saída gerada

- 10 perguntas frequentes.
- Respostas curtas.
- 5 objeções comuns.
- Respostas para objeções.
- Mensagem curta para WhatsApp.
- Sugestão de uso no site ou perfil.

### Regras de IA leve

- Número fixo de perguntas e objeções.
- Respostas curtas.
- Não inventar políticas específicas que o usuário não informou.

### Histórico

Salvar como FAQ do negócio. Permitir editar e manter como base reutilizável.

### Ações pós-resultado

- Criar respostas de WhatsApp.
- Criar bio/descrição do negócio.
- Criar calendário de conteúdo educativo.

### Critérios de sucesso

- Usuário copia múltiplas respostas.
- Usuário reutiliza FAQ em outro app.

### Fora do escopo MVP

- Publicação automática em site.
- Base de conhecimento conversacional.

---

## App 13 — Precificador Simples de Serviços

### Objetivo

Ajudar o empreendedor a estimar uma faixa de preço para serviços, considerando custo, tempo, margem e percepção de valor.

### Usuário-alvo

Prestadores de serviço e freelancers que têm dificuldade em cobrar corretamente.

### Entrada do usuário

- Serviço oferecido.
- Tempo estimado em horas.
- Custo direto.
- Custo indireto estimado.
- Margem desejada.
- Nível de experiência: iniciante, intermediário, avançado ou premium.
- Complexidade do serviço.
- Valor mínimo aceitável opcional.

### Saída gerada

- Cálculo base.
- Faixa mínima sugerida.
- Faixa recomendada.
- Faixa premium.
- Explicação simples do preço.
- Sugestão de como apresentar o valor ao cliente.
- Alertas sobre preço baixo demais.

### Regras de IA leve

- Cálculos feitos deterministicamente no backend.
- LLM usada apenas para explicar e sugerir apresentação comercial.
- Não dar conselho financeiro formal.

### Histórico

Salvar por serviço. Permitir comparar versões de preço ao longo do tempo.

### Ações pós-resultado

- Criar proposta comercial.
- Criar oferta.
- Criar resposta para objeção de preço.

### Critérios de sucesso

- Usuário ajusta campos e compara cenários.
- Usuário transforma preço em proposta.

### Fora do escopo MVP

- Precificação contábil avançada.
- Impostos por jurisdição.
- Integração com sistemas financeiros.

---

## App 14 — Ideias de Parcerias Locais

### Objetivo

Sugerir parcerias práticas entre negócios locais para gerar indicações, campanhas conjuntas, eventos, combos e oportunidades comerciais.

### Usuário-alvo

Negócios locais que querem crescer por networking, comunidade e colaboração.

### Entrada do usuário

- Tipo de negócio.
- Cidade/região.
- Público-alvo.
- Ticket médio opcional.
- Objetivo: indicações, evento, promoção conjunta, autoridade, lançamento ou comunidade.
- Restrições ou preferências.

### Saída gerada

- 10 ideias de parceiros locais.
- Motivo da parceria.
- Proposta de abordagem.
- Mensagem inicial para contato.
- Ideia de campanha conjunta.
- Próximo passo recomendado.

### Regras de IA leve

- Ideias baseadas em categorias, não em busca real.
- Não listar empresas reais no MVP.
- Saída curta e prática.

### Histórico

Salvar por campanha/parceria. Permitir marcar como contatado, interessado ou arquivado.

### Ações pós-resultado

- Criar mensagem de abordagem.
- Criar anúncio local.
- Criar plano de lançamento.

### Critérios de sucesso

- Usuário copia mensagem de abordagem.
- Usuário marca parceiros como contatados.

### Fora do escopo MVP

- Busca real de empresas locais.
- CRM completo de parcerias.
- Envio automático.

---

## App 15 — Plano de Lançamento em 48 Horas

### Objetivo

Criar um plano rápido para lançar uma promoção, produto, serviço, evento ou campanha em até 48 horas.

### Usuário-alvo

Empreendedores que precisam agir rápido e organizar uma campanha simples sem planejamento complexo.

### Entrada do usuário

- O que será lançado.
- Público-alvo.
- Canal principal.
- Oferta ou benefício.
- Prazo da campanha.
- Recursos disponíveis: WhatsApp, Instagram, lista de clientes, loja física, parceiros, tráfego pago ou outros.
- Tom da campanha.

### Saída gerada

- Checklist das próximas 48 horas.
- Cronograma por etapa.
- Mensagens principais.
- Post de anúncio.
- Mensagem para WhatsApp.
- Ideia de urgência ética.
- Métricas simples para acompanhar.

### Regras de IA leve

- Plano limitado a 48 horas.
- Checklist objetivo.
- Não criar planejamento estratégico longo.

### Histórico

Salvar como campanha. Permitir marcar tarefas como concluídas.

### Ações pós-resultado

- Criar anúncio local.
- Criar roteiro de Reels.
- Criar follow-up da campanha.

### Critérios de sucesso

- Usuário marca tarefas como concluídas.
- Usuário gera mensagens derivadas do plano.

### Fora do escopo MVP

- Gestão completa de projeto.
- Automação de publicação.
- Integração com calendário externo.

---

# 12. Dashboard da suite

## 12.1 Estrutura

O dashboard principal do SextouTools PRO deve exibir:

- Saudação personalizada.
- Resumo de uso do dia.
- Barra de limite gratuito.
- Cards dos 15 mini-apps.
- Atalhos para últimos resultados.
- Histórico recente.
- Apps recomendados com base no perfil do usuário.

## 12.2 Categorias dos apps

| Categoria | Apps |
|---|---|
| Estratégia | Diagnóstico Express, Plano de Lançamento, Parcerias Locais |
| Vendas | Oferta Irresistível, Follow-up, Proposta One-Page, Precificador |
| Comunicação | Pitch, Bio, FAQ, Respostas de WhatsApp |
| Conteúdo | Calendário de 7 Dias, Roteiro de Reels, Anúncios Locais |
| Briefing & Serviços | Briefing de Logo/Site/Material Gráfico |

---

# 13. Fluxo padrão de cada mini-app

```txt
Login obrigatório
→ Dashboard
→ Selecionar mini-app
→ Ver coach tip curto
→ Preencher formulário
→ Gerar resultado
→ Salvar automaticamente no histórico
→ Exibir tela de resultado
→ Ações: copiar, editar, regenerar, favoritar, transformar em outro app
```

---

# 14. Estados de interface

## 14.1 Estado vazio

Usar empty state amigável:

> Você ainda não criou nenhum resultado neste app. Preencha o formulário e gere sua primeira versão em poucos segundos.

## 14.2 Estado de carregamento

Usar progresso amigável:

> Criando sua resposta comercial... isso costuma levar poucos segundos.

## 14.3 Estado de erro

Mensagem amigável:

> Não conseguimos gerar agora. Revise os campos ou tente novamente em alguns instantes.

## 14.4 Estado de limite diário

Mensagem amigável:

> Você usou suas gerações gratuitas de hoje. Volte amanhã ou libere créditos extras completando seu perfil.

---

# 15. Métricas principais

## 15.1 Aquisição

- Visitantes da landing page.
- Taxa de cadastro.
- Origem dos cadastros.

## 15.2 Ativação

- Percentual de membros que geram o primeiro resultado.
- Tempo até primeira geração.
- Mini-app mais usado no primeiro acesso.

## 15.3 Engajamento

- Gerações por usuário por semana.
- Retorno semanal.
- Uso do histórico.
- Favoritos criados.
- Resultados copiados.
- Regenerações.

## 15.4 Conversão indireta

- Cliques em CTAs de serviço.
- Briefings enviados para orçamento.
- Propostas transformadas em pedido de ajuda.
- Usuários que completaram perfil comercial.

---

# 16. Admin

O painel administrativo deve permitir:

- Ativar/desativar mini-apps.
- Editar descrição pública dos apps.
- Gerenciar prompts e versões.
- Ver estatísticas de uso.
- Ver erros de geração.
- Ajustar limites gratuitos.
- Bloquear usuários abusivos.
- Gerenciar categorias.
- Consultar histórico agregado sem expor dados sensíveis indevidamente.

---

# 17. Roadmap sugerido

## Fase 1 — MVP Core

- Autenticação.
- Dashboard.
- Histórico unificado.
- Design system aplicado.
- 5 primeiros apps:
  - Respostas Prontas para WhatsApp.
  - Gerador de Oferta Irresistível.
  - Calendário de Conteúdo de 7 Dias.
  - Proposta Comercial One-Page.
  - Roteiro de Reels/Shorts de 30s.

## Fase 2 — Suite completa

Adicionar os outros 10 apps:

- Diagnóstico Express do Negócio.
- Pitch de 30 Segundos.
- Bio Profissional.
- Gerador de Anúncios Locais.
- Follow-up Comercial em 5 Mensagens.
- Briefing de Logo/Site/Material Gráfico.
- FAQ & Objeções.
- Precificador Simples de Serviços.
- Ideias de Parcerias Locais.
- Plano de Lançamento em 48 Horas.

## Fase 3 — Integrações e monetização

- Exportação PDF para propostas.
- Templates favoritos.
- Compartilhamento público opcional.
- CTA para serviços pagos.
- Créditos por indicação.
- Biblioteca de marca do usuário.
- Integração futura com WhatsApp/CRM.

---

# 18. Critérios gerais de aceite

Para cada mini-app ser considerado pronto:

- Exige login para gerar.
- Usa layout e componentes do design system.
- Tem formulário validado.
- Gera saída estruturada.
- Salva histórico automaticamente.
- Permite copiar resultado.
- Permite regenerar.
- Permite favoritar.
- Permite excluir ou arquivar.
- Usa mensagem de erro amigável.
- Respeita limite diário de uso.
- Registra prompt versionado.
- Funciona bem em celular.

---

# 19. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Custo alto de IA | Prompts curtos, limite diário, cache e JSON estruturado. |
| Usuário gerar conteúdo ruim por entrada fraca | Coach tips, exemplos e campos guiados. |
| Histórico virar bagunça | Filtros, favoritos, tags e arquivamento. |
| Resultado parecer genérico | Usar perfil do usuário como contexto padrão. |
| “PRO” parecer pago | Comunicar “PRO para membros cadastrados — gratuito”. |
| Abuso de uso gratuito | Rate limit, captcha, limite diário e monitoramento. |
| Inconsistência visual | Component library única baseada no design system. |

---

# 20. Posicionamento sugerido

## Headline

**SextouTools PRO — ferramentas gratuitas para empreendedores criarem, venderem e crescerem mais rápido.**

## Subheadline

Crie ofertas, posts, propostas, respostas de WhatsApp, roteiros, anúncios e planos de ação em segundos. Gratuito para membros cadastrados.

## CTA principal

**Criar minha conta grátis**

## CTA secundário

**Ver ferramentas disponíveis**

---

# 21. Conclusão

O SextouTools PRO deve ser construído como uma suite de microferramentas práticas, gratuitas e recorrentes. O valor principal está na combinação de acesso simples, histórico organizado, design consistente e resultados comerciais imediatamente úteis.

A plataforma deve começar com poucos apps de alto uso diário, validar engajamento e depois expandir para a suite completa com 15 ferramentas. O histórico e o cadastro são peças fundamentais para transformar uma coleção de ferramentas gratuitas em um ativo estratégico de relacionamento, dados, recorrência e geração de oportunidades comerciais.
