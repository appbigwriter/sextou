# 🎨 Guia de Estilo - SEXTOU.biz

## 📋 Visão Geral

Este documento define a identidade visual completa do projeto **SEXTOU.biz**, baseado no manual oficial fornecido por M Mendes.

---

## 🧠 Conceito da Marca

A marca representa:
- 💡 **Oportunidade**
- 📈 **Crescimento**
- 🤝 **Comunidade**
- 💰 **Geração de renda**
- 📢 **Exposição de negócios**

**Posicionamento:** "Marketplace vibrante da comunidade brasileira"

**Essência:** "Visibilidade que vira venda dentro da comunidade"

---

## 🎨 Paleta de Cores Oficial

### Cores Principais

```css
/* Azul Principal - Confiança e Estrutura */
--primary-blue: #0B3C6F;
--primary-blue-rgb: 11, 60, 111;

/* Azul Secundário - Profundidade */
--secondary-blue: #1E5AA8;
--secondary-blue-rgb: 30, 90, 168;

/* Amarelo Ouro - Destaque / Oportunidade */
--gold-yellow: #FFC300;
--gold-yellow-rgb: 255, 195, 0;

/* Amarelo Escuro / Dourado */
--dark-gold: #E6A800;
--dark-gold-rgb: 230, 168, 0;

/* Branco - Contraste */
--white: #FFFFFF;

/* Azul Escuro Profundo - Sombras */
--deep-blue: #062A4D;
```

### Gradientes (Premium Effect)

```css
/* Gradiente Principal (Azul) */
background: linear-gradient(135deg, #1E5AA8 0%, #0B3C6F 100%);

/* Gradiente Dourado */
background: linear-gradient(135deg, #FFC300 0%, #E6A800 100%);
```

---

## 🔤 Tipografia

### Fontes Principais

1. **Montserrat ExtraBold** (preferencial)
2. **Anton** (alternativa)
3. **Poppins Bold** (alternativa)

### Hierarquia

```css
/* Títulos Principais (Hero) */
font-family: 'Montserrat', sans-serif;
font-weight: 800;
font-size: 3rem; /* Desktop */
font-size: 2rem; /* Mobile */

/* Subtítulos */
font-family: 'Poppins', sans-serif;
font-weight: 700;
font-size: 1.5rem;

/* Corpo de Texto */
font-family: 'Poppins', sans-serif;
font-weight: 400;
font-size: 1rem;
line-height: 1.6;
```

### Uso no Logo

- **"SEXTA DO"** → Branco (#FFFFFF) com fundo azul
- **"EMPREENDEDOR"** → Amarelo/Dourado (#FFC300) com contorno azul

---

## 🧩 Elementos Visuais

### Ícones Estratégicos

| Ícone | Significado | Uso |
|-------|-------------|-----|
| 💡 Lâmpada | Ideia, Inovação, Empreendedorismo | Seção "Como Funciona" |
| 📈 Gráfico/Prédios | Crescimento, Negócios, Mercado | Seção "Benefícios" |
| 💰 Moedas | Resultado Financeiro, Venda, Lucro | Seção "Preços" |
| 📢 Megafone | Divulgação, Alcance, Marketing | Hero / CTA |
| 🤝 Aperto de Mão | Confiança, Comunidade, Parceria | Footer / Depoimentos |

### Formato do Logo

**Tipo:** Selo / Badge

**Transmite:**
- Autoridade
- Confiança
- Clube / Comunidade

### Área de Respiro

**Regra:** Mínimo = altura da letra "S"

Sempre manter espaço ao redor do logo — nunca colar em bordas ou outros elementos.

---

## ❌ Uso Incorreto

**Não fazer:**
- ❌ Alterar cores
- ❌ Distorcer proporção
- ❌ Usar fundo poluído
- ❌ Aplicar sombras exageradas
- ❌ Tirar elementos do logo
- ❌ Mudar tipografia

---

## 🖼️ Aplicações

**Pode usar em:**
- WhatsApp (principal)
- Instagram
- Site / Landing pages
- Flyers / Banners
- Camisetas
- Adesivos
- Placas (FBRSigns)

---

## 📱 Versões do Logo

**Criar:**
1. Versão principal (colorida)
2. Versão fundo escuro
3. Versão fundo claro
4. Versão preto e branco
5. Versão só símbolo (ícone)

---

## 🔥 Tom da Marca

**Comunicação:**
- Direta
- Popular
- Comercial
- Energética
- Próxima da comunidade

**Exemplo de voz:**  
_"Aqui sua empresa aparece e vende."_

---

## 🚀 Frases Oficiais

Use sempre que possível:
- "A vitrine da comunidade brasileira"
- "Toda sexta, uma oportunidade"
- "Onde a comunidade compra e apoia"
- "Seu negócio na frente de milhares"

---

## 🎨 Componentes UI

### Botões

```css
/* Botão Primário (Call to Action) */
background: linear-gradient(135deg, #FFC300 0%, #E6A800 100%);
color: #0B3C6F;
font-weight: 700;
padding: 16px 32px;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(255, 195, 0, 0.3);

/* Botão Secundário */
background: linear-gradient(135deg, #1E5AA8 0%, #0B3C6F 100%);
color: #FFFFFF;
font-weight: 600;
padding: 14px 28px;
border-radius: 8px;
```

### Cards

```css
/* Card de Anúncio */
background: #FFFFFF;
border: 2px solid #E6A800;
border-radius: 12px;
padding: 20px;
box-shadow: 0 6px 20px rgba(11, 60, 111, 0.1);

/* Card Hover */
transform: translateY(-4px);
box-shadow: 0 10px 30px rgba(255, 195, 0, 0.2);
```

### Badges / Selos

```css
/* Selo "Anunciante da Sexta" */
background: linear-gradient(135deg, #FFC300 0%, #E6A800 100%);
color: #0B3C6F;
padding: 6px 16px;
border-radius: 20px;
font-weight: 700;
font-size: 0.85rem;
```

---

## 📐 Layout

### Espaçamento

```css
/* Sistema de espaçamento 8px base */
--spacing-xs: 8px;
--spacing-sm: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;
--spacing-xl: 48px;
--spacing-2xl: 64px;
```

### Grid

```css
/* Container Principal */
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;

/* Grid de Cards */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 24px;
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

### Prioridades Mobile

- Cards grandes e legíveis
- Botões fáceis de tocar (min 44px altura)
- Navegação simplificada
- Destaque para WhatsApp
- Carregamento rápido de imagens

---

## 🎯 Mensagem Central

> "A comunidade que denuncia também ajuda, indica e compra. Agora, toda sexta-feira, os empreendedores têm um espaço oficial para mostrar seus produtos e serviços para milhares de pessoas."

---

## ✅ Checklist de Implementação

- [ ] Importar fontes (Montserrat, Poppins, Anton)
- [ ] Criar variáveis CSS com paleta oficial
- [ ] Implementar gradientes nos CTAs principais
- [ ] Usar ícones estratégicos em cada seção
- [ ] Garantir área de respiro do logo
- [ ] Criar versões do logo para diferentes fundos
- [ ] Testar responsividade mobile
- [ ] Aplicar tom de voz nos textos
- [ ] Inserir frases oficiais na landing page
- [ ] Destacar WhatsApp como canal principal

---

**Documento criado em:** 01/04/2026  
**Baseado em:** Manual de Identidade Visual oficial por M Mendes  
**Mantido por:** Chiara Garcia
