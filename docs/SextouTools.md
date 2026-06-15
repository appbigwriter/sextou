# Brazilian Business Toolkit — Mini PRDs da Fase 1

## Visão geral

Este PRD descreve as ferramentas que serão criadas na nova area do site "Ferramentas" do portal Sextou.biz

O **Brazilian Business Toolkit**, será o titulo da página e será uma área de ferramentas práticas para empreendedores brasileiros nos Estados Unidos. O foco da Fase 1 é entregar utilidades simples, rápidas e independentes, feitas em JavaScript, sem uso de LLM.

A plataforma deve ser mobile-first, bilíngue no futuro, com interface simples e voltada para empresários de serviços, comércio local, freelancers e pequenos negócios.

Todos os mini-apps precisam ter historico salvo em banco de dados e precisa estar logado para usar os mini-apps.

Apenas usuários cadastrados podem er acesso aos mini-apps.

Todos os mini-apps precisam ter um botão de compartilhar.

Todos os mini-apps precisam ter um botão de voltar para a lista de mini-apps.

Todos os apps precisam obedecer aos padroes gráficos definidos em C:\Projetos\2SextaEmpreendedor\docs\design-system-v2.html

## Padrão comum para todos os módulos

### Stack sugerida

* Frontend: React, Next.js ou Vite
* Linguagem: JavaScript ou TypeScript
* UI: Tailwind CSS
* PDF: jsPDF, pdf-lib ou React PDF
* QR Code: qrcode.react ou biblioteca equivalente
* Persistência inicial:

  * Ferramentas simples: localStorage
  * Ferramentas com histórico/usuário: Supabase, Firebase ou backend Node
* Envio de e-mail: Resend, SendGrid, Mailgun, Amazon SES ou SMTP próprio
* Autenticação: necessária apenas para módulos com histórico, diretório, leads, invoices e projetos

### Regras gerais

* Não usar LLM nesta fase.
* Todas as ferramentas devem funcionar bem no celular.
* Sempre que possível, permitir exportar PDF ou copiar resultado.
* As ferramentas devem ser independentes, mas preparadas para integração futura.
* Campos monetários devem usar USD como padrão.
* Interface inicial em português, com estrutura preparada para inglês.
* Mostrar aviso quando houver conteúdo fiscal, legal ou contábil: “Esta ferramenta é educativa e não substitui contador, advogado ou consultor licenciado.”

---

# 1. Gerador de QR Code

## Objetivo

Criar uma ferramenta simples para gerar QR Codes úteis para empresários, como WhatsApp, website, Google Review, cardápio, localização, cupom, vCard e Wi-Fi.

## Prioridade

Muito alta. Deve ser o primeiro módulo porque é simples, rápido de desenvolver e gera valor imediato.

## Usuário-alvo

Pequenos empresários, restaurantes, prestadores de serviço, profissionais de beleza, lojas, eventos, igrejas, associações e empresas locais.

## Funcionalidades MVP

* Escolher tipo de QR Code:

  * URL
  * WhatsApp
  * Instagram
  * Google Review
  * E-mail
  * Telefone
  * SMS
  * vCard
  * Localização
  * Wi-Fi
  * Texto livre
* Formulário dinâmico conforme o tipo escolhido
* Geração instantânea do QR Code
* Download em PNG
* Download em SVG, se possível
* Botão “copiar conteúdo”
* Preview em tempo real
* Opção de tamanho: pequeno, médio, grande
* Opção de incluir nome/label abaixo do QR Code

## Telas

### Tela principal

* Título: “Gerador de QR Code”
* Seletor de tipo
* Formulário
* Preview do QR Code
* Botões:

  * Gerar
  * Baixar PNG
  * Baixar SVG
  * Limpar

## Campos principais

### URL

* Link

### WhatsApp

* Número com código do país
* Mensagem padrão

### vCard

* Nome
* Empresa
* Cargo
* Telefone
* E-mail
* Website
* Endereço

### Wi-Fi

* Nome da rede
* Senha
* Tipo de segurança

## Regras de negócio

* Validar URLs.
* Normalizar telefone para formato internacional.
* Não salvar dados sensíveis sem consentimento.
* Wi-Fi deve avisar que a senha ficará embutida no QR Code.

## Critérios de aceite

