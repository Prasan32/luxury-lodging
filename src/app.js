import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
})

export default app;