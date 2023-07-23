docker-compose down --volumes
docker-compose up -d
sleep 3
npx prisma db push --force-reset
