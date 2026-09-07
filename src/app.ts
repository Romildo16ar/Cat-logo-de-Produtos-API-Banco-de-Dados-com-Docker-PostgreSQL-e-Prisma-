import express from 'express';
import { routes } from './routes';
import { notFoundHandler } from './middlewares/not-found';
import { errorHandler } from './middlewares/error-handler';

export const app = express();

app.use(express.json());

// Log simples de requisicoes
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);
