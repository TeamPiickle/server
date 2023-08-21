import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from '../../config';
import { RequestHandler } from 'express';

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
  proxy: true,
  saveUninitialized: false
});

export default expressSession;
