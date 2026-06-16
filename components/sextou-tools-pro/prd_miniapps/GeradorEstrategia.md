Aqui está a especificação completa do mini-app **Gerador de Estratégia de Marketing**, seguindo rigorosamente a skill `software-params-miniapps` da SextouTools PRO.

---

# Mini-App PRD: Gerador de Estratégia de Marketing

## 1. Visão Geral
- **Suite**: SextouTools PRO
- **Slug**: `gerador-estrategia-marketing`
- **Categoria**: Marketing e Vendas
- **Usuário-alvo**: Empreendedores, pequenos negócios e prestadores de serviço que precisam estruturar sua divulgação de forma prática.
- **Dor principal**: Falta de clareza sobre como atrair clientes e se diferenciar da concorrência com recursos limitados.
- **Promessa**: "Receba uma estratégia de marketing clara, personalizada e pronta para aplicar em menos de 2 minutos."

## 2. Resultado Esperado
- **O que o usuário recebe**: Um plano de ação estruturado em 4 blocos principais.
- **Formato da saída**: JSON normalizado e renderizado em cards visuais (Situação Atual, Público-Alvo, Abordagem de Rede Social, Estratégia Geral).
- **Ações disponíveis**: Copiar tudo, Salvar como favorito, Gerar novamente (reprocessar), Abrir no histórico.

## 3. Fluxo Mobile-First
1. **Entrada**: Usuário logado acessa o card do mini-app no dashboard.
2. **Hero**: Nome, promessa em 1 frase e badge "Histórico salvo".
3. **Coach Tip**: *"Preencha com a realidade atual do seu negócio para receber as melhores sugestões."*
4. **Formulário Guiado**: 4 dropdowns obrigatórios + 1 campo de texto opcional.
5. **Validação**: Sistema verifica campos obrigatórios no client-side.
6. **Geração**: Estado de loading amigável (*"Analisando seu mercado e montando sua estratégia..."*).
7. **Resultado**: Exibição em cards com botões de ação (Copiar, Favoritar, Regenerar).
8. **Histórico**: Registro salvo automaticamente e acessível na aba "Meus Resultados".

## 4. Campos do Formulário
| Campo | Tipo | Obrigatório | Opções / Observação |
|---|---|---|---|
| `business_type` | Dropdown | Sim | Produto físico, Serviço, Infoproduto, SaaS, Alimentação, Outro |
| `current_acquisition` | Dropdown | Sim | Indicação (Boca a boca), Tráfego pago, Redes sociais orgânicas, Porta a porta, Nenhuma |
| `competition_level` | Dropdown | Sim | Baixa (Poucos concorrentes), Média, Alta, Muito Alta (Mercado saturado) |
| `current_marketing` | Dropdown | Sim | Instagram/Facebook, WhatsApp, Site/Blog, Panfletos/Offline, Nenhuma |
| `specific_context` | Textarea | Não | Placeholder: *"Ex: Tenho pouco orçamento e foco em vendas na minha cidade."* (Max 500 chars) |

## 5. Dropdowns e Presets
- **Dropdowns obrigatórios**: Todos os campos principais (evita campo livre excessivo).
- **Presets visuais**: Ícones ao lado das opções do dropdown (ex: 📱 para Redes Sociais, 🗣️ para Indicação).
- **Exemplos clicáveis**: No campo `specific_context`, chips como "Orçamento zero", "Foco local", "Vendas B2B".

## 6. Regras de Autenticação
- **Exigir login**: Sim, obrigatório.
- **Estado não logado**: Tela de bloqueio amigável: *"Entre para usar esta ferramenta e manter seu histórico de estratégias salvo."* com CTAs `Entrar` e `Criar conta gratuita`.
- **Sessão expirada**: Redirecionar para login com mensagem *"Sua sessão expirou. Faça login para continuar."*
- **Sem chamada OpenRouter** sem token de sessão válido.

## 7. Histórico
- **Título automático**: `"Estratégia para {business_type} - {created_at}"`
- **Dados salvos**: `input_payload`, `output_payload`, `model_id`, `model_context_length`, `prompt_tokens`, `completion_tokens`, `status`, `favorited`.
- **Ações disponíveis**: Ver lista, abrir execução anterior, copiar resultado, duplicar execução (preenche o formulário com os dados antigos), favoritar, apagar.

