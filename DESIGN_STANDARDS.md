# Design Standards — Sexta do Empreendedor

## Design Tokens

Tokens de design para garantir consistência visual em todo o projeto.

---

## 🎨 Cores

### Cores Principais
```css
--primary-blue: #0B3C6F;        /* Azul principal - confiança */
--secondary-blue: #1E5AA8;      /* Azul secundário - profundidade */
--gold-yellow: #FFC300;         /* Amarelo ouro - destaque */
--dark-gold: #E6A800;           /* Dourado escuro */
--white: #FFFFFF;               /* Branco - contraste */
--deep-blue: #062A4D;           /* Azul escuro - sombras */
```

### Gradientes
```css
--gradient-blue: linear-gradient(135deg, #1E5AA8 0%, #0B3C6F 100%);
--gradient-gold: linear-gradient(135deg, #FFC300 0%, #E6A800 100%);
```

### Cores Semânticas
```css
--success: #10B981;
--success-light: #D1FAE5;
--warning: #F59E0B;
--warning-light: #FEF3C7;
--error: #EF4444;
--error-light: #FEE2E2;
--info: #1E5AA8;
--info-light: #DBEAFE;
```

### Tons de Cinza
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

---

## 🔤 Tipografia

### Fontes
```css
font-family-primary: 'Montserrat', sans-serif;  /* Títulos */
font-family-secondary: 'Poppins', sans-serif;   /* Corpo */
font-family-mono: 'JetBrains Mono', monospace;  /* Código */
```

### Escala Tipográfica
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### Pesos
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

## 📏 Espaçamento

### Sistema 8px Base
```css
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

---

## 🔘 Botões

### Primário (CTA Principal)
```css
background: var(--gradient-gold);
color: var(--primary-blue);
font-weight: 700;
padding: 1rem 2rem;
border-radius: 0.5rem;
box-shadow: 0 4px 12px rgba(255, 195, 0, 0.3);
transition: all 0.3s ease;
```

**Hover:**
```css
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(255, 195, 0, 0.4);
```

### Secundário
```css
background: var(--gradient-blue);
color: var(--white);
font-weight: 600;
padding: 0.875rem 1.75rem;
border-radius: 0.5rem;
```

### Outline
```css
background: transparent;
border: 2px solid var(--primary-blue);
color: var(--primary-blue);
```

---

## 🃏 Cards

### Card Padrão
```css
background: var(--white);
border: 2px solid var(--dark-gold);
border-radius: 0.75rem;
padding: 1.25rem;
box-shadow: 0 6px 20px rgba(11, 60, 111, 0.1);
transition: all 0.3s ease;
```

**Hover:**
```css
transform: translateY(-4px);
box-shadow: 0 10px 30px rgba(255, 195, 0, 0.2);
```

### Card de Anúncio
```css
background: var(--white);
border: 2px solid var(--gray-200);
border-radius: 0.75rem;
overflow: hidden;
transition: all 0.3s ease;
```

**Hover:**
```css
border-color: var(--gold-yellow);
box-shadow: 0 8px 24px rgba(255, 195, 0, 0.15);
```

---

## 🏷️ Badges

### Badge Destaque
```css
background: var(--gradient-gold);
color: var(--primary-blue);
padding: 0.375rem 1rem;
border-radius: 1.25rem;
font-weight: 700;
font-size: 0.85rem;
text-transform: uppercase;
letter-spacing: 0.5px;
```

### Badge Status
```css
/* Aprovado */
background: var(--success-light);
color: var(--success);

/* Pendente */
background: var(--warning-light);
color: var(--warning);

/* Rejeitado */
background: var(--error-light);
color: var(--error);
```

---

## 💬 Inputs

### Input Padrão
```css
background: var(--white);
border: 2px solid var(--gray-300);
border-radius: 0.5rem;
padding: 0.75rem 1rem;
font-size: 1rem;
color: var(--gray-900);
transition: all 0.2s ease;
```

**Focus:**
```css
border-color: var(--primary-blue);
box-shadow: 0 0 0 3px rgba(30, 90, 168, 0.1);
outline: none;
```

**Error:**
```css
border-color: var(--error);
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
```

---

## 🖼️ Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(11, 60, 111, 0.05);
--shadow-md: 0 4px 6px -1px rgba(11, 60, 111, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(11, 60, 111, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(11, 60, 111, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(11, 60, 111, 0.25);
--shadow-gold: 0 4px 12px rgba(255, 195, 0, 0.3);
```

---

## 📐 Bordas

```css
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Círculo */
```

---

## ⏱️ Transições

```css
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;
```

---

## 🎭 Animações

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Pulse (CTA)
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

---

## 📱 Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }

/* Large Desktop */
@media (min-width: 1536px) { ... }
```

---

## 🎨 Ícones

### Biblioteca
- Lucide React (preferencial)
- Fallback: Heroicons

### Tamanhos
```css
--icon-xs: 1rem;     /* 16px */
--icon-sm: 1.25rem;  /* 20px */
--icon-md: 1.5rem;   /* 24px */
--icon-lg: 2rem;     /* 32px */
--icon-xl: 3rem;     /* 48px */
```

### Ícones Estratégicos
- 💡 Lâmpada → Ideia, Inovação
- 📈 Gráfico → Crescimento, Negócios
- 💰 Moedas → Resultado Financeiro
- 📢 Megafone → Divulgação, Marketing
- 🤝 Aperto de Mão → Confiança, Comunidade

---

## 📋 Componentes Reutilizáveis

### Estrutura de Arquivo
```
components/
├── ui/               # Primitivos (Button, Input, Card)
├── layout/           # Header, Footer, Sidebar
├── ads/              # AdCard, AdList, AdForm
├── forms/            # FormField, FormError
└── admin/            # AdminTable, AdminModal
```

### Naming Convention
- **PascalCase** para componentes: `Button`, `AdCard`
- **camelCase** para funções: `handleSubmit`, `validateForm`
- **kebab-case** para arquivos CSS: `button.module.css`

---

## ✅ Checklist de Design por Task

Antes de marcar uma task de frontend como Done:

- [ ] Usa tokens de cor do DESIGN_STANDARDS.md
- [ ] Usa escala tipográfica correta
- [ ] Usa sistema de espaçamento 8px
- [ ] Implementa transições suaves
- [ ] Testado em mobile (< 640px)
- [ ] Testado em tablet (641px-1024px)
- [ ] Testado em desktop (> 1025px)
- [ ] Ícones da biblioteca Lucide React
- [ ] Segue naming convention
- [ ] Componente documentado no Storybook (futuro)

---

**Última atualização:** 01/04/2026  
**Mantido por:** Chiara Garcia  
**Versão:** 1.0
