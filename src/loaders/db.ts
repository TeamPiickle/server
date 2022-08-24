import mongoose from 'mongoose';
import config from '../config';
import Bookmark from '../models/bookmark';
import Card from '../models/card';
import { Category } from '../models/category';
import User from '../models/user';
import EmailAuth from '../models/emailAuth';
import { BallotTopic } from '../models/ballotTopic';
import BallotItem from '../models/ballotItem';
import { BallotResult } from '../models/ballotResult';
import PreUser from '../models/preUser';

const connectDB = async () => {
  await mongoose.connect(config.mongoURI);
  mongoose.set('autoCreate', true);
  console.log('Mongoose Connected ...');

  PreUser.createCollection()
    .then(() => {
      console.log('PreUser collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  User.createCollection()
    .then(() => {
      console.log('User collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  Card.createCollection()
    .then(() => {
      console.log('Card collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  Category.createCollection()
    .then(() => {
      console.log('Category collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  Bookmark.createCollection()
    .then(() => {
      console.log('Bookmark collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  BallotTopic.createCollection()
    .then(() => {
      console.log('BallotTopic collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  BallotItem.createCollection()
    .then(() => {
      console.log('BallotItem collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  BallotResult.createCollection()
    .then(() => {
      console.log('BallotResult collection created.');
    })
    .catch(err => {
      console.log(err);
    });
  EmailAuth.createCollection()
    .then(() => {
      console.log('EmailAuth collection created.');
    })
    .catch(err => {
      console.log(err);
    });
};

export default connectDB;
