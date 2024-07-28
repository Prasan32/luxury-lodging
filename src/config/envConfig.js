import { config as conf } from 'dotenv';
conf();

const _config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOSTAWAY_CLIENT_ID: process.env.HOSTAWAY_CLIENT_ID,
    HOSTAWAY_CLIENT_SECRET: process.env.HOSTAWAY_CLIENT_SECRET,
};

export const config = Object.freeze(_config);