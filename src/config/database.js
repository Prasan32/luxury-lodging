// config/database.js
import { Sequelize } from 'sequelize';
import { config as envConfig } from "./envConfig.js";

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = envConfig;
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    DATABASE_HOST,
    dialect: 'mysql',
    DATABASE_PORT,
    logging: false
}); 

export default sequelize;
