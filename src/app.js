import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import appRoutes from "./routes/app.routes.js";
const app = express();

app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
    if (req.url == "/payment/handlewebhookresponses") {
        console.log("inside raw");
        app.use(express.raw({ type: 'application/json' }));
    } else {
        console.log("inside json");
        app.use(express.json());
    }
    next();
});


app.use(appRoutes)

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;