# Padrões do Projeto — Monorepo

> Documento de referência para padronização de desenvolvimento.  
> Última atualização: 2026

---

## Sumário

1. [Visão Geral da Stack](#1-visão-geral-da-stack)
2. [Estrutura do Monorepo](#2-estrutura-do-monorepo)
3. [Turborepo — Configuração e Pipelines](#3-turborepo--configuração-e-pipelines)
4. [Next.js — Convenções e Padrões](#4-nextjs--convenções-e-padrões)
5. [TailwindCSS — Estilização](#5-tailwindcss--estilização)
6. [Prisma — ORM e Modelos](#6-prisma--orm-e-modelos)
7. [PostgreSQL — Banco de Dados](#7-postgresql--banco-de-dados)
8. [Nomenclatura e Organização de Código](#8-nomenclatura-e-organização-de-código)
9. [Variáveis de Ambiente](#9-variáveis-de-ambiente)
10. [Git e Versionamento](#10-git-e-versionamento)
11. [Qualidade de Código](#11-qualidade-de-código)
12. [Packages Compartilhados](#12-packages-compartilhados)

---

## 1. Visão Geral da Stack

| Camada | Tecnologia | Versão mínima |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Estilização | TailwindCSS | 3.x |
| Banco de dados | PostgreSQL | 15.x |
| ORM | Prisma | 5.x |
| Gerenciamento de monorepo | Turborepo | 2.x |
| Runtime | Node.js | 20.x LTS |
| Gerenciador de pacotes | pnpm | 9.x |

> **Importante:** todo o projeto utiliza **pnpm workspaces**. Nunca use `npm` ou `yarn` diretamente.

---

## 2. Estrutura do Monorepo

```
.
├── apps/
│   ├── web/                  # Aplicação principal (Next.js)
│   └── admin/                # Painel administrativo (Next.js)
│
├── packages/
│   ├── database/             # Prisma schema + client exportado
│   ├── ui/                   # Componentes compartilhados
│   ├── config-tailwind/      # Configuração base do Tailwind
│   ├── config-typescript/    # tsconfig bases compartilhadas
│   └── utils/                # Funções utilitárias compartilhadas
│
├── turbo.json                # Pipeline do Turborepo
├── package.json              # Root package (workspaces)
├── pnpm-workspace.yaml       # Definição dos workspaces
└── .env.example              # Referência de variáveis de ambiente
```

### Regras de estrutura

- `apps/` contém apenas aplicações que geram build final e são deployadas.
- `packages/` contém código reutilizável entre apps — nunca lógica de negócio específica de uma app.
- Nenhuma app deve importar diretamente de outra app. A comunicação se dá via `packages/`.
- O package `database` é o **único ponto de acesso** ao Prisma Client em todo o monorepo.

---

## 3. Turborepo — Configuração e Pipelines

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDotEnv": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Scripts no root package.json

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:studio": "cd packages/database && pnpm prisma studio",
    "clean": "turbo clean && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +"
  }
}
```

### Regras do Turborepo

- Sempre declarar corretamente `inputs` e `outputs` nas tasks para que o cache funcione.
- Tasks com efeitos colaterais externos (migrações, seeds) devem ter `"cache": false`.
- Usar `dependsOn: ["^build"]` em qualquer task que precise que os packages dependentes estejam compilados.

---

## 4. Next.js — Convenções e Padrões

### App Router

Todos os projetos usam **App Router** (`app/`). O Pages Router (`pages/`) não deve ser utilizado.

### Estrutura interna de uma app Next.js

```
apps/web/
├── app/
│   ├── (auth)/               # Grupo de rotas — não afeta a URL
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/
│   │   └── [recurso]/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx            # Root layout
│   └── page.tsx
│
├── components/               # Componentes locais da app
│   ├── ui/                   # Primitivos locais (se não estiver em packages/ui)
│   └── [feature]/            # Componentes de domínio
│
├── lib/                      # Lógica de suporte local
│   ├── actions/              # Server Actions
│   ├── queries/              # Queries de banco de dados
│   └── validations/          # Schemas Zod
│
├── hooks/                    # Custom hooks client-side
├── types/                    # Tipos TypeScript locais
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Server vs Client Components

- **Padrão**: todo componente é Server Component. Adicionar `"use client"` apenas quando necessário.
- Use `"use client"` somente para: interatividade (eventos do usuário), hooks de estado/efeito, APIs do browser.
- Mantenha a fronteira server/client o mais baixo possível na árvore de componentes.
- Server Actions ficam em `lib/actions/` e usam a diretiva `"use server"`.

### Route Handlers (API)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // lógica aqui
  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // validar com Zod antes de qualquer operação
  return NextResponse.json({ data }, { status: 201 });
}
```

### Nomenclatura de arquivos

| Arquivo | Convenção |
|---|---|
| Páginas | `page.tsx` |
| Layouts | `layout.tsx` |
| Componentes | `PascalCase.tsx` |
| Hooks | `use-nome-do-hook.ts` |
| Utilitários | `kebab-case.ts` |
| Server Actions | `nome-da-action.ts` |
| Tipos | `types.ts` ou `nome.types.ts` |

---

## 5. TailwindCSS — Estilização

### Configuração base compartilhada

O package `packages/config-tailwind` exporta a configuração base:

```typescript
// packages/config-tailwind/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Design tokens do projeto
        brand: {
          50: "#...",
          500: "#...",
          900: "#...",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

Cada app estende essa base:

```typescript
// apps/web/tailwind.config.ts
import baseConfig from "@repo/config-tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  ...baseConfig,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
};

export default config;
```

### Padrões de uso

**Ordem das classes:** seguir a ordem canônica do Tailwind (layout → spacing → typography → visual → interactive). Use o plugin `prettier-plugin-tailwindcss` para ordenação automática.

**Condicional de classes:** usar a biblioteca `clsx` ou `cva` — nunca concatenação de strings manual:

```typescript
// ✅ Correto
import { clsx } from "clsx";

const className = clsx(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
);

// ❌ Evitar
const className = `base-class ${isActive ? "active-class" : ""}`;
```

**Variantes de componente:** usar `class-variance-authority` (CVA) para componentes com múltiplas variantes:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600",
        outline: "border border-input bg-transparent hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

**Proibições:**

- Não usar valores arbitrários (`w-[347px]`) para medidas que poderiam ser tokens do design system.
- Não usar `!important` via `!` prefix do Tailwind, exceto em casos absolutamente necessários e comentados.
- Não misturar CSS-in-JS com Tailwind no mesmo componente.

---

## 6. Prisma — ORM e Modelos

### Localização

Todo o Prisma vive em `packages/database/`:

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   └── index.ts              # Exporta o Prisma Client
├── package.json
└── tsconfig.json
```

### Exportação do Client

```typescript
// packages/database/src/index.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
```

As apps importam assim:

```typescript
import { prisma } from "@repo/database";
```

### Padrões do Schema

```prisma
// packages/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ✅ Padrões obrigatórios:
// - IDs sempre UUID (cuid2 ou uuid)
// - Timestamps createdAt/updatedAt em toda tabela de entidade
// - Nomes de model em PascalCase singular
// - Nomes de campo em camelCase
// - Índices explícitos nos campos de busca frequente

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  posts Post[]

  @@map("users")  // nome da tabela em snake_case plural
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String   @map("author_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@index([published, createdAt(sort: Desc)])
  @@map("posts")
}
```

### Regras do Prisma

- Sempre usar `@@map` para mapear para `snake_case` no banco.
- Sempre usar `@map` em campos com nomes compostos (`createdAt` → `created_at`).
- Nunca usar `prisma.$queryRaw` sem sanitização explícita. Preferir as queries tipadas.
- Toda migration deve ter um nome descritivo: `pnpm prisma migrate dev --name add_user_profile`.
- Nunca commitar uma migration sem revisar o SQL gerado com `prisma migrate diff`.
- O arquivo `seed.ts` deve ser idempotente (pode ser executado múltiplas vezes sem efeitos colaterais).

### Queries — organização

Queries ficam em `apps/[nome]/lib/queries/`:

```typescript
// lib/queries/users.ts
import { prisma } from "@repo/database";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

export async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId, published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
```

---

## 7. PostgreSQL — Banco de Dados

### Convenções de nomenclatura no banco

| Objeto | Convenção | Exemplo |
|---|---|---|
| Tabelas | `snake_case` plural | `users`, `blog_posts` |
| Colunas | `snake_case` | `created_at`, `user_id` |
| Índices | `idx_tabela_coluna` | `idx_posts_author_id` |
| Chaves estrangeiras | `fk_tabela_coluna_ref` | `fk_posts_author_id_users` |
| Constraints únicos | `uq_tabela_coluna` | `uq_users_email` |

### Conexão e pool

A string de conexão deve incluir parâmetros de pool adequados ao ambiente:

```
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public&connection_limit=10&pool_timeout=30"
```

Para produção, usar **PgBouncer** ou o pooling nativo da plataforma de hospedagem (ex: Supabase, Neon).

### Boas práticas

- Toda tabela de entidade deve ter `id`, `created_at` e `updated_at`.
- Usar `TIMESTAMPTZ` (com fuso horário) — o Prisma mapeia para `DateTime` automaticamente com PostgreSQL.
- Dados sensíveis (senhas, tokens) nunca armazenados em texto plano.
- Soft delete: usar coluna `deleted_at TIMESTAMPTZ NULL` ao invés de `DELETE` físico, quando aplicável.

---

## 8. Nomenclatura e Organização de Código

### TypeScript

```typescript
// ✅ Interfaces para objetos de domínio
interface User {
  id: string;
  email: string;
  name: string | null;
}

// ✅ Types para unions e utilitários
type UserRole = "admin" | "member" | "guest";
type PartialUser = Partial<User>;

// ✅ Enums via const object (evitar enum nativo do TS)
const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ❌ Evitar any
const data: any = response.json(); // errado

// ✅ Tipar explicitamente ou usar unknown
const data: unknown = response.json();
```

### Funções e componentes

- Componentes React: **PascalCase** (`UserCard`, `PostList`)
- Hooks: prefixo `use` + camelCase (`useUserProfile`, `usePostList`)
- Funções utilitárias: **camelCase** (`formatDate`, `parseSlug`)
- Constantes globais: **SCREAMING_SNAKE_CASE** (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- Server Actions: verbos de ação + camelCase (`createUser`, `updatePost`, `deleteComment`)

### Importações

Seguir esta ordem, separados por linha em branco:

```typescript
// 1. Módulos do Node.js
import { readFile } from "fs/promises";

// 2. Dependências externas
import { z } from "zod";
import { clsx } from "clsx";

// 3. Packages internos do monorepo
import { prisma } from "@repo/database";
import { Button } from "@repo/ui";

// 4. Imports locais da app (absolutos via alias)
import { getUserById } from "@/lib/queries/users";

// 5. Imports relativos
import { formatDate } from "../utils/date";

// 6. Tipos (sempre com `import type`)
import type { User } from "@repo/database";
import type { ButtonProps } from "@repo/ui";
```

---

## 9. Variáveis de Ambiente

### Arquivo .env.example

Todo ambiente deve ter um `.env.example` atualizado e commitado:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Chaves públicas (expostas ao browser — prefixo NEXT_PUBLIC_)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Regras

- Nunca commitar `.env`, `.env.local`, `.env.production`. Apenas `.env.example`.
- Variáveis acessadas no browser **obrigatoriamente** têm o prefixo `NEXT_PUBLIC_`.
- Usar um schema de validação das envs com `zod` no startup da aplicação:

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## 10. Git e Versionamento

### Branches

```
main          → produção (protegida, somente via PR)
develop       → integração (base para PRs de feature)
feature/...   → novas funcionalidades
fix/...       → correções de bugs
chore/...     → atualizações de dependências, refactors sem impacto
```

### Commits — Conventional Commits

```
<tipo>(<escopo>): <descrição curta no imperativo>

[corpo opcional]

[rodapé opcional — breaking changes, issues]
```

**Tipos válidos:**

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (sem lógica) |
| `refactor` | Refatoração sem feature/fix |
| `test` | Adição/correção de testes |
| `chore` | Build, CI, deps |
| `perf` | Melhoria de performance |
| `db` | Migrations e schema |

**Exemplos:**

```
feat(auth): add Google OAuth provider
fix(posts): correct pagination offset calculation
db(users): add index on email column
chore: upgrade Prisma to 5.14
```

### Pull Requests

- PR deve ter título seguindo Conventional Commits.
- Descrição deve incluir: o quê foi feito, por quê, como testar.
- Mínimo de 1 aprovação antes do merge.
- CI deve passar antes do merge (lint, type-check, testes).
- Squash merge obrigatório para manter histórico limpo.

---

## 11. Qualidade de Código

### ESLint

Usar `@repo/config-eslint` como base compartilhada. Regras obrigatórias:

- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/no-unused-vars`: error
- `import/order`: error (vide seção de importações)
- `no-console`: warn (remover antes do merge)

### Prettier

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### TypeScript

Todo projeto usa modo **strict**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Testes

- Unitários e de integração: **Vitest**
- E2E: **Playwright**
- Cobertura mínima para funções críticas (queries, actions): 80%
- Testes ficam em `__tests__/` ao lado do arquivo testado, ou em `tests/` na raiz da app para E2E.

---

## 12. Packages Compartilhados

### @repo/ui — Componentes

Componentes de UI genéricos e sem lógica de negócio:

```typescript
// packages/ui/src/components/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva("...", { variants: { ... } });

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

Cada componente deve ser exportado via `packages/ui/src/index.ts`.

### @repo/utils — Utilitários

Funções puras sem dependências de framework ou banco de dados:

```typescript
// packages/utils/src/date.ts
export function formatDate(date: Date, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
```

### @repo/database — Database

Única fonte de verdade para o Prisma. As apps nunca instalam `@prisma/client` diretamente — importam apenas via `@repo/database`.

---

## Checklist de Onboarding

Para começar a desenvolver, executar nesta ordem:

```bash
# 1. Instalar dependências
pnpm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.example .env

# 3. Gerar o Prisma Client
pnpm db:generate

# 4. Executar as migrations
pnpm db:migrate

# 5. (Opcional) Popular o banco com dados de seed
cd packages/database && pnpm prisma db seed

# 6. Iniciar o servidor de desenvolvimento
pnpm dev
```

---

*Este documento é vivo. Qualquer mudança de padrão deve ser proposta via PR com justificativa e aprovação do time.*