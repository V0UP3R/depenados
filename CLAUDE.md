# CLAUDE.md - Guia do Projeto Depenados

## Visão Geral
Este é o projeto **Depenados** - uma plataforma web para contar histórias das aventuras dos Depenados com suporte a mídia (fotos e vídeos), animações dinâmicas e design responsivo.

## Stack Tecnológica

### Core
- **Next.js 16** - Framework React com App Router e Turbopack
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática

### Estilização
- **Tailwind CSS v4** - Framework CSS utility-first
- **Tokens CSS** - Definidos no `globals.css` para consistência
- **Framer Motion** - Animações fluidas e interativas

### Gerenciamento de Estado e Formulários
- **Zustand** - Gerenciamento de estado global (histórias, UI) com persistência
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Upload de Mídia
- Suporte a **fotos** (jpg, png, webp, gif)
- Suporte a **vídeos** (mp4, webm)
- Preview de mídia antes do upload
- Drag & drop

## Skills Instalados

### Frontend Design Skill
Localizado em `.claude/skills/frontend-design/SKILL.md`

Diretrizes para design:
- **Tipografia**: Usar fontes únicas (Cinzel para display, Crimson Pro para body)
- **Cores**: Paleta com personalidade - Laranja primário, Dourado secundário, Roxo accent
- **Animações**: Framer Motion para micro-interações e transições
- **Layout**: Composições espaciais interessantes, não genéricas
- **Texturas**: Grain overlay, gradientes mesh, glass morphism

## Estrutura de Pastas

```
src/
├── app/                    # App Router (Next.js 16)
│   ├── layout.tsx          # Layout principal com Header/Footer
│   ├── page.tsx            # Página inicial (Hero + Featured)
│   ├── globals.css         # Tokens CSS e estilos globais
│   └── historias/          # Rotas de histórias
│       ├── page.tsx        # Lista de histórias com filtros
│       ├── nova/           # Criar nova história
│       │   └── page.tsx
│       └── [id]/           # História individual
│           └── page.tsx
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes UI base
│   │   ├── Button.tsx      # Botão com variantes e animações
│   │   ├── Input.tsx       # Input com label e erro
│   │   ├── Textarea.tsx    # Textarea com label e erro
│   │   ├── MediaUpload.tsx # Upload de mídia com preview
│   │   └── index.ts
│   ├── stories/            # Componentes de histórias
│   │   ├── StoryCard.tsx   # Card de história para grid
│   │   ├── StoryGrid.tsx   # Grid responsivo de histórias
│   │   ├── StoryForm.tsx   # Formulário com React Hook Form
│   │   ├── StoryView.tsx   # Visualização de história
│   │   └── index.ts
│   └── layout/             # Componentes de layout
│       ├── Header.tsx      # Header com navegação responsiva
│       ├── Footer.tsx      # Footer com links
│       └── index.ts
├── stores/                 # Zustand stores
│   └── story-store.ts      # Store de histórias com persistência
├── hooks/                  # Custom hooks
├── lib/                    # Utilitários e helpers
└── types/                  # Definições TypeScript
    └── story.ts            # Tipos de Story e MediaItem
```

## Design Tokens (globals.css)

### Cores
- `--color-primary-*` - Laranja (50-950) - Cor principal
- `--color-secondary-*` - Dourado (50-950) - Cor secundária
- `--color-accent-*` - Roxo místico (50-950) - Cor de destaque
- `--color-neutral-*` - Tons de pergaminho (50-950)

### Backgrounds
- `--background` - Fundo principal (escuro)
- `--background-secondary` - Fundo secundário
- `--background-card` - Fundo de cards
- `--background-elevated` - Elementos elevados

### Tipografia
- `--font-display`: 'Cinzel' - Para títulos
- `--font-body`: 'Crimson Pro' - Para texto
- `--font-mono`: 'JetBrains Mono' - Para código

### Espaçamento
- `--spacing-*` - De 0 a 64 (em rem)

### Animações
- `--animation-duration-fast`: 150ms
- `--animation-duration-normal`: 300ms
- `--animation-duration-slow`: 500ms

### Utilitários CSS
- `.text-gradient-primary` - Gradiente de texto
- `.bg-gradient-mesh` - Background mesh animado
- `.glass` / `.glass-dark` - Glass morphism
- `.glow-primary` / `.glow-secondary` - Efeitos de brilho
- `.animate-stagger` - Animações escalonadas

## Convenções de Código

### Componentes
- Use **function components** com TypeScript
- Props tipadas com `interface` ou `type`
- Componentes em PascalCase
- Um componente por arquivo
- Use `'use client'` para componentes com hooks/interatividade

### Estilização
- Prefira classes Tailwind
- Use tokens CSS via `var(--token-name)`
- Mobile-first approach (responsivo)
- Evite estilos inline

### Estado
- Estado local: `useState`
- Estado de formulário: `React Hook Form`
- Estado global: `Zustand` com persist middleware

### Formulários
- Sempre use `React Hook Form` com `zodResolver`
- Feedback visual de erros
- Loading states durante submissão
- Validação com Zod

## Comandos Úteis

```bash
npm run dev      # Desenvolvimento com Turbopack
npm run build    # Build de produção
npm run start    # Iniciar produção
npm run lint     # Verificar linting
```

## Responsividade

Breakpoints Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Sempre desenvolva **mobile-first**.

## Animações

Use Framer Motion para:
- `initial` + `animate` para entrada
- `whileHover` + `whileTap` para interações
- `whileInView` para scroll animations
- `AnimatePresence` para exit animations
- `layoutId` para shared element transitions

## Histórias - Modelo de Dados

```typescript
interface Story {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  media: MediaItem[];
  coverImage?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  featured?: boolean;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
  caption?: string;
}
```

## Store (Zustand)

```typescript
// Uso básico
const stories = useStoryStore((state) => state.stories);
const { addStory, updateStory, deleteStory } = useStoryStore();

// Ações disponíveis
addStory(storyData)      // Adiciona nova história
updateStory(id, updates) // Atualiza história existente
deleteStory(id)          // Remove história
setFilter(filter)        // Define filtro (all/featured/recent)
getFilteredStories()     // Retorna histórias filtradas
```

## Checklist de Qualidade

- [x] Responsivo em todos os breakpoints
- [x] Animações suaves com Framer Motion
- [x] Formulários com validação Zod
- [x] Feedback visual de loading/erro
- [x] Acessibilidade básica (a11y)
- [x] TypeScript tipado
- [x] Design distintivo (não genérico)
- [x] Upload de mídia funcional
- [x] Persistência de dados (localStorage)
