// config/database.js
import { Sequelize } from 'sequelize';
import config from './config.json' assert { type: 'json' };;
import { config as envConfig } from "./envConfig.js";

const environment = envConfig.NODE_ENV;
const { username, password, database, host, dialect } = config[environment];
const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

export default sequelize;