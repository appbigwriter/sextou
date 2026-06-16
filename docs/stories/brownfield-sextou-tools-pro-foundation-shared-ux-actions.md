# Story: SextouTools PRO - Foundation 3 - Shell Compartilhado, Microcopy e Acoes Padrao

<!-- Source: docs/SextouTools_PRO_PRD.md + docs/design-system-v2.html + codebase atual -->
<!-- Context: Brownfield foundation para experiencia compartilhada entre mini-apps independentes -->

**Status:** Draft  
**Priority:** High  
**Last Updated:** 2026-06-15

---

## Story

As a usuario do `SextouTools PRO`,  
I want que todos os apps tenham o mesmo shell visual, mesmos estados e mesmas acoes padrao,  
so that eu reconheca a experiencia da suite mesmo mudando de uma pagina independente para outra.

---

## Existing System Integration

- O pacote anterior ja possui `tool-shell`, `history-list` e `share-button` reutilizaveis como referencia.
- O PRD do `PRO` exige acoes padrao em todos os apps e friendly microcopy.
- Cada app tera sua propria pagina, mas a experiencia entre paginas deve ser consistente.

---

## Acceptance Criteria

1. Existe shell compartilhado do `PRO` com header da suite, coach tip, formulario, resultado e historico.
2. Todos os apps do `PRO` suportam as mesmas acoes padrao: copiar, editar, regenerar, favoritar, arquivar, excluir e transformar em proxima acao.
3. Existem estados compartilhados e amigaveis para vazio, carregando, erro e limite diario.
4. O shell compartilhado funciona em paginas proprias e independentes de cada app.
5. O design system continua igual ao pacote anterior.

---

## Dev Technical Guidance

### Integration Approach

- Criar componentes compartilhados do `PRO` e manter o app individual focado no formulario e no schema especifico.
- Garantir que a navegação entre apps independentes mantenha visual e acoes consistentes.
- Preparar placeholders para recomendacoes de proximos apps.

### Technical Constraints

- Friendly microcopy obrigatoria.
- Mobile-first.
- Nenhum app do `PRO` deve precisar reinventar o shell do zero.

---

## Tasks / Subtasks

- [ ] Criar shell compartilhado do `PRO`
- [ ] Criar componentes de coach tip, cards de resultado e badges
- [ ] Criar barra de progresso amigavel durante geracao
- [ ] Criar empty state, error state e limit state padronizados
- [ ] Criar barra/area de acoes padrao compartilhadas
- [ ] Validar navegacao entre paginas independentes dos apps

---

## Risk Assessment

### Implementation Risks

- **Primary Risk:** cada app nascer com UX diferente e gerar fragmentacao da suite.
- **Mitigation:** criar shell compartilhado antes dos apps.
- **Verification:** revisar os 5 apps do MVP no mesmo checklist visual.

### Rollback Plan

1. Reverter componentes compartilhados do `PRO`.
2. Preservar o pacote anterior.

---

## Definition of Done

- [ ] Shell compartilhado do `PRO` pronto
- [ ] Estados amigaveis prontos
- [ ] Acoes padrao compartilhadas prontas
- [ ] Validada consistencia entre paginas independentes dos apps

