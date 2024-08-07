import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
const app = express();
import { handleWebhookResponses } from "./controllers/payment.controller.js";

app.use(cors());
app.use(helmet());

// Add this route before the appRoutes to ensure raw body for the webhook
app.post('payment/handlewebhookresponses', express.raw({ type: 'application/json' }), handleWebhookResponses);
console.log('after webhook response');
app.use(express.json());
app.use(appRoutes)

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;