## 8. LLM (OpenRouter)
- **Provider**: OpenRouter (Server-side apenas).
- **Modelo**: Gratuito, selecionado dinamicamente.
- **Ordenação**: Maior `context_length` para menor (filtrando `pricing.prompt === 0`, `pricing.completion === 0`, `pricing.request === 0`).
- **Max tokens**: 900
- **Temperature**: 0.4
- **Response format**: `{ "type": "json_object" }`
- **Fallback**: Se o modelo 1 falhar, tentar o modelo 2 da lista ordenada. Máximo de 2 tentativas.

## 9. Prompt Contract
**System Prompt**:
```text
Você é um assistente da SextouTools PRO. Sua tarefa é executar apenas o mini-app: Gerador de Estratégia de Marketing.
Responda sempre em português brasileiro. Use linguagem clara, profissional, motivadora e útil para empreendedores.
Não inclua explicações internas, não exponha raciocínio oculto e não use markdown fora do JSON.
Responda SOMENTE no formato JSON solicitado abaixo.
```

**JSON Schema Esperado**:
```json
{
  "current_situation": "Análise breve e empática da situação atual baseada nos inputs.",
  "target_audience_suggestion": "Definição clara de 1 ou 2 perfis de público-alvo ideais.",
  "social_media_approach": "Sugestão prática de qual rede usar e que tipo de conteúdo postar.",
  "strategy_suggestion": "Plano de ação em 3 passos simples e de baixo custo para implementar agora."
}
```

## 10. Estados de UI
- **Empty State**: Ilustração leve + *"Preencha os dados acima para gerar sua primeira estratégia."*
- **Loading**: *"Criando sua resposta... Estamos organizando as melhores ideias para o seu negócio."* (Com barra de progresso amigável).
- **Success**: Cards com os 4 blocos de resultado, bordas arredondadas (`--r-xl`), botão CTA gradiente (`--grad-brand`) para "Copiar Tudo".
- **Error (Rate Limit)**: *"Demanda alta no momento. Tente novamente em alguns segundos. Sua tentativa não foi perdida."*
- **Error (Model)**: *"Não conseguimos gerar com o primeiro modelo. Vamos tentar outro disponível."*
- **Error (Final)**: *"Não foi possível concluir agora. Salvamos sua tentativa e você pode tentar novamente em instantes."*

## 11. Critérios de Aceite (Checklist)
- [ ] Usuário não logado é bloqueado com tela amigável e não aciona a API.
- [ ] Usuário logado consegue preencher o formulário e gerar o resultado.
- [ ] O resultado é salvo na tabela `mini_app_runs` com status `completed`.
- [ ] O histórico pode ser reaberto e o formulário é preenchido com os dados antigos (duplicar).
- [ ] A interface usa o Design System v2 (tema escuro, tokens de cor, `Bricolage Grotesque` para títulos, `Inter` para corpo).
- [ ] O app é totalmente responsivo e mobile-first (alvos de toque ≥ 48px, CTA ≥ 54px).
- [ ] Dropdowns são usados em todos os campos previsíveis.
- [ ] A chamada ao OpenRouter é feita exclusivamente no back-end (API key protegida).
- [ ] A seleção de modelo usa a função `getFreeModelsByContextLength()` com fallback.
- [ ] A saída do LLM é validada como JSON; se falhar, tenta reparar uma vez ou salva como `failed`.

## 12. Riscos e Mitigações
- **Risco de Custo/Rate Limit**: Modelos gratuitos no OpenRouter podem ter limites de requisições por minuto. 
  - *Mitigação*: Implementar `ip_rate_limit` e `user_rate_limit` (máx. 5 gerações/dia para free users no MVP). Cache de catálogo de modelos por 60 minutos.
- **Risco de UX (Input vago)**: O usuário pode escrever um contexto muito longo ou irrelevante.
  - *Mitigação*: Limitar `max_input_chars` a 500 no front-end e instruir o prompt a ignorar ruídos e focar nos dados estruturados dos dropdowns.
- **Risco de Alucinação**: O LLM inventar dados.
  - *Mitigação*: `temperature: 0.4`, `response_format: json_object` e prompt restritivo proibindo invenção de dados não fornecidos.

---

Este PRD está pronto para ser convertido em tarefas de desenvolvimento (Front-end, Back-end e Banco de Dados), garantindo total aderência ao padrão da suite SextouTools PRO. Deseja que eu detalhe o schema SQL ou a implementação da função de seleção de modelos?