* O usuário consegue gerar um QR Code válido em menos de 30 segundos.
* O QR Code pode ser baixado em PNG.
* O QR Code gerado deve funcionar ao ser escaneado por celular.
* O formulário muda corretamente conforme o tipo escolhido.
* A ferramenta funciona sem login.

## Futuro

* Templates visuais com molduras.
* Logo no centro do QR Code.
* Histórico de QR Codes para membros logados.
* QR Code dinâmico com rastreamento de cliques.

---

# 2. Calculadora de Preço de Serviço

## Objetivo

Ajudar o empresário a calcular o preço correto de um serviço com base em custos, horas, margem, deslocamento, taxas e lucro desejado.

## Prioridade

Muito alta. É uma das ferramentas com maior valor para prestadores de serviço.

## Usuário-alvo

Cleaners, painters, contractors, handymen, designers, social media managers, fotógrafos, consultores, personal trainers, profissionais de beleza, marketing agencies e freelancers.

## Funcionalidades MVP

* Calcular preço sugerido de serviço
* Considerar:

  * Custo de material
  * Horas de trabalho
  * Valor/hora desejado
  * Deslocamento
  * Taxas de cartão
  * Comissão
  * Imposto estimado
  * Margem de lucro
* Mostrar:

  * Custo total
  * Lucro bruto
  * Taxas estimadas
  * Preço mínimo recomendado
  * Preço ideal sugerido
* Permitir salvar ou copiar o resultado
* Permitir exportar resumo em PDF simples

## Telas

### Tela principal

* Dados do serviço
* Custos diretos
* Trabalho/hora
* Taxas e margem
* Resultado final

## Campos

* Nome do serviço
* Custo de material
* Outras despesas
* Horas estimadas
* Valor da hora
* Custo de deslocamento
* Percentual de taxa de cartão
* Percentual de comissão
* Percentual de imposto estimado
* Margem de lucro desejada

## Fórmula base sugerida

Custo base = material + outras despesas + deslocamento + horas x valor/hora

Preço antes de taxas = custo base / (1 - margem desejada)

Preço final = preço antes de taxas ajustado para cobrir cartão, comissão e imposto estimado

## Regras de negócio

* Margens devem ser percentuais de 0 a 90%.
* Valores negativos não devem ser aceitos.
* Mostrar alerta se o preço final for menor que o custo total.
* Mostrar aviso de que impostos são estimativas.

## Critérios de aceite

* O usuário insere os custos e recebe um preço sugerido.
* A ferramenta mostra detalhamento do cálculo.
* A ferramenta funciona sem login.
* O resultado pode ser copiado.
* O layout é simples o suficiente para uso no celular.

## Futuro

* Templates por nicho: cleaning, painting, moving, signs, catering.
* Salvar histórico por usuário.
* Converter cálculo em orçamento.
* Comparar preço mínimo, competitivo e premium.

---

# 3. Calculadora de ROI de Campanha

## Objetivo

Permitir que empresários calculem o retorno de campanhas de marketing, anúncios, panfletos, revista, rádio, eventos, Google Ads, Meta Ads ou indicações.

## Prioridade

Alta. Educa o empresário a medir resultado e ajuda a justificar investimentos em mídia e publicidade.

## Usuário-alvo

Empresas locais, anunciantes, prestadores de serviço, agências, comércios, restaurantes, profissionais liberais e membros que anunciam na comunidade.

## Funcionalidades MVP

* Inserir investimento da campanha
* Inserir leads gerados
* Inserir vendas fechadas
* Inserir ticket médio
* Inserir margem de lucro estimada
* Calcular:

  * Custo por lead
  * Taxa de conversão
  * Receita gerada
  * Lucro estimado
  * ROI
  * ROAS
* Exibir diagnóstico simples:

  * Campanha lucrativa
  * Campanha no zero a zero
  * Campanha com prejuízo

## Telas

### Tela principal

* Dados da campanha
* Métricas de conversão
* Resultado financeiro
* Diagnóstico

## Campos

* Nome da campanha
* Canal: Google, Facebook, Instagram, revista, evento, rádio, indicação, outro
* Investimento total
* Leads gerados
* Vendas fechadas
* Ticket médio
* Margem de lucro estimada

## Fórmulas

