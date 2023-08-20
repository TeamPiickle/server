//router index file
import { Router, RequestHandler } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';
import { BallotController } from '../controllers';
import CardRouter from './cardRouter';
import TestRouter from './testRouter';
import CardMedleyRouter from './cardMedleyRouter';
import flexibleAuth from '../middlewares/flexibleAuth';
import guestHandler from '../middlewares/session/guestHandler';

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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);

router.use(
  '/ballots',
  cookieCors,
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
