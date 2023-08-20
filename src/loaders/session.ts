import express from 'express';
import session from 'express-session';
import config from '../config';
import MongoStore from 'connect-mongo';

const expressSession: express.RequestHandler = session({
  secret: config.sessionKey,
  store: MongoStore.create({
    mongoUrl: config.mongoURI
  }),
  cookie: { maxAge: 3.6e6 * 24 * 180 },
  resave: false,
  saveUninitialized: false
});

export default expressSession;