Custo por lead = investimento / leads

Taxa de conversão = vendas / leads

Receita = vendas x ticket médio

Lucro estimado = receita x margem

ROI = (lucro estimado - investimento) / investimento x 100

ROAS = receita / investimento

## Regras de negócio

* Evitar divisão por zero.
* Se leads forem zero, não calcular custo por lead.
* Se investimento for zero, não calcular ROI.
* Mostrar explicações curtas para cada métrica.

## Critérios de aceite

* O usuário consegue calcular ROI de uma campanha.
* A ferramenta mostra resultado em números e diagnóstico textual.
* A ferramenta funciona sem login.
* Resultado pode ser copiado ou exportado.
* O cálculo deve ser transparente.

## Futuro

* Comparação entre campanhas.
* Histórico por usuário.
* Gráfico simples de performance.
* Integração com Gerenciador de Leads.

---

# 4. Checklist de Abertura de Empresa

## Objetivo

Guiar empreendedores brasileiros nos EUA em uma sequência educativa de passos para abrir ou organizar um negócio.

## Prioridade

Alta. É uma ferramenta de aquisição de novos membros e gera autoridade para a comunidade.

## Usuário-alvo

Brasileiros que desejam abrir empresa nos EUA, recém-chegados, autônomos, prestadores de serviço e pequenos empresários informais.

## Funcionalidades MVP

* Checklist dividido por etapas
* Marcar tarefas como concluídas
* Salvar progresso localmente
* Exportar checklist em PDF
* Links úteis configuráveis pela administração
* Avisos legais e fiscais
* Modo “começando do zero”
* Modo “já tenho empresa, quero organizar”

## Etapas sugeridas

1. Definir tipo de negócio
2. Escolher nome comercial
3. Escolher estrutura: Sole Proprietor, LLC, Corporation
4. Registrar empresa, quando aplicável
5. Solicitar EIN
6. Abrir conta bancária
7. Verificar licenças locais
8. Verificar sales tax, quando aplicável
9. Contratar seguro, quando necessário
10. Organizar contabilidade
11. Criar invoice e orçamento
12. Criar presença digital
13. Criar Google Business Profile
14. Definir formas de pagamento
15. Criar rotina de controle financeiro

## Telas

### Tela principal

* Introdução
* Seleção de perfil
* Lista de etapas
* Progresso em porcentagem
* Botão exportar PDF

### Tela de detalhe da etapa

* Descrição
* Itens da etapa
* Links úteis
* Campo de observação pessoal

## Dados

* Task ID
* Título
* Descrição
* Categoria
* Status
* Notas do usuário
* Data de conclusão

## Regras de negócio

* Sempre exibir aviso: ferramenta educativa.
* Não recomendar estrutura jurídica definitiva.
* Não coletar documentos pessoais no MVP.
* Progresso deve ser salvo no navegador ou conta do usuário.

## Critérios de aceite

* O usuário consegue marcar itens como concluídos.
* O progresso é salvo.
* O checklist pode ser exportado.
* A ferramenta funciona sem login usando localStorage.
* Usuário logado poderá salvar na conta, se houver backend.

## Futuro

* Checklist por estado.
* Versão em inglês.
* Recomendações de parceiros: contador, advogado, seguro.
* Integração com diretório de serviços profissionais.

---

# 5. Gerador de Orçamento em PDF

## Objetivo

Permitir que membros criem orçamentos profissionais em PDF para enviar a clientes.

## Prioridade

Alta. É uma ferramenta central do fluxo comercial.

## Usuário-alvo

Prestadores de serviço, contractors, designers, agências, limpeza, construção, pintura, beleza, catering, eventos, signs, consultores e pequenos negócios.

## Funcionalidades MVP

* Criar orçamento com dados da empresa
* Adicionar dados do cliente
* Adicionar múltiplos itens
* Calcular subtotal, desconto, taxas e total
* Definir validade do orçamento
* Inserir observações e termos
* Upload de logo
* Exportar PDF
* Salvar rascunho localmente
* Duplicar orçamento, se houver histórico

## Telas

### Lista de orçamentos

* Exibida apenas para usuário logado ou versão com persistência
* Status: draft, sent, approved, rejected, expired

### Criar orçamento

