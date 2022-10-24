## create fresh db
docker-compose down -v
docker-compose up -d
## wait for docker container to be up
sleep 10;

## set up db
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

## start app
npm start