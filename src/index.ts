import express from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import config from './config';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import * as SentryConfig from './loaders/sentryConfiguration';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
SentryConfig.initializeSentry(app);

app.use(routes);
SentryConfig.attachSentryErrorHandler(app);
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log('db connected successfully.');
  })
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
