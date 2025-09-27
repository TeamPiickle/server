import express from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler';
import corsMiddleware from './middlewares/cors';
import config from './config';
import sessionConfiguration from './middlewares/session/sessionConfiguration';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(corsMiddleware);
app.use(sessionConfiguration);
app.use(routes);
app.use(errorHandler);

connectDB()
  .then(() => {})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

app
  .listen(config.port, () => {
    console.log(`Server listening on port ${config.port}.`);
  })
  .on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
  });

export default app;
