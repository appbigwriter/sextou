---
title: "Conexão e Autenticação WhatsApp (UI/UX)"
app: "Sextou ZapLeads"
status: "Ready"
priority: "High"
---

# Story 2: Conexão e Autenticação WhatsApp (UI/UX)

## Contexto
O usuário precisa conectar sua conta do WhatsApp para que o mini-app possa extrair contatos e disparar abordagens. Como há alto risco de banimento e questões LGPD no "Modo Web", é necessária uma tela clara de escolha, com termos de consentimento e um fluxo seguro.

## Requisitos
1. **Gate Premium (Acesso Exclusivo)**:
   - Validar se o usuário possui `is_premium = 'yes'`. Caso não possua, exibir tela de bloqueio (Paywall / Upgrade) e impedir o uso do app.
2. **Seleção de Modo**:
   - Tela com cards para seleção: "Modo Web" (Scan QR) vs "Modo Oficial" (Cloud API).
3. **Aceite de Risco**:
   - Exibir checkbox mandatório no "Modo Web": "Aceito os riscos de banimento e entendo a responsabilidade (LGPD)". O botão só é liberado após aceite.
4. **Fluxo de Pareamento (Modo Web)**:
   - Exibir QR Code (gerado pelo backend) em tempo real, atualizado conforme polling/WebSocket.
   - Feedback visual de "Conectado com sucesso".
5. **Design System**: Uso de componentes da V2 (botões com gradiente apenas no CTA principal).

## Critérios de Aceite
- [ ] Bloqueio (Paywall) implementado para usuários que não têm `is_premium = 'yes'`.
- [ ] UI de seleção de modo e aceite de risco implementada.
- [ ] UX do QR Code funcional, refletindo atualizações de estado do backend.
- [ ] Salvar o estado de conexão e o timestamp do aceite de risco em `zap_connections`.
