import { Router, RequestHandler } from 'express';
import { body } from 'express-validator';
import { BallotController } from '../controllers';
import auth from '../middlewares/auth';
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

router.use(expressSession, uidSetter);

const cookieCors = cors({
  origin: 'https://client-wheat-three.vercel.app',
  credentials: true
});

router.post(
  '',
  cookieCors,
  [body('ballotTopicId').notEmpty(), body('ballotItemId').notEmpty()],
  BallotController.postBallotResult
);
router.get('/:ballotTopicId', cookieCors, BallotController.getBallotStatus);
router.get('', BallotController.getMainBallotList);

export default router;
