import express from 'express';
const app = express();
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
import { handleWebhookResponses } from "./controllers/payment.controller.js";
import createHttpError from 'http-errors';
import { config } from "./config/envConfig.js";

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

app.use(cors(corsOptions));
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
});

app.use(helmet());

// Apply raw body middleware specifically for the webhook route
app.post('/payment/handlewebhookresponses', express.raw({ type: 'application/json' }), handleWebhookResponses);

app.use(express.json());
app.use(appRoutes)

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;