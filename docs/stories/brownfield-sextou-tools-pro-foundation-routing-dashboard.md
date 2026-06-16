# Story: SextouTools PRO - Foundation 1 - Routing, Catalogo e Dashboard

<!-- Source: docs/SextouTools_PRO_PRD.md + docs/design-system-v2.html + docs/stories/brownfield-sextou-tools-brazilian-business-toolkit.md + codebase atual -->
<!-- Context: Brownfield foundation para introduzir SextouTools PRO com discovery publico, dashboard autenticado e paginas independentes por app -->

**Status:** Draft  
**Priority:** High  
**Last Updated:** 2026-06-15

---

## Story

As a visitante ou membro cadastrado,  
I want encontrar o `SextouTools PRO` com landing publica, dashboard autenticado e uma pagina propria para cada app,  
so that eu consiga descobrir a suite e navegar por mini-apps independentes sem ambiguidade.

---

## Existing System Integration

- O projeto ja possui base funcional em `app/sextou-tools/` com `layout.tsx`, hub e rota dinamica por `slug`.
- O `PRO` deve seguir o mesmo principio estrutural do pacote anterior: cada app com pagina propria e independente.
- O shell visual existente em `components/sextou-tools/tool-shell.tsx` e o `ToolkitHeader` podem ser reaproveitados como referencia.

---

## Acceptance Criteria

1. O `SextouTools PRO` possui landing/hub visivel para visitantes com descricao dos apps, exemplos publicos e CTA de cadastro/login.
2. O `SextouTools PRO` possui dashboard autenticado com saudacao personalizada, resumo de uso do dia, cards dos apps, historico recente e recomendacoes basicas.
3. Cada app do MVP Core possui rota propria e independente.
4. O catalogo do `PRO` e separado do catalogo do pacote anterior.
5. O design system permanece o mesmo do pacote anterior.
6. O pacote atual `Sextou Tools` continua funcionando sem regressao de navegacao e auth.

---

## Dev Technical Guidance

### Integration Approach

- Criar namespace proprio para o `PRO`, com pagina indice e rota individual por app.
- Evitar concentrar todos os apps em um unico componente gigante; a pagina dinamica deve apenas resolver o slug e delegar para um componente por app.
- Registrar os 5 apps do MVP Core como entradas `live` no catalogo do `PRO`.

### Technical Constraints

- Cada app precisa de pagina propria e independente.
- Login continua obrigatorio para gerar.
- Visitantes podem explorar a landing e a lista de apps, mas nao gerar conteudo.

---

## Tasks / Subtasks

- [ ] Definir namespace do `SextouTools PRO`
- [ ] Criar landing/hub publico da suite
- [ ] Criar dashboard autenticado do `PRO`
- [ ] Criar catalogo separado do `PRO`
- [ ] Criar a infraestrutura de roteamento para pagina individual por app
- [ ] Registrar os 5 apps do MVP Core no dashboard
- [ ] Validar regressao da navegacao do pacote anterior

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** misturar discovery do `PRO` com o pacote anterior e gerar confusao de navegação.
- **Mitigation:** separar namespace, catalogo e copy do `PRO`.
- **Verification:** smoke test na suite antiga e na nova.

### Rollback Plan

1. Remover namespace e menu do `PRO`.
2. Preservar intacto o namespace do pacote anterior.

---

## Definition of Done

- [ ] Landing/hub publico pronto
- [ ] Dashboard autenticado pronto
- [ ] Cada app com rota propria e independente
- [ ] Catalogo do `PRO` separado
- [ ] Navegacao antiga validada sem regressao

