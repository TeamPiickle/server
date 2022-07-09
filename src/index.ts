import express, { Request, Response } from 'express';
import connectDB from './loaders/db';
import routes from './routes';
import helmet from 'helmet';
import config from './config';

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

app.use(routes); //라우터
// error handler

interface ErrorType {
  message: string;
  status: number;
}

app.use(function (err: ErrorType, req: Request, res: Response) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app
  .listen(config.port, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port ${config.port}🛡️
    ################################################
  `);
  })
  .on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
  });
