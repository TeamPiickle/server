//router index file
import { Router, RequestHandler } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';
import CardRouter from './cardRouter';
import TestRouter from './testRouter';
import CardMedleyRouter from './cardMedleyRouter';
import flexibleAuth from '../middlewares/flexibleAuth';
import guestHandler from '../middlewares/session/guestHandler';

import session from 'express-session';
import uidSetter from '../middlewares/session/uidSetter';
import MongoStore from 'connect-mongo';
import config from '../config';

const router = Router();

const expressSession: RequestHandler = session({
  secret: config.sessionKey,
  store: MongoStore.create({
    mongoUrl: config.mongoURI
  }),
  cookie: {
    sameSite: 'none',
    secure: true,
    maxAge: 3.6e6 * 24 * 180
  },
  resave: false,
  saveUninitialized: false
});

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);

router.use(
  '/ballots',
  expressSession,
  uidSetter,
  guestHandler,
  flexibleAuth,
  BallotRouter
);

router.use('/cards', CardRouter);
router.use('/test', TestRouter);
router.use('/medley', CardMedleyRouter);
export default router;
