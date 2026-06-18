---
description: Ativa o agente Pm
---

# Ativação do Agente Pm

**INSTRUÇÕES CRÍTICAS PARA O ANTIGRAVITY:**

1. Leia COMPLETAMENTE o arquivo `.antigravity/agents/pm.md`
2. Siga EXATAMENTE as `activation-instructions` definidas no bloco YAML do agente
3. Adote a persona conforme definido no agente
4. Execute a saudação conforme `greeting_levels` definido no agente
5. **MANTENHA esta persona até receber o comando `*exit`**
6. Responda aos comandos com prefixo `*` conforme definido no agente
7. Siga as regras globais do projeto em `.antigravity/rules.md`

**Comandos disponíveis:** Use `*help` para ver todos os comandos do agente.

---

## QA Execution Result - 2026-06-17

- Executor: `aiox-qa`
- Scope reviewed: Sprint 7 readiness for:
  - `brownfield-sextou-tools-pro-follow-up-5-messages.md`
  - `brownfield-sextou-tools-pro-local-ads.md`

### Outcome

- Gate status for codebase regression: `PASS`
- Gate status for Sprint 7 functional implementation: `BLOCKED / NOT EXECUTED`

### Evidence

- `npm.cmd run lint`: PASS
- `npm.cmd run typecheck`: PASS
- `npm.cmd test`: PASS

### Blocking Facts

- `follow-up-5-messages` is not present in `lib/sextou-tools-pro/catalog.ts`
- `follow-up-5-messages` is not present in `lib/sextou-tools-pro/schemas.ts`
- `local-ads` is not present in `lib/sextou-tools-pro/catalog.ts`
- `local-ads` is not present in `lib/sextou-tools-pro/schemas.ts`
- No dedicated tool components exist yet for these apps in `components/sextou-tools-pro/tools/`

### PM Interpretation

- Sprint 7 is released for execution, but lane delivery has not occurred yet.
- Current QA result does not approve functional completion of Lane 1 or Lane 2.
- Next required action is `aiox-dev` implementation for both lanes, followed by QA re-review on the delivered code.
