---
title: "Abordagem Inteligente por IA (Writer & Reviewer)"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 5: Abordagem Inteligente por IA (Writer & Reviewer)

## Contexto
Para os contatos na etapa "Frio", o usuário precisa de ajuda para quebrar o gelo. A IA gerará sugestões de mensagens personalizadas baseadas na origem do contato (grupo) e em templates do usuário, garantindo a conformidade.

## Requisitos
1. **Geração de Mensagem (Writer Agent)**:
   - Prompt para criar a mensagem baseada no contexto do grupo e na finalidade informada pelo usuário.
   - Retorno estruturado em JSON com variações de texto.
2. **Revisão Automática (Reviewer Agent)**:
   - Revisar a mensagem para bloquear spam ou claims ilegais (devolver "approved" ou os "issues").
3. **Interface (Outreach Panel)**:
   - Botão no contato para "Gerar Abordagem".
   - Exibir sugestão aprovada ao usuário.
   - Botão de "Enviar via WhatsApp" (disparo via API/Sessão ativa).
4. **Registro**:
   - Registrar no histórico (tabela `messages`).

## Critérios de Aceite
- [ ] Agente escritor e revisor criados usando a infraestrutura Premium/LLM do repositório.
- [ ] A interface permite gerar a mensagem com um clique e revisar a mesma.
- [ ] A mensagem só é despachada após o botão de "Enviar" ser acionado pelo usuário (human-in-the-loop).
