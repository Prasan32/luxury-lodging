import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
const app = express();
import { handleWebhookResponses } from "./controllers/payment.controller.js";

app.use(cors());
app.use(helmet());

const rawBodyMiddleware = (req, res, next) => {
    if (req.path === '/payment/handlewebhookresponses') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            console.log('inside the raw body middleware');
            handleWebhookResponses(req, res, next);
        });
    } else {
        next();
    }
};


app.use(rawBodyMiddleware);

app.use(express.json());
app.use(appRoutes)

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;