* Dados da empresa
* Dados do cliente
* Itens
* Totais
* Termos
* Preview

### Preview PDF

* Visualização antes de baixar

## Campos

### Empresa

* Nome
* Endereço
* Telefone
* E-mail
* Website
* Logo

### Cliente

* Nome
* Empresa
* E-mail
* Telefone
* Endereço

### Orçamento

* Número
* Data
* Validade
* Itens
* Desconto
* Taxa
* Total
* Observações
* Termos

## Regras de negócio

* Número do orçamento deve ser automático, mas editável.
* Total deve atualizar em tempo real.
* PDF deve ter aparência profissional.
* Orçamentos não enviados podem ficar como draft.
* Para MVP simples, não precisa enviar e-mail.

## Critérios de aceite

* O usuário cria um orçamento com múltiplos itens.
* O total é calculado corretamente.
* O PDF é gerado com layout limpo.
* O logo aparece no PDF.
* O orçamento pode ser baixado.
* Funciona em desktop e mobile.

## Futuro

* Envio por e-mail.
* Assinatura do cliente.
* Aprovação online.
* Conversão automática para invoice.
* Integração com leads.

---

# 6. Gerenciador de Oportunidades — Leads

## Objetivo

Criar um mini-CRM simples para o empresário controlar oportunidades comerciais, follow-ups e status de negociação.

## Prioridade

Média-alta. Deve vir depois das ferramentas simples porque exige autenticação e persistência.

## Usuário-alvo

Empresários que recebem pedidos de orçamento, vendedores, prestadores de serviço, agências, empresas locais e membros da comunidade.

## Funcionalidades MVP

* Criar lead
* Editar lead
* Listar leads
* Buscar lead
* Filtrar por status
* Definir origem do lead
* Definir valor potencial
* Definir próxima ação
* Definir data de follow-up
* Mudar status no funil
* Visualização Kanban
* Converter lead em cliente
* Criar orçamento a partir do lead

## Status do funil

* Novo
* Contatado
* Qualificado
* Orçamento enviado
* Negociando
* Ganho
* Perdido

## Telas

### Dashboard de leads

* Total de leads
* Leads novos
* Leads ganhos
* Valor potencial
* Próximos follow-ups

### Kanban

* Colunas por status
* Drag and drop

### Cadastro de lead

* Dados do contato
* Origem
* Interesse
* Valor estimado
* Notas
* Próxima ação

## Campos

* Nome
* Empresa
* Telefone
* E-mail
* Cidade
* Estado
* Origem
* Serviço/produto de interesse
* Valor potencial
* Status
* Próxima ação
* Data do follow-up
* Notas
* Data de criação
* Data de atualização

## Regras de negócio

* Todo lead pertence a um usuário ou empresa.
* Leads não devem ser públicos.
* Status “Ganho” deve permitir marcar valor final.
* Status “Perdido” deve permitir motivo da perda.
* Follow-up vencido deve aparecer em destaque.

## Critérios de aceite

* Usuário consegue criar e editar leads.
* Usuário consegue mover lead entre status.
* Usuário consegue visualizar leads em lista e Kanban.
* Usuário consegue cadastrar próxima ação.
* Leads ficam salvos após logout.
* Cada usuário só vê seus próprios leads.

## Futuro

* Lembretes por e-mail.
* Integração com WhatsApp.
* Integração com orçamento.
* Relatório de conversão.
* Importação CSV.

---

# 7. Gerador de Invoice com Envio por E-mail

## Objetivo

Permitir que membros criem invoices profissionais, baixem em PDF e enviem por e-mail para clientes.

## Prioridade

Média-alta. É essencial, mas exige backend, envio de e-mail e histórico.

## Usuário-alvo

Prestadores de serviço, freelancers, pequenos negócios, lojas, contractors, designers, profissionais autônomos e empresas locais.

## Funcionalidades MVP

* Criar invoice
* Gerar número automático
* Adicionar cliente
* Adicionar itens
* Calcular subtotal, desconto, taxas e total
* Definir vencimento
* Definir status
* Gerar PDF
* Enviar invoice por e-mail
* Marcar como paga
* Marcar como vencida
* Histórico de envio

## Status da invoice

* Draft
* Sent
* Paid
* Overdue
* Cancelled

## Telas

