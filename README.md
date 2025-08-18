# 🍎 NutriPlan

Este repositório contém o código-fonte de um sistema completo de nutrição chamado NutriPlan. O objetivo é fornecer uma plataforma funcional para ajudar usuários a monitorar sua alimentação e manter hábitos saudáveis, com autenticação segura e interface moderna.

## 💻 Tecnologias Utilizadas

- **⚙️ Backend:** Node.js (Express)
- **🌐 Frontend:** Vue.js com Nuxt
- **🔐 Autenticação:** Login e cadastro de usuários com proteção de rotas
- **🐋 Conteinerização:** Docker

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
|   ├── src/
|   |   ├── routes/      # Rotas da aplicação 
│   |   ├── controllers/ # Lógica das rotas
|   |   ├── Dockerfile   # Arquivo de configuração do Docker para iniciar o backend
│   |   └── ...
├── frontend/        # Aplicação Vue.js
│   ├── components/  # Componentes reutilizáveis
│   ├── pages/       # Telas da aplicação
|   ├── Dockerfile   # Arquivo de configuração do Docker para iniciar o frontend
│   └── ...
└── README.md
└── docker-compose.yml
```

## 👨‍💻 Como Rodar Localmente

1. **Clone o repositório**
```bash
git clone https://github.com/tcc-nutricao/sistema-nutricao.git

cd sistema-nutricao
```

2. **Configure o backend e frontend usando Docker**

Rode os comandos Docker na raíz do projeto após abrir o Docker desktop:

Build inicial:
```bash
docker-compose build
```

Rodar em background:
```bash
docker-compose up -d
```

Ver logs em tempo real:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

Executar as migrações do prisma:
```bash
docker exec -it backend npx prisma migrate dev
```

Se for necessário parar tudo:
```bash
docker-compose down
```
