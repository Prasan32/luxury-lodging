// config/database.js
import { Sequelize } from 'sequelize';
import config from './config.json';

const environment = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[environment];
const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

export default sequelize;