### Lista de invoices

* Número
* Cliente
* Valor
* Vencimento
* Status
* Ações

### Criar invoice

* Dados da empresa
* Cliente
* Itens
* Valores
* Vencimento
* Mensagem de e-mail

### Preview

* Preview do PDF
* Botão baixar
* Botão enviar por e-mail

## Campos

* Número da invoice
* Empresa emissora
* Cliente
* Data de emissão
* Data de vencimento
* Itens
* Quantidade
* Preço unitário
* Subtotal
* Desconto
* Taxa
* Total
* Notas
* Termos de pagamento
* Status
* Data de envio
* Data de pagamento

## Regras de negócio

* Envio por e-mail exige backend ou serviço externo.
* O PDF deve ser anexado ao e-mail.
* O e-mail deve ter assunto editável.
* A invoice enviada deve mudar status para “Sent”.
* Invoice vencida deve mudar para “Overdue” quando passar da data de vencimento.
* Usuário deve poder marcar manualmente como “Paid”.

## Critérios de aceite

* Usuário cria invoice com múltiplos itens.
* Usuário gera PDF.
* Usuário envia invoice por e-mail.
* Cliente recebe e-mail com PDF anexado ou link.
* Status da invoice é atualizado corretamente.
* Histórico da invoice fica salvo.
* Cada usuário só vê suas próprias invoices.

## Futuro

* Link público de pagamento.
* Integração com Stripe.
* Reminder automático de vencimento.
* Recurring invoices.
* Conversão de orçamento aprovado em invoice.

---

# 8. Gerenciador de Projetos e Tarefas

## Objetivo

Oferecer um gerenciador simples para empresários organizarem projetos, tarefas, prazos e responsáveis.

## Prioridade

Média. É importante para recorrência, mas mais complexo do que calculadoras e geradores.

## Usuário-alvo

Pequenas empresas, equipes de serviço, agências, empresas de construção, limpeza, marketing, eventos e operações locais.

## Funcionalidades MVP

* Criar projeto
* Criar tarefas dentro do projeto
* Definir responsável
* Definir prazo
* Definir prioridade
* Definir status
* Checklist dentro da tarefa
* Comentários simples
* Visualização lista
* Visualização Kanban
* Dashboard de tarefas atrasadas
* Converter lead ganho em projeto

## Status de projeto

* Planejado
* Em andamento
* Pausado
* Concluído
* Cancelado

## Status de tarefa

* A fazer
* Em andamento
* Aguardando
* Concluída

## Telas

### Lista de projetos

* Nome
* Cliente
* Status
* Prazo
* Progresso

### Detalhe do projeto

* Dados do projeto
* Tarefas
* Responsáveis
* Datas
* Notas

### Kanban de tarefas

* Colunas por status

## Campos

### Projeto

* Nome
* Cliente
* Descrição
* Data de início
* Data final
* Status
* Responsável
* Notas

### Tarefa

* Título
* Descrição
* Responsável
* Prioridade
* Status
* Prazo
* Checklist
* Comentários

## Regras de negócio

* Projeto pertence a um usuário ou empresa.
* Tarefas sempre pertencem a um projeto.
* Tarefas atrasadas devem aparecer em destaque.
* Progresso do projeto pode ser calculado por percentual de tarefas concluídas.
* No MVP, permissões podem ser simples: dono e colaboradores.

## Critérios de aceite

* Usuário cria projeto.
* Usuário cria tarefas dentro do projeto.
* Usuário altera status das tarefas.
* Usuário visualiza tarefas atrasadas.
* Usuário acompanha progresso do projeto.
* Dados persistem na conta do usuário.

## Futuro

* Convite de membros da equipe.
* Anexos.
* Calendário.
* Notificações.
* Templates por nicho.
* Integração com invoices e leads.

---

# 9. Diretório de Empresas Brasileiras

## Objetivo

Criar um diretório pesquisável de empresas brasileiras nos EUA, fortalecendo a comunidade e dando visibilidade aos membros.

## Prioridade

Média. Tem alto valor comunitário, mas exige moderação, cadastro, busca e dados públicos.

## Usuário-alvo

Empresas brasileiras, consumidores brasileiros nos EUA, parceiros, anunciantes e membros da comunidade.

