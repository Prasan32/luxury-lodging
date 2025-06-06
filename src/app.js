import express from 'express';
const app = express();
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
import { handleWebhookResponses } from "./controllers/payment.controller.js";
import createHttpError from 'http-errors';
import { config } from "./config/envConfig.js";
import logger from './config/winstonLoggerConfig.js';
import { scheduledJobs } from "./utils/jobScheduler.js"

const whitelist = config.CORS_WHITELIST ? config.CORS_WHITELIST.split(',') : [];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(createHttpError(403, 'Forbidden'));
        }
    },
    optionsSuccessStatus: 200,
};

app.use(cors(config.NODE_ENV === "development" ? {} : corsOptions));
config.NODE_ENV !== "development" && app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'];
    const host = req.headers.host

    // Allow requests to the Stripe webhook endpoint regardless of the Origin header
    if (req.path === '/payment/handlewebhookresponses') {
        return next();
    }

    if (!whitelist.includes(host)) {
        logger.error(`Request from unknown host: ${host}`);
        logger.error(`Client IP: ${clientIp}`);
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
});

app.use(helmet());

// Apply raw body middleware specifically for the webhook route
app.post('/payment/handlewebhookresponses', express.raw({ type: 'application/json' }), handleWebhookResponses);

app.use(express.json());
scheduledJobs();
app.use(appRoutes)

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;