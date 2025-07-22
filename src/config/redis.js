import Redis from 'ioredis';
import logger from './winstonLoggerConfig.js';

const redisClient = new Redis({
    host: '127.0.0.1',     // Redis server hostname
    port: 6379,            // Default Redis port
});

redisClient.on('connect', () => logger.info('Connected to redisClient'));
redisClient.on('error', (err) => logger.error('redisClient error', err));

export default redisClient;