## Funcionalidades MVP

* Cadastro de empresa
* Perfil público da empresa
* Categoria
* Cidade e estado
* Telefone
* WhatsApp
* Website
* Redes sociais
* Descrição
* Logo
* Fotos
* Busca por nome
* Filtro por categoria
* Filtro por cidade/estado
* Selo de membro verificado
* Área administrativa para aprovar ou editar listagens

## Categorias iniciais

* Accounting / Taxes
* Immigration Services
* Cleaning
* Construction
* Painting
* Beauty
* Restaurants
* Food / Catering
* Real Estate
* Insurance
* Marketing
* Printing / Signs
* Legal Services
* Health / Wellness
* Education
* Auto Services
* Moving
* Other

## Telas

### Página do diretório

* Busca
* Filtros
* Lista de empresas
* Cards com informações principais

### Perfil da empresa

* Logo
* Nome
* Categoria
* Descrição
* Contatos
* Botão WhatsApp
* Website
* Redes sociais
* Fotos
* Cidade/estado

### Cadastro/edição

* Formulário da empresa
* Upload de logo
* Upload de fotos
* Dados de contato

### Admin

* Empresas pendentes
* Aprovar
* Rejeitar
* Editar
* Destacar empresa

## Campos

* Nome da empresa
* Nome do responsável
* Categoria
* Descrição curta
* Descrição completa
* Cidade
* Estado
* Endereço, opcional
* Telefone
* WhatsApp
* E-mail
* Website
* Instagram
* Facebook
* LinkedIn
* Logo
* Fotos
* Status: pending, approved, rejected, suspended
* Selo: free, member, verified, premium
* Data de criação
* Data de atualização

## Regras de negócio

* Empresas novas entram como “pending”.
* Apenas empresas aprovadas aparecem publicamente.
* Admin pode destacar empresas premium.
* WhatsApp deve ser normalizado com código do país.
* E-mail do responsável não precisa ser público.
* Perfil público deve ter URL amigável.

## Critérios de aceite

* Usuário consegue cadastrar empresa.
* Admin consegue aprovar empresa.
* Empresas aprovadas aparecem no diretório.
* Usuário consegue buscar e filtrar empresas.
* Perfil público exibe dados corretamente.
* Empresas pendentes não aparecem publicamente.

## Futuro

* Avaliações internas.
* Cupons.
* Planos premium.
* Geolocalização.
* Mapa.
* Leads enviados pelo perfil.
* Integração com comunidade e eventos.

---

# Ordem final de prioridade

1. Gerador de QR Code
2. Calculadora de Preço de Serviço
3. Calculadora de ROI de Campanha
4. Checklist de Abertura de Empresa
5. Gerador de Orçamento em PDF
6. Gerenciador de Oportunidades — Leads
7. Gerador de Invoice com Envio por E-mail
8. Gerenciador de Projetos e Tarefas
9. Diretório de Empresas Brasileiras

---

# Estratégia de execução para devs diferentes

## Dev 1 — Ferramentas rápidas sem backend

* Gerador de QR Code
* Calculadora de Preço de Serviço
* Calculadora de ROI de Campanha

## Dev 2 — Documentos e PDF

* Gerador de Orçamento em PDF
* Gerador de Invoice com Envio por E-mail

## Dev 3 — Gestão comercial

* Gerenciador de Oportunidades — Leads
* Gerenciador de Projetos e Tarefas

## Dev 4 — Comunidade e cadastro público

* Diretório de Empresas Brasileiras
* Checklist de Abertura de Empresa

## Recomendação de MVP

Para lançar rápido, os quatro primeiros módulos podem funcionar sem login:

1. QR Code
2. Calculadora de Preço
3. Calculadora de ROI
4. Checklist de Abertura

Depois, o sistema deve introduzir login para salvar histórico, empresas, leads, invoices e projetos.

## Integração futura ideal

O fluxo completo do Brazilian Business Toolkit deve ser:

Lead recebido → orçamento criado → orçamento aprovado → invoice gerada → projeto criado → tarefas acompanhadas → empresa aparece no diretório → campanha medida no ROI → QR Codes usados em marketing.

Essa integração transforma ferramentas isoladas em uma suíte real de gestão para empreendedores brasileiros nos Estados Unidos.
