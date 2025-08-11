# 🍎 NutriPlan

Este repositório contém o código-fonte de um sistema completo de nutrição chamado NutriPlan. O objetivo é fornecer uma plataforma funcional para ajudar usuários a monitorar sua alimentação e manter hábitos saudáveis, com autenticação segura e interface moderna.

## 💻 Tecnologias Utilizadas

- **⚙️ Backend:** Node.js (Express)
- **🌐 Frontend:** Vue.js com Nuxt
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
├── backend/         # API em Node.js com Express
│   ├── prisma/      # Configurações e schema do banco de dados
│   ├── routes/      # Rotas da aplicação
│   ├── controllers/ # Lógica das rotas
│   └── ...
├── frontend/        # Aplicação Vue.js
│   ├── components/  # Componentes reutilizáveis
│   ├── views/       # Telas da aplicação
│   └── ...
└── README.md
```

## 👨‍💻 Como Rodar Localmente

1. **Clone o repositório**
```bash
git clone https://github.com/tcc-nutricao/sistema-nutricao.git

cd sistema-nutricao
```

2. **Configure o backend**

```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Configure o Prisma:
```bash
npx prisma generate
```

Se necessário, crie o banco de dados com:
```bash
npx prisma migrate dev
```

Inicie o servidor:
```bash
npm run dev
```

3. **Configure o frontend**

Em outro terminal:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor:
```bash
npm run dev
```

---


