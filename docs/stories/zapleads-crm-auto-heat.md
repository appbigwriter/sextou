---
title: "Esquenta Automático (Webhook & Classifier)"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 6: Esquenta Automático (Webhook & Classifier)

## Contexto
O diferencial do produto é que o funil é "vivo". Assim que um lead interagir via WhatsApp (responder mensagem ou reagir), o sistema o move imediatamente de Frio/Contatado para Quente.

## Requisitos
1. **Webhook Inbound**:
   - Endpoint (`/api/webhooks/whatsapp`) para receber payloads de resposta da provedora.
2. **Classificação (Heat Agent)**:
   - Receber a resposta no backend, enviá-la para a IA classificar a intenção (Dúvida, Interesse, Objeção, Opt-out).
3. **Opt-out Checker**:
   - Regra determinística: se conter "sair", "pare", "não quero", marcar status terminal `opt_out`.
4. **Promoção de Status**:
   - Se a intenção não for opt-out, alterar o status do lead para `quente` no banco.
   - Gerar histórico em `lead_status_history`.
   - Adicionar o evento na tabela `lead_events`.

## Critérios de Aceite
- [ ] O sistema processa webhooks recebidos com sucesso.
- [ ] Palavras de descadastro forçam o status `opt_out` imediatamente.
- [ ] Qualquer outra interação legível move o status do lead para `quente` e recalcula o `heat_score`.
