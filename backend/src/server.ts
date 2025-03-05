import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
// import BookRouter from '../src/collections/book/router';
import { errorHandler } from './middleware/errorHadler';
import helmet from 'helmet';
import { limiter, paramProtection } from './middleware/security';
import config from './config/config';
import { initializeDatabase } from './database';
import UserRouter from '../src/collections/user/router';
// @ts-ignore
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(helmet()); // Security headers

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add database connection
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express TypeScript API' });
});
app.use('/api', limiter);
app.use('/api/users', UserRouter);

app.use(paramProtection); // Parameter pollution protection

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
if (process.env.NODE_ENV !== 'test') {
  // Test database connection and sync models
  initializeDatabase().then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  });
} // Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

export default app;
