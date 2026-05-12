<div align="center">

# 💳 FinTrack Web

### Frontend — Interface de Controle Financeiro Pessoal

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

**[🌐 Ver aplicação ao vivo](https://fintrack-web-rosy.vercel.app/)** •
**[⚙️ Repositório Backend](https://github.com/LucasViana130/Fintrack)** •
**[📖 Documentação da API](https://fintrack-production-39f1.up.railway.app/swagger-ui.html)**

</div>

---

## 📌 Sobre o projeto

O **FinTrack Web** é a interface de usuário do sistema de controle financeiro pessoal. Construído com React 18 e Vite, consome a [FinTrack API](https://github.com/LucasViana130/Fintrack) para oferecer uma experiência completa de gestão financeira.

> Este projeto é a camada de **frontend**. A API que alimenta esta interface está em [Fintrack (backend)](https://github.com/LucasViana130/Fintrack).

---

## ✨ Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| **Autenticação** | Cadastro, login com JWT, proteção de rotas |
| **Dashboard** | Visão geral financeira, gráficos de evolução, últimas transações |
| **Contas** | Criar e gerenciar contas bancárias com saldo em tempo real |
| **Categorias** | Categorias padrão do sistema + criação de personalizadas |
| **Transações** | Registrar receitas e despesas com filtros avançados e paginação |
| **Relatórios** | Gráficos de evolução mensal e despesas por categoria com percentuais |
| **Configurações** | Editar nome e senha do perfil |

---

## 🖥️ Telas

### Dashboard
Visão consolidada com cards de saldo, gráfico de evolução dos últimos 12 meses, despesas por categoria e últimas transações.

### Transações
Tabela com filtros por tipo, categoria, conta e período. Paginação automática. Ações de editar e deletar inline.

### Relatórios
Navegação por mês/ano, gráfico de área empilhada (receitas vs despesas vs saldo), gráfico de pizza por categoria e barra de progresso por categoria.

---

## 🛠️ Stack de tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.3 | Biblioteca de interface |
| Vite | 6.0 | Build tool e servidor de desenvolvimento |
| React Router | 6.28 | Navegação entre páginas |
| Tailwind CSS | 3.4 | Estilização utilitária |
| Recharts | 2.13 | Gráficos interativos |
| Axios | 1.7 | Requisições HTTP com interceptors JWT |
| React Hot Toast | 2.4 | Notificações de feedback |
| Lucide React | 0.469 | Ícones |
| clsx | 2.1 | Classes condicionais |

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- [FinTrack API](https://github.com/LucasViana130/Fintrack) rodando localmente ou em produção

### 1. Clone o repositório

```bash
git clone https://github.com/LucasViana130/fintrack-web.git
cd fintrack-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# Para usar o backend local
VITE_API_URL=http://localhost:8080/api

# Para usar o backend em produção
# VITE_API_URL=https://fintrack-production-39f1.up.railway.app/api
```

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

> 💡 O Vite tem proxy configurado — requisições para `/api` vão automaticamente para `localhost:8080` em desenvolvimento, sem problemas de CORS.

---

## 📁 Estrutura de pastas

```
src/
├── components/
│   ├── charts/       → BalanceEvolutionChart, ExpensesByCategoryChart
│   ├── layout/       → Sidebar, AppLayout
│   ├── modals/       → TransactionModal, AccountModal, CategoryModal
│   └── ui/           → Spinner, SkeletonCard, EmptyState, Modal
├── context/
│   └── AuthContext.jsx  → Estado global de autenticação
├── pages/
│   ├── AuthPages.jsx    → Login e Register
│   ├── DashboardPage.jsx
│   └── Pages.jsx        → Transactions, Accounts, Categories, Reports, Settings
├── services/
│   ├── api.js           → Axios com interceptors JWT
│   ├── auth.service.js  → Login, register, perfil
│   └── services.js      → Accounts, Categories, Transactions, Reports
└── utils/
    └── format.js        → Formatação de moeda, datas, constantes
```

---

## 🔐 Autenticação

O frontend usa **JWT stateless**:

1. Após o login, o token é salvo no `localStorage` como `fintrack_token`
2. O interceptor do Axios injeta automaticamente `Authorization: Bearer {token}` em toda requisição
3. Se o backend retornar `401`, o interceptor limpa o localStorage e redireciona para `/login`
4. Rotas protegidas verificam autenticação via `AuthContext` — usuários não autenticados são redirecionados para `/login`

---

## 🚀 Deploy na Vercel

### 1. Importe o repositório na Vercel

Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe este repositório.

### 2. Configure a variável de ambiente

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://fintrack-production-39f1.up.railway.app/api` |

### 3. Deploy

Clique em **Deploy**. A Vercel detecta automaticamente que é Vite.

> O arquivo `vercel.json` já está configurado para SPA routing — todas as rotas funcionam corretamente ao acessar diretamente.

### Deploy automático

Todo push para a branch `main` dispara um novo deploy automaticamente.

---

## 📦 Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (http://localhost:5173)
npm run build    # Build para produção (gera pasta dist/)
npm run preview  # Preview do build de produção
```
---

<div align="center">

**[🌐 Ver ao vivo](https://fintrack-web-rosy.vercel.app/)** •
**[⚙️ Ver o Backend](https://github.com/LucasViana130/Fintrack)**

</div>
