import express, { RequestHandler } from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler';
import * as SentryConfig from './loaders/sentryConfiguration';
import corsMiddleware from './middlewares/cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './config';

const expressSession: RequestHandler = session({
  secret: config.sessionKey,
  store: MongoStore.create({
    mongoUrl: config.mongoURI
  }),
  cookie: {
    sameSite: 'none',
    httpOnly: true,
    secure: true,
    maxAge: 3.6e6 * 24 * 180
  },
  resave: false,
  saveUninitialized: false
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
SentryConfig.initializeSentry(app);

app.use(expressSession);
app.use(corsMiddleware);
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
