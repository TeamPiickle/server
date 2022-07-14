import express from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import config from './config';
import errorHandler from './middlewares/errorHandler';

const app = express();

connectDB()
  .then(() => {
    console.log('db connected successfully.');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(routes);
app.use(errorHandler);

app
  .listen(config.port, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port ${config.port} 🛡️
    ################################################
  `);
  })
  .on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
  });
