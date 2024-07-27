## Sequelize commands

## Migration
1. Command to generate migration file : **npx sequelize-cli migration:generate --name <migration_name>**
2. Command to migrate the models : **npx sequelize db:migrate**
   This will migrate all the models and migration files

## Seeders
3. Command to generate seed file : **npx sequelize-cli seed:generate --name <seeder_name>**
4. Command to insert the initial datas from seeders: **npx sequelize db:seed:all**
   This will insert any default values from all the seed files