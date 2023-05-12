import express, { Request, Response } from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import config from './config';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

const expressSession: express.RequestHandler = session({
  secret: config.sessionKey,
  store: MongoStore.create({
    mongoUrl: config.mongoURI
  }),
  cookie: { maxAge: 3.6e6 * 24 * 180 },
  resave: false,
  saveUninitialized: false
});

app.use(expressSession);

app.use(routes);
app.use('', (req: Request, res: Response) => {
  res.status(200).send();
});
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
