//router index file
import { Router } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';
import { BallotController } from '../controllers';
import CardRouter from './cardRouter';
import TestRouter from './testRouter';
import CardMedleyRouter from './cardMedleyRouter';
import flexibleAuth from '../middlewares/flexibleAuth';

import session from 'express-session';
import uidSetter from '../middlewares/session/uidSetter';
import MongoStore from 'connect-mongo';
import config from '../config';
import cors from 'cors';

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

const cookieCors = cors({
  origin: 'https://client-wheat-three.vercel.app',
  credentials: true
});

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);
router.get('/ballots', flexibleAuth, BallotController.getMainBallotList);
router.use(
  '/ballots',
  cookieCors,
  expressSession,
  uidSetter,
  flexibleAuth,
  BallotRouter
);
router.use('/cards', CardRouter);
router.use('/test', TestRouter);
router.use('/medley', CardMedleyRouter);
export default router;
