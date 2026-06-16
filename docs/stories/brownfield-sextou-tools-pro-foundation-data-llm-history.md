# Story: SextouTools PRO - Foundation 2 - Dados, Historico e Infra de LLM

<!-- Source: docs/SextouTools_PRO_PRD.md + codebase atual -->
<!-- Context: Brownfield foundation para persistencia estruturada, limites de uso e pipeline compartilhado de geracao -->

**Status:** Draft  
**Priority:** High  
**Last Updated:** 2026-06-15

---

## Story

As a membro cadastrado do `SextouTools PRO`,  
I want que cada geracao tenha historico estruturado, limite de uso e pipeline padronizado de LLM,  
so that eu possa reutilizar resultados com previsibilidade e baixo custo operacional.

---

## Existing System Integration

- O pacote anterior usa `ToolExecution`, mas o PRD do `PRO` exige semantica mais rica.
- O schema Prisma atual ja suporta extensoes aditivas e nao deve sofrer alteracoes destrutivas.
- O pipeline precisa atender todos os apps do `PRO` de forma compartilhada.

---

## Acceptance Criteria

1. Existe persistencia estruturada do `PRO` por usuario com, no minimo, `app_id`, `title`, `input_data`, `output_data`, `output_text`, `language`, `model`, `prompt_version`, `status`, `is_favorite`, `created_at` e `updated_at`.
2. Existe pipeline compartilhado com: validacao de formulario, builder de prompt fixo, uma chamada principal de LLM, validacao de JSON de saida e persistencia.
3. Existe controle de uso diario com 5 geracoes por dia por membro e 2 regeneracoes por resultado.
4. Existe suporte a favoritar, arquivar, excluir logicamente e duplicar resultados.
5. O schema e as migrations sao aditivas e nao quebram `ToolExecution` nem os dados do pacote anterior.

---

## Dev Technical Guidance

### Integration Approach

- Criar modelos Prisma proprios do `PRO` em vez de sobrecarregar `ToolExecution`.
- Centralizar execucao em um servico unico de `generation`.
- Centralizar definicoes de prompts versionados por app.
- Validar entrada e saida com schema forte antes de persistir.

### Technical Constraints

- Uma chamada principal de LLM por geracao.
- Regeneracao opcional e contabilizada.
- Sem chat aberto no MVP.

---

## Tasks / Subtasks

- [ ] Modelar tabelas/entidades do `PRO` para geracoes, prompts e limites
- [ ] Criar migration aditiva
- [ ] Criar servico compartilhado de geracao
- [ ] Criar builder de prompt versionado por app
- [ ] Criar camada de validacao de input/output
- [ ] Criar logica de favoritos, arquivamento, exclusao logica e duplicacao
- [ ] Criar logica de uso diario e regeneracao
- [ ] Validar compatibilidade retroativa no banco

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** esquema insuficiente para o historico rico do `PRO`.
- **Mitigation:** criar modelos proprios e evitar hacks em `ToolExecution`.
- **Verification:** testes de contrato e migrations em ambiente local.

- **Secondary Risk:** pipeline de LLM produzir resultados inconsistentes entre apps.
- **Mitigation:** JSON estruturado, schemas por app e prompt versionado.
- **Verification:** testes de contrato por app.

### Rollback Plan

1. Reverter migrations aditivas do `PRO` se ainda nao estiverem em producao.
2. Desabilitar endpoints do `PRO` preservando o pacote anterior.

---

## Definition of Done

- [ ] Persistencia estruturada do `PRO` pronta
- [ ] Pipeline compartilhado de LLM pronto
- [ ] Limites e regeneracao funcionando
- [ ] Favoritos, arquivamento, exclusao e duplicacao funcionando
- [ ] Banco anterior validado sem regressao

