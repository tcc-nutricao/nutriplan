#!/bin/sh

echo "Esperando o banco de dados ficar disponível..."
# opcional: aguarda alguns segundos, ou use wait-for-it/dockerize em produção
sleep 5

echo "Aplicando migrations do Prisma..."
npx prisma migrate deploy

echo "Iniciando servidor..."
npm run dev
