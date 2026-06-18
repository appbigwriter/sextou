---
title: "Story 5: Orquestrador Premium de Geração e Agentes de IA"
app: "Clareza - Marketing Strategy Studio"
status: "Done"
priority: "High"
---

# Story 5: Orquestrador Premium de Geração e Agentes de IA

## Contexto
A geração de uma estratégia premium deve ser dividida em múltiplos papéis server-side (agentes operacionais) com fluxos claros de entrada, processamento, revisão de compliance e conformidade com o método. O orquestrador deve encadear a escrita e revisão para garantir a qualidade impecável dos artefatos.

## Requisitos
1. **Orquestrador Server-side**:
   - Endpoint: `/api/storybrand/projects/[id]/generate`
   - O endpoint deve iniciar uma execução premium gravando dados de progresso e latência em `premium_app_runs`.
   - Gerenciar as fases de forma sequencial: `planning → generation (BrandScript + Collateral) → review (Compliance + Quality) → post_processing`.

2. **Agente de Escrita (brandscript_agent e collateral_agent)**:
   - **`brandscript_agent`**: Recebe as respostas da entrevista e gera o BrandScript completo (os 7 elementos mapeados) e o One-Liner (Estrutura: Problema → Solução → Resultado).
   - **`collateral_agent`**: Recebe o BrandScript aprovado e redige os materiais derivados:
     * *Wireframe da homepage StoryBrand*: Copy para as seções canônicas (Header, Apostas, Proposta de valor, Guia, Plano, CTA, Isca digital, Junk drawer).
     * *Isca digital (Lead generator)*: Título, formato proposto e outline dos capítulos/seções da isca.
     * *Sequência de E-mails*: 4 a 6 e-mails de nutrição e 3 a 5 e-mails de vendas, com assuntos e corpos persuasivos.

3. **Agente de Compliance e Qualidade (compliance_agent e quality_agent)**:
   - **`compliance_agent`**: Avalia riscos de promessa exagerada e restrições reguladas. Se o nicho for sensível (finanças, saúde, imigração), injeta avisos legais obrigatórios (`warnings[]`) e sugere ajustes de copy no JSON de retorno.
   - **`quality_agent`**: Executa um checklist rígido. Valida se o cliente permaneceu como herói (e nunca a marca) e se todos os 7 elementos foram preenchidos. Se houver falha metodológica grave, retorna erro sinalizando as correções necessárias.

4. **Persistência de Dados**:
   - Ao final do fluxo (se aprovado), persistir o BrandScript em `sb7_brandscripts` (com incremento de versão, ex: `version = currentVersion + 1`) e o collateral em `sb7_collateral` vinculando ao projeto.

## Critérios de Aceite
- [ ] Orquestrador realiza a execução por fases e persiste logs de execução com sucesso.
- [ ] `brandscript_agent` e `collateral_agent` preenchem fielmente o JSON schema de contrato de prompts.
- [ ] `compliance_agent` e `quality_agent` validam regras de segurança metodológica e regulatória.
- [ ] Arquivos finais e versões gravados no banco de dados com isolamento por usuário garantido.
- [ ] Se o checklist de qualidade falhar, a geração é barrada e solicita re-execução ajustada.
