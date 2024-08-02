import { config as conf } from 'dotenv';
conf();

const _config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOSTAWAY_CLIENT_ID: process.env.HOSTAWAY_CLIENT_ID,
    HOSTAWAY_CLIENT_SECRET: process.env.HOSTAWAY_CLIENT_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
};

export const config = Object.freeze(_config);