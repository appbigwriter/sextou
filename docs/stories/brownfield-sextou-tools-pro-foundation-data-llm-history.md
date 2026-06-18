# Story: SextouTools PRO - Foundation 2 - Dados, Historico e Infra de LLM

<!-- Source: docs/SextouTools_PRO_PRD.md + codebase atual -->
<!-- Context: Brownfield foundation para persistencia estruturada, limites de uso e pipeline compartilhado de geracao -->

**Status:** Ready for Review  
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

- [x] Modelar tabelas/entidades do `PRO` para geracoes, prompts e limites
- [x] Criar migration aditiva
- [x] Criar servico compartilhado de geracao
- [x] Criar builder de prompt versionado por app
- [x] Criar camada de validacao de input/output
- [x] Criar logica de favoritos, arquivamento, exclusao logica e duplicacao
- [x] Criar logica de uso diario e regeneracao
- [x] Validar compatibilidade retroativa no banco

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

## File List

- [prisma/schema.prisma](/abs/path/C:/Projetos/2SextaEmpreendedor/prisma/schema.prisma:1)
- [prisma/migrations/20260616093000_add_sextou_tools_pro_foundation/migration.sql](/abs/path/C:/Projetos/2SextaEmpreendedor/prisma/migrations/20260616093000_add_sextou_tools_pro_foundation/migration.sql:1)
- [lib/sextou-tools-pro/catalog.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/catalog.ts:1)
- [lib/sextou-tools-pro/generation.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/generation.ts:1)
- [lib/sextou-tools-pro/history.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/history.ts:1)
- [lib/sextou-tools-pro/metadata.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/metadata.ts:1)
- [lib/sextou-tools-pro/prompts.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prompts.ts:1)
- [lib/sextou-tools-pro/schemas.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/schemas.ts:1)
- [lib/sextou-tools-pro/usage.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/usage.ts:1)
- [lib/sextou-tools-pro/prisma-guards.ts](/abs/path/C:/Projetos/2SextaEmpreendedor/lib/sextou-tools-pro/prisma-guards.ts:1)
