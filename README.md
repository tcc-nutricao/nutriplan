
# 🍎 NutriPlan

Este repositório contém o código-fonte de um sistema completo de nutrição chamado NutriPlan. O objetivo é fornecer uma plataforma funcional para ajudar usuários a melhorar sua alimentação e manter hábitos saudáveis, com autenticação segura e interface moderna.

## 💻 Tecnologias Utilizadas

- **⚙️ Backend:** Node.js (Express)
- **🌐 Frontend:** Vue.js com Nuxt e TailwindCSS
- **🔐 Autenticação:** Login e cadastro de usuários com proteção de rotas

## 📌 Funcionalidades

- Cadastro de usuários
- Login com autenticação segura (JWT)
- Validação de formulários com feedback de erros
- Proteção de rotas autenticadas
- Integração com banco de dados (via Prisma)
- Interface amigável e responsiva

## 📁 Estrutura do Projeto

```bash
/
├── backend/             # API em Node.js com Express 
│   ├── prisma/          # Configurações e schema do banco de dados
│   ├── src/
│   │   ├── config/      # Configurações gerais
│   │   ├── controllers/ # Controladores (Lógica de entrada/saída)
│   │   ├── dtos/        # Data Transfer Objects (Validação de dados)
│   │   ├── middleware/  # Middlewares (Autenticação, tratamento de erros)
│   │   ├── repositories # Camada de acesso ao banco de dados (Prisma)
│   │   ├── routes/      # Definição das rotas da API
│   │   ├── services/    # Regras de negócio da aplicação
│   │   ├── utils/       # Funções utilitárias e auxiliares
│   │   └── index.js     # Ponto de entrada da aplicação
│   └── ...
├── frontend/            # Aplicação Vue.js
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Telas da aplicação
│   └── ...
└── README.md
```

## 👨‍💻 Como Rodar Localmente

### Pré-requisitos

- Node.js e npm
- MySQL

### 1. Clone o repositório

```bash
git clone https://github.com/tcc-nutricao/nutriplan.git
cd nutriplan
```

### 2. Configuração do Backend

Acesse a pasta do backend, instale as dependências e configure o banco de dados.

```bash
cd backend
npm install
```

Certifique-se de ter um arquivo `.env` na raiz da pasta `backend` com as configurações do seu banco de dados (exemplo: `DATABASE_URL="mysql://user:password@localhost:3306/nutriplan"`).

Em seguida, execute as migrações do Prisma para criar as tabelas e manter o banco atualizado:

```bash
npx prisma migrate dev
```

Inicie o servidor backend:

```bash
npm run dev
```

### 3. Configuração do Frontend

Em um novo terminal, acesse a pasta do frontend e instale as dependências.

```bash
cd frontend
npm install
```

Inicie o servidor frontend:

```bash
npm run dev
```

O projeto estará rodando em `http://localhost:3000` (ou a porta definida pelo Nuxt).
