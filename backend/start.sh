#!/bin/sh

echo "Esperando o banco de dados ficar disponível..."
# opcional: aguarda alguns segundos, ou use wait-for-it/dockerize em produção
./wait-for-it.sh db:3306 --timeout=30 --strict -- echo "Banco pronto!"

echo "Aplicando migrations do Prisma..."
npx prisma migrate deploy

echo "Iniciando servidor..."
npm run dev
