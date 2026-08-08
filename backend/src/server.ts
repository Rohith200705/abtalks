import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import challengesRouter from './routes/challenges';
import codeRouter from './routes/code';
import submissionsRouter from './routes/submissions';
import progressRouter from './routes/progress';
import leaderboardRouter from './routes/leaderboard';
import userRouter from './routes/user';
import achievementsRouter from './routes/achievements';
import githubRouter from './routes/github';
import linkedinRouter from './routes/linkedin';

dotenv.config();

const app = express();
const PORT = env.PORT;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for code routes
const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many code execution requests, please try again later.',
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Health check (inline)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/challenges', challengesRouter);
app.use('/api/code', codeLimiter, codeRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/user', userRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/github', githubRouter);
app.use('/api/linkedin', linkedinRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, function () {
      console.log('Server running on port ' + PORT);
      console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
