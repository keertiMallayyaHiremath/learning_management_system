import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';

const app = express();

app.use(cors({ 
  origin: config.cors.origin, 
  credentials: config.cors.credentials 
}));
app.use(helmet());
app.use(json());
app.use(cookieParser());
app.use(requestLogger);

// Import routes
import healthRouter from './modules/health/health.routes';
import authRouter from './modules/auth/auth.routes';
import subjectRouter from './modules/subjects/subject.routes';
import videoRouter from './modules/videos/video.routes';
import progressRouter from './modules/progress/progress.routes';

// Mount routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/videos', videoRouter);
app.use('/api/progress', progressRouter);

app.use(errorHandler);

export default app;