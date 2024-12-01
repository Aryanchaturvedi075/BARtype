import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { typingRoutes } from './routes/typing.js';
import { CONFIG } from './config/environment.js';

const app = express();

app.use(cors({
    origin: CONFIG.CORS_ORIGIN
}));
app.use(helmet());
app.use(express.json());

app.use('/api', typingRoutes);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
});