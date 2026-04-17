# 📱 Sistema de Leads e Integração WhatsApp

## 📋 Visão Geral

Sistema completo para capturar interesse dos visitantes e integrar perfeitamente com a estratégia de grupos de WhatsApp da comunidade.

---

## 🎯 Área de Leads e Interesse

### Botões de Ação na Página do Anúncio

**Botões Disponíveis:**

```
┌─────────────────────────────────────────────────┐
│  Detalhes do Anúncio - Pizza Delivery Express   │
├─────────────────────────────────────────────────┤
│  [Descrição e imagens do anúncio]               │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ 💬 Falar no      │  │ 🌐 Visitar Site  │    │
│  │    WhatsApp      │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │ 📷 Instagram     │  │ ❤️ Tenho         │    │
│  │                  │  │    Interesse     │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ 📤 Compartilhar no WhatsApp             │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 📊 Captura de Leads

### 1. Botão "Falar no WhatsApp"

**Comportamento:**
```javascript
onClick → {
  // Registrar lead no banco
  await createLead({
    adId: anuncioId,
    source: 'WHATSAPP_CLICK',
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // Redirecionar para WhatsApp
  window.open(`https://wa.me/${whatsappNumber}?text=${mensagemPersonalizada}`, '_blank');
}
```

**Mensagem Personalizada:**
```
Olá! Vi seu anúncio na SEXTOU.biz: 
"[Título do Anúncio]"

Gostaria de saber mais informações.
```

---

### 2. Botão "Visitar Site"

**Comportamento:**
```javascript
onClick → {
  // Registrar lead
  await createLead({
    adId: anuncioId,
    source: 'WEBSITE_CLICK',
    timestamp: new Date()
  });
  
  // Abrir site externo
  window.open(anuncio.externalLink, '_blank');
}
```

---

### 3. Botão "Instagram"

**Comportamento:**
```javascript
onClick → {
  // Registrar lead
  await createLead({
    adId: anuncioId,
    source: 'INSTAGRAM_CLICK',
    timestamp: new Date()
  });
  
  // Abrir Instagram
  window.open(`https://instagram.com/${instagramHandle}`, '_blank');
}
```

---

### 4. Botão "Tenho Interesse"

**Comportamento:**
```javascript
onClick → {
  // Abrir modal para capturar dados (opcional)
  showModal({
    title: "Ótimo! Deixe seus dados",
    fields: [
      { name: 'name', label: 'Seu nome', required: true },
      { name: 'email', label: 'Seu e-mail', required: false },
      { name: 'phone', label: 'Seu WhatsApp', required: false }
    ],
    onSubmit: async (data) => {
      // Registrar lead com dados do usuário
      await createLead({
        adId: anuncioId,
        source: 'INTEREST_BUTTON',
        userName: data.name,
        userEmail: data.email,
        userPhone: data.phone,
        timestamp: new Date()
      });
      
      // Mostrar confirmação
      showToast("Obrigado! O anunciante receberá seu contato.");
    },
    skipButton: {
      text: "Prefiro não informar",
      action: async () => {
        // Registrar lead anônimo
        await createLead({
          adId: anuncioId,
          source: 'INTEREST_BUTTON',
          timestamp: new Date()
        });
      }
    }
  });
}
```

---

## 📈 Dados Capturados por Lead

### Informações Obrigatórias (sempre capturadas)

```typescript
interface Lead {
  id: string;
  adId: string;                    // Qual anúncio
  source: LeadSource;              // De onde veio (WhatsApp, Site, etc)
  timestamp: Date;                 // Quando aconteceu
  ipAddress: string;               // IP do visitante
  userAgent: string;               // Navegador/dispositivo
}

enum LeadSource {
  WHATSAPP_CLICK = 'WHATSAPP_CLICK',
  WEBSITE_CLICK = 'WEBSITE_CLICK',
  INSTAGRAM_CLICK = 'INSTAGRAM_CLICK',
  INTEREST_BUTTON = 'INTEREST_BUTTON'
}
```

### Informações Opcionais (se fornecidas)

```typescript
interface Lead {
  // ... campos obrigatórios
  userName?: string;               // Nome do interessado
  userEmail?: string;              // E-mail do interessado
  userPhone?: string;              // Telefone do interessado
}
```

---

## 📊 Visualização para o Administrador

### Dashboard de Leads (Admin)

**Tabela:**

| Anúncio | Anunciante | Data/Hora | Origem | Dados do Lead | IP | Device |
|---------|------------|-----------|--------|---------------|-----|---------|
| Pizza Delivery | José Silva | 01/04 14:30 | WhatsApp | João (11) 99999-9999 | 192.168.1.1 | Mobile |
| Encanador 24h | Maria Santos | 01/04 14:25 | Interest Button | Anônimo | 192.168.1.2 | Desktop |
| Personal Trainer | Carlos Lima | 01/04 14:20 | Website | Ana ana@email.com | 192.168.1.3 | Mobile |

**Métricas Gerais:**
- Total de leads hoje: 45
- Leads por origem (gráfico de pizza)
- Horário de pico
- Taxa de conversão (views → leads)

---

## 📊 Visualização para o Anunciante

### Meu Painel de Leads

**Por Anúncio:**
```
┌────────────────────────────────────────────────┐
│ Pizza Delivery Express                          │
├────────────────────────────────────────────────┤
│ 👁️ 234 visualizações                           │
│ 💬 18 cliques no WhatsApp                       │
│ 🌐 5 cliques no Site                            │
│ 📷 12 cliques no Instagram                      │
│ ❤️ 8 demonstraram interesse                     │
├────────────────────────────────────────────────┤
│ Taxa de Conversão: 7.7% (views → leads)        │
└────────────────────────────────────────────────┘

[Ver Detalhes dos Leads]
```

**Lista de Leads (se forneceram dados):**

| Nome | Contato | Quando | Origem |
|------|---------|--------|--------|
| João Silva | (11) 99999-9999 | Hoje 14:30 | WhatsApp |
| Ana Costa | ana@email.com | Hoje 12:15 | Interesse |
| - | - | Hoje 10:00 | WhatsApp |

---

## 📱 Integração com WhatsApp

### 1. Botão "Compartilhar no WhatsApp"

**Funcionalidade:**
- Gera link pronto para compartilhar nos grupos de WhatsApp
- Inclui imagem de preview (Open Graph)
- Texto pré-formatado

**Comportamento:**
```javascript
onClick → {
  const shareText = `
🔥 *Confira este anúncio da SEXTOU.biz!*

📌 ${anuncio.titulo}
💰 ${anuncio.preco ? `R$ ${anuncio.preco}` : 'Sob consulta'}
📍 ${anuncio.cidade}

${anuncio.shortDescription}

👉 Ver mais: ${anuncio.publicUrl}

_#SextaDoEmpreendedor_
  `.trim();
  
  // Opção 1: Link direto
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  
  // Opção 2: Web Share API (mobile)
  if (navigator.share) {
    navigator.share({
      title: anuncio.titulo,
      text: shareText,
      url: anuncio.publicUrl
    });
  }
}
```

---

### 2. Texto Pronto para Copiar

**Interface:**
```
┌────────────────────────────────────────────────┐
│ 📤 Compartilhar nos Grupos de WhatsApp         │
├────────────────────────────────────────────────┤
│ Copie o texto abaixo e cole no grupo:         │
│                                                │
│ ┌────────────────────────────────────────┐   │
│ │ 🔥 Confira este anúncio da Sexta do    │   │
│ │ Empreendedor!                          │   │
│ │                                        │   │
│ │ 📌 Pizza Delivery Express              │   │
│ │ 💰 R$ 35,00                            │   │
│ │ 📍 Miami, FL                           │   │
│ │                                        │   │
│ │ Deliciosas pizzas artesanais...       │   │
│ │                                        │   │
│ │ 👉 Ver mais: bit.ly/pizzaexpress      │   │
│ │                                        │   │
│ │ #SextaDoEmpreendedor                   │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ [📋 Copiar Texto]  [💬 Abrir WhatsApp]        │
└────────────────────────────────────────────────┘
```

---

### 3. Link Curto (URL Shortener)

**Implementação:**
```javascript
// Gerar link curto para cada anúncio
const shortUrl = await createShortUrl({
  originalUrl: `https://sextadoempreendedor.com/anuncios/${anuncio.slug}`,
  slug: `${anuncio.id.substring(0, 6)}` // Primeiros 6 caracteres do UUID
});

// Resultado: https://sextado.link/a3f5b2
```

**Benefícios:**
- Links mais limpos para WhatsApp
- Rastreamento de cliques
- Facilita compartilhamento

---

### 4. Geração Automática de Imagem para Compartilhamento

**Open Graph / WhatsApp Preview:**
```html
<meta property="og:title" content="Pizza Delivery Express | SEXTOU.biz" />
<meta property="og:description" content="Deliciosas pizzas artesanais com entrega rápida em Miami" />
<meta property="og:image" content="https://sextado.com/og-images/anuncio-123.jpg" />
<meta property="og:url" content="https://sextado.com/anuncios/pizza-delivery-express" />
<meta property="og:type" content="website" />
```

**Imagem Dinâmica:**
- Gerada automaticamente ao publicar anúncio
- Inclui:
  - Logo "SEXTOU.biz"
  - Foto principal do anúncio
  - Título
  - Preço
  - Cidade
  - Badge "Anúncio da Semana"

---

### 5. Template de Mensagem Personalizada

**Para o Anunciante Configurar:**
```typescript
interface WhatsAppMessage {
  greeting: string;           // "Olá!"
  introduction: string;       // "Vi seu anúncio na SEXTOU.biz"
  callToAction: string;       // "Gostaria de saber mais"
  customMessage?: string;     // Campo livre
}
```

**Exemplo de Mensagem Final:**
```
Olá! 👋

Vi seu anúncio na SEXTOU.biz:
"Pizza Delivery Express"

Gostaria de saber mais sobre o cardápio e formas de entrega.

Aguardo seu contato!
```

---

## 📊 Métricas de WhatsApp

### Para o Admin

**Dashboard:**
- Total de cliques em "Falar no WhatsApp"
- Taxa de conversão (views → cliques WhatsApp)
- Horários de pico
- Anúncios com mais cliques

### Para o Anunciante

**Painel Individual:**
```
┌────────────────────────────────────────┐
│ 📊 Performance do WhatsApp             │
├────────────────────────────────────────┤
│ 💬 45 pessoas clicaram no WhatsApp     │
│ ⏰ Horário de pico: 14h - 16h          │
│ 📈 Conversão: 19.2% (views → cliques)  │
└────────────────────────────────────────┘
```

---

## 🔔 Notificações em Tempo Real

### Para o Anunciante

**Quando alguém clica no WhatsApp:**
```
🔔 Nova interação no seu anúncio!
Alguém acabou de clicar para falar com você via WhatsApp.
Anúncio: Pizza Delivery Express
Há 2 minutos
```

**Opções:**
- Notificação in-app
- E-mail (configurável)
- Push notification (futuro app mobile)

---

## 🎯 Estratégia de Grupos de WhatsApp

### Integração Comunitária

**Fluxo:**
1. Toda sexta-feira às 9h AM (horário configurável)
2. Sistema gera mensagem de divulgação:
   ```
   🔥 *SEXTA DO EMPREENDEDOR* 🔥
   
   Novos anúncios desta semana!
   
   📌 Pizza Delivery Express
   📌 Encanador 24h Emergência
   📌 Personal Trainer Online
   ... e mais 12 anúncios!
   
   👉 Ver todos: sextado.link/semana
   
   Apoie os empreendedores da nossa comunidade! 🇧🇷
   ```

3. Admin copia e cola nos grupos oficiais
4. Ou: integração com WhatsApp Business API (futuro)

---

### Bot de WhatsApp (Fase Futura)

**Funcionalidades:**
- Responder automaticamente com anúncios da semana
- Buscar anúncios por categoria
- Receber notificações de novos anúncios

**Comandos:**
```
!anuncios → Lista anúncios da semana
!categoria alimentacao → Filtra por categoria
!busca pizza → Busca por palavra-chave
!ajuda → Mostra comandos
```

---

## 📋 Checklist de Implementação

### Leads
- [ ] Criar tabela `leads` no banco
- [ ] Endpoint API para criar lead
- [ ] Botões de ação na página do anúncio
- [ ] Modal "Tenho Interesse" com formulário opcional
- [ ] Dashboard de leads (admin)
- [ ] Painel de leads (anunciante)
- [ ] Exportar leads em CSV

### WhatsApp
- [ ] Botão "Falar no WhatsApp" com mensagem personalizada
- [ ] Botão "Compartilhar no WhatsApp"
- [ ] Geração de texto pronto para copiar
- [ ] Link curto (URL shortener)
- [ ] Imagens Open Graph dinâmicas
- [ ] Métricas de cliques
- [ ] Notificações de interação

### Futuro
- [ ] WhatsApp Business API
- [ ] Bot de WhatsApp
- [ ] Push notifications
- [ ] A/B testing de mensagens

---

**Documento criado em:** 01/04/2026  
**Mantido por:** Chiara Garcia  
**Versão:** 1.0
