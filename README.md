<div align="center">

# ServiHub

**Marketplace de Serviços**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square)](/)
[![Versão](https://img.shields.io/badge/versão-0.1-blue?style=flat-square)](/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)](/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](/)

</div>

## Sobre o Projeto

O **ServiHub** é um marketplace que conecta **clientes** a **prestadores de serviço** verificados em múltiplas categorias — limpeza, reformas, beleza, tecnologia, educação, pets e muito mais.

O sistema resolve um problema recorrente no mercado brasileiro: a fragmentação e informalidade na contratação de serviços. Clientes não encontram prestadores confiáveis com facilidade, e profissionais autônomos carecem de ferramentas para divulgar seus serviços e construir reputação online.

### Proposta de Valor

| Para clientes | Para prestadores |
|---|---|
| Busca por categoria e avaliação | Perfil profissional com portfólio |
| Solicitação direta ao prestador | Painel de gestão de solicitações |
| Avaliações públicas e transparentes | Sistema de reputação e avaliações |
| Histórico de contratações | Visibilidade para novos clientes |

---

## Funcionalidades

- **Busca de serviços** — filtros por categoria e texto livre
- **Perfil de prestador** — bio, avaliação média, serviços publicados, verificação de identidade
- **Sistema de avaliações** — notas (1–5) e comentários após conclusão
- **Painel do prestador** — gestão de solicitações e métricas
- **Painel administrativo** — moderação de usuários, serviços e solicitações
- **Autenticação segura** — JWT via NextAuth.js v5, senhas com bcrypt

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Linguagem | TypeScript | 5.x |
| Estilização | TailwindCSS | 3.x |
| ORM | Prisma | 5.x |
| Banco de dados | PostgreSQL | 15.x |
| Autenticação | NextAuth.js | v5 (beta) |
| Monorepo | Turborepo | 2.x |
| Gerenciador de pacotes | pnpm | 9.x |

---

## Estrutura do Repositório

```
.
├── apps/
│   ├── web/                  # Marketplace principal (porta 3000)
│   └── admin/                # Painel administrativo (porta 3001)
│
├── packages/
│   ├── database/             # Prisma schema + client exportado
│   ├── ui/                   # Componentes compartilhados (Button, Input, Card, Badge)
│   ├── utils/                # Funções utilitárias (formatDate, formatCurrency...)
│   ├── config-tailwind/      # Configuração base do Tailwind (brand colors)
│   └── config-typescript/    # tsconfig bases compartilhadas
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

---

## Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+ — `npm install -g pnpm`
- [PostgreSQL](https://www.postgresql.org/) 15+ rodando localmente (ou via Docker)
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/servihub.git
cd servihub
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e preencha os valores:

```env
# String de conexão com o PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/servihub"

# Segredo para JWT — gere com: openssl rand -base64 32
AUTH_SECRET="seu-segredo-aqui-minimo-32-caracteres"

NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3001"

ADMIN_AUTH_SECRET="seu-segredo-admin-aqui"
```

### 4. Criar o banco e rodar as migrations

```bash
pnpm db:generate   # gera o Prisma Client
pnpm db:migrate    # cria as tabelas no banco
```

### 5. Popular com dados de exemplo (opcional)

```bash
cd packages/database && pnpm db:seed
```

Isso cria os seguintes usuários de teste:

| Perfil | Email | Senha |
|---|---|---|
| Admin | `admin@servihub.com.br` | `Admin@123` |
| Prestador | `prestador@exemplo.com` | `Prestador@123` |
| Cliente | `cliente@exemplo.com` | `Cliente@123` |

### 6. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

| App | URL |
|---|---|
| Marketplace (web) | http://localhost:3000 |
| Painel Admin | http://localhost:3001 |

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia todas as apps em modo desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm lint` | Executa o ESLint em todos os workspaces |
| `pnpm type-check` | Verifica os tipos TypeScript |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:migrate` | Executa as migrations pendentes |
| `pnpm db:studio` | Abre o Prisma Studio (interface visual do banco) |

---

## Modelo de Dados

```
User (CLIENT | PROVIDER | ADMIN)
 └── ProviderProfile (bio, documento, rating, isVerified)
      └── Service (título, descrição, preço, categoria)
           └── ServiceRequest (solicitação do cliente)
                ├── Review (avaliação pós-conclusão)
                └── Conversation
                     └── Message
Category
```

---

## Guia de Contribuição

1. Crie uma branch a partir de `develop`: `git checkout -b feature/minha-feature`
2. Siga as convenções do [CLAUDE.MD](./CLAUDE.MD) — nomenclatura, importações, padrões do Prisma
3. Faça commit usando [Conventional Commits](https://www.conventionalcommits.org/): `feat(web): adiciona filtro por localização`
4. Abra um Pull Request para `develop` com descrição do que foi feito e como testar
5. Aguarde revisão — mínimo 1 aprovação antes do merge

---

## Integrantes

<div align="center">

| Nome | GitHub |
|:---|:---:|
| Abraão Araujo dos Santos | [@Abraao4raujo](https://github.com/) |
| Evandro França da Silva Filho | [@evandrofi](https://github.com/) |
| Gabriella Maria Nascimento da Silva | [@brienasc](https://github.com/) |
| Jonnas Kauan Pereira Novaes | [@jonnas](https://github.com/) |
| Matheus Pinheiro da Cunha | [@mpinheirodev](https://github.com/) |

</div>

---

<div align="center">
Desenvolvido pela equipe ServiHub — 2026
</div>
