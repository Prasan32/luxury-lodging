// config/database.js
import { Sequelize } from 'sequelize';
import { config as envConfig } from "./envConfig.js";

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = envConfig;

const DATABASE_URL = `mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'mysql',
    logging: false
}); 

export default sequelize;
