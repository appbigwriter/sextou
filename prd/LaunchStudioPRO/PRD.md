1. Visão geral
Campo
Valor
Suite
SextouTools PRO Premium
Nome do App
Launch Studio PRO
Slug
launch-studio-pro
Categoria
Marketing & Estratégia de Lançamento
Usuário-alvo
Empreendedores, infoprodutores, coaches, consultores, criadores de conteúdo e donos de pequenos/médios negócios que desejam planejar, estruturar e executar lançamentos de produtos ou serviços usando a metodologia Product Launch Formula™ (PLF) de Jeff Walker.
Dor principal
Empreendedores criam produtos e campanhas no "Marketing da Esperança", sem roteiro de sequência, estímulos mentais, escassez real ou diálogo com o mercado — resultando em baixíssima conversão, listas frias e desperdício de tráfego.
Promessa
Em menos de 20 minutos de entrevista guiada, o usuário recebe um Plano de Lançamento Completo fiel à PLF: cronograma de Pré-Pré → Pré-Lançamento (PLC 1, 2 e 3) → Abertura do Carrinho → Fechamento, com copy pronta, estímulos mentais ativados, escassez desenhada, bônus, objeções respondidas e calendário de e-mails — pronto para ser executado.
Artefato principal
Dossiê de Lançamento (PDF + Markdown + JSON estruturado) contendo: Avatar, Oferta Irresistível, Sequência de Pré-Pré, PLC 1/2/3 com roteiros, Estratégia de Escassez, Cronograma de E-mails, Mapa de Estímulos Mentais, Plano de Lançamento Conjunto (quando aplicável) e Checklist de Execução.
Multiusuário
✅ Sim — cada usuário tem workspace próprio com múltiplos projetos.
Múltiplos projetos
✅ Sim — ilimitado conforme plano (Starter: 3, Pro: 25, Agency: ilimitado).
2. Resultado esperado
Artefatos gerados
Dossiê de Lançamento (PDF profissional, Markdown, JSON, DOCX).
Calendário de execução (CSV/ICS integrável ao Google Calendar).
Pack de e-mails prontos (pré-pré, PLC 1/2/3, abertura, follow-ups, fechamento) — Markdown + HTML.
Scripts de vídeo para PLC 1, 2 e 3 (roteiro palavra-por-palavra).
Página de vendas (HTML/Copy estruturada em blocos).
Plano de Lançamento Conjunto (lista de parceiros-alvo, script de abordagem, estrutura de comissão).
Mapa de estímulos mentais por fase (visualização).
Checklist de execução (Notion/Markdown).
Formatos de exportação
PDF · DOCX · Markdown · JSON · CSV · ICS · HTML · ZIP (pack completo)
Tempo esperado de geração
Entrevista guiada: 8 a 18 minutos.
Geração do dossiê completo: 90 a 180 segundos.
Ações pós-resultado
Copiar · Baixar · Regenerar fase específica · Duplicar projeto · Compartilhar com equipe · Favoritar · Transformar em novo formato · Exportar para Notion/Trello/Asana.
3. Fluxo mobile-first
123456789
4. Campos do formulário
4.1 Briefing inicial (tela 1)
Campo
Tipo
Obrigatório
Observação
Nome do Projeto
Texto curto
✅
Ex: "Lançamento Curso Violão Zero"
Público-Alvo (Avatar resumido)
Texto curto
✅
Ex: "Homens 35-55 que querem tocar violão"
Ideia do Produto & Campanha
Textarea livre
✅
Mínimo 80 caracteres
4.2 Entrevista Multi-Step (10 etapas)
Etapa 1 — Aprofundamento do Avatar
Dores que tiram o sono do avatar
Sonhos e desejos
Medos e objeções antecipadas
Linguagem que o avatar usa (palavras-chave)
Onde o avatar está (canais)
Etapa 2 — A Transformação (Promessa)
Estado atual → Estado desejado
Prazo realista da transformação
Prova da transformação (estudos de caso)
O que acontece se NÃO comprar
Etapa 3 — A Oferta Irresistível
Produto principal (formato, duração, entrega)
Bônus (até 5)
Garantia
Preço âncora vs. preço de lançamento
Formas de pagamento
Etapa 4 — Tipo de Lançamento
Seed Launch™ (começando do zero)
Lançamento Interno (lista própria)
Lançamento Conjunto (parceiros)
Lançamento Perene (evergreen)
Business Launch Formula™ (múltiplas ofertas encadeadas)
Etapa 5 — Sequência de Pré-Pré-Lançamento
Tamanho atual da lista
Canais disponíveis (e-mail, IG, YouTube, etc.)
Top 3 perguntas que o avatar faz antes de comprar
Tom de voz da marca
Etapa 6 — PLC 1 — A Oportunidade ("Por quê?")
Qual a grande oportunidade que o produto abre?
Por que o usuário deveria prestar atenção em você? (autoridade)
Ensinamento rápido que será entregue
Objeções que serão antecipadas
Etapa 7 — PLC 2 — A Transformação ("Quê?")
Estudo de caso ou ensinamento prático
Dica que o avatar pode aplicar HOJE
Objeções que serão quebradas
Etapa 8 — PLC 3 — A Experiência da Propriedade ("Como?")
Como a vida do avatar será após comprar
Guinada suave para a oferta
Escassez inicial
Etapa 9 — Escassez & Fechamento
Tipo de escassez: preço sobe / bônus somem / oferta encerra
Duração da abertura do carrinho (4 a 7 dias)
E-mails de fechamento (últimas 24h)
Etapa 10 — Estímulos Mentais & Parcerias
Estímulos prioritários (multi-select): Autoridade · Reciprocidade · Confiança · Expectativa · Empatia · Eventos · Comunidade · Escassez · Comprovação Social
Pretensão de Lançamento Conjunto (sim/não)
Nicho de parceiros-alvo
5. Configuração de LLMs
Fase
Provedor sugerido
Modelo
Motivo
Fallback
interview_coach
Anthropic
Claude Sonnet
Empatia, condução de entrevista, tom humano
OpenAI GPT-5
planner
OpenAI
GPT-5.1
Decomposição estrutural do plano PLF
Claude Sonnet
copywriter
Anthropic
Claude Opus
Copy persuasiva fiel ao estilo Jeff Walker
Gemini 2.5 Pro
avatar_researcher
Perplexity
sonar-pro
Pesquisa de mercado e dores do avatar
Tavily + GPT-5
objection_handler
Google
Gemini 2.5 Pro
Revisão crítica e quebra de objeções
Claude Sonnet
reviewer
Anthropic
Claude Sonnet
Revisão de fidelidade à PLF
GPT-5
exporter
OpenAI
GPT-5-mini
Geração JSON estruturada para exportação
Claude Haiku
Routing profile: quality_first (o usuário está pagando por estratégia de elite)
Fallback strategy: same_modality_lower_cost
Idioma padrão: pt-BR (com suporte a en-US, es-ES)
6. Agentes operacionais
Agente
Função
Entrada
Saída
interview_agent
Conduz a entrevista multi-step com coach tips
Respostas do usuário
Próximas perguntas + resumos
avatar_agent
Monta perfil profundo do avatar
Briefing + respostas
JSON de avatar
offer_architect
Desenha a oferta irresistível
Respostas etapa 3
Estrutura de oferta + bônus
sequence_planner
Monta PLC 1, 2, 3 + pré-pré + abertura
Briefing completo
Cronograma + roteiros
trigger_mapper
Distribui estímulos mentais em camadas
Tipo de lançamento
Mapa de estímulos por fase
scarcity_designer
Desenha escassez real e consequência negativa
Etapa 9
Estratégia de fechamento
copywriter_agent
Gera e-mails, scripts e página de vendas
Sequência aprovada
Pack de copy
jl_partner_advisor
Sugere parceiros de Lançamento Conjunto
Nicho + avatar
Lista de perfis-alvo + script
fidelity_reviewer
Valida fidelidade à PLF (Jeff Walker)
Dossiê completo
Checklist + ajustes
export_agent
Gera PDF, DOCX, Markdown, ZIP
Dossiê validado
Arquivos finais
7. APIs externas potencializadoras
API
Uso
Obrigatória no MVP?
Custo/Risco
Fallback
Perplexity Sonar
Pesquisa de mercado e avatar
✅
Baixo
Tavily + GPT
Cloudflare R2
Armazenamento de dossiês
✅
Baixo
Supabase Storage
DocRaptor / PDFShift
Geração de PDF profissional
✅
Médio
Puppeteer self-hosted
Resend
Envio do dossiê por e-mail
❌
Baixo
SendGrid
Google Calendar API
Exportar cronograma
❌
Zero
ICS file
Notion API
Exportar checklist
❌
Zero
Markdown
Stripe
Cobrança por plano/créditos
✅
Variável
Paddle
Sentry
Observabilidade
✅
Baixo
Logtail
Regra de escolha: toda API melhora diretamente o artefato final, tem fallback, custo estimado por execução e não expõe chaves ao cliente.
8. Banco de dados
Tabelas base (obrigatórias pela skill base)
users, sessions, mini_apps, mini_app_runs
Tabelas Premium específicas
sql
1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859
RLS: todas as tabelas com política user_id = auth.uid().
Índices: (user_id, status), (project_id, step_number), (dossier_id, version).
9. Prompt contracts
System prompt base
123456789101112131415
Schema JSON de saída (dossiê)
json
12345678910111213141516171819202122232425262728293031323334353637
10. Controle de custo
Item
Valor estimado
Custo por entrevista completa (10 steps)
~$0.18
Custo por geração de dossiê completo
~$0.42
Custo com pesquisa Perplexity
~$0.05
Custo com geração de PDF
~$0.03
Total por projeto completo
~$0.68
Limites por plano:
Starter: 3 projetos/mês, 10 regenerações
Pro: 25 projetos/mês, regenerações ilimitadas
Agency: ilimitado + white-label
Alertas: admin notificado quando custo diário > $50 ou usuário > $20/mês.
11. Segurança e compliance
Dados sensíveis: ideias de negócio, estratégias, preços — tratados como segredo comercial.
Avisos obrigatórios:
"Este plano é estratégico. Resultados dependem de execução, mercado e audiência."
"Não há garantia de faturamento específico. Números do livro são ilustrativos."
Revisão humana: recomendada para lançamentos em nichos regulados (saúde, finanças, jurídico).
Retenção: usuário pode apagar projeto a qualquer momento (soft delete + hard delete em 30 dias).
API keys: apenas no servidor, nunca em logs ou artefatos exportáveis.
Rate limit: 5 gerações simultâneas por usuário.
12. Critérios de aceite
Produto
App pertence à suite SextouTools PRO Premium
Gera dossiê de lançamento utilizável (PDF + pack de copy)
Suporta múltiplos projetos por usuário
Multiusuário com RLS
Fidelidade total à PLF (Pré-Pré → PLC 1/2/3 → Abertura → Fechamento)
Genérico para qualquer produto/serviço
UX/UI
Mobile-first (Design System v2)
Briefing inicial com apenas 3 campos
Entrevista multi-step com coach tips
Preview por abas antes de gerar
Momento de celebração na entrega
Histórico e versionamento
LLM e agentes
Múltiplos provedores (OpenAI, Anthropic, Google, Perplexity)
Roteamento por fase
Fallback automático
Prompt contracts separados por agente
Revisão de fidelidade à PLF automática
Banco e histórico
Salva projeto, entrevista, dossiê, fases, estímulos
Versionamento de dossiês
RLS por usuário
Segurança
Nenhuma API key no client
Logs sanitizados
Avisos de compliance visíveis
Rate limit ativo
Compatibilidade com agentes
Codex, Claude Code e Antigravity conseguem implementar
Skill escrita em Markdown com frontmatter
Tarefas quebradas em passos verificáveis