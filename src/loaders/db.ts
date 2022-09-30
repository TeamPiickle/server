import mongoose, { Model } from 'mongoose';
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
import QuitLog from '../models/quitLog';
import BestCard from '../models/bestCard';

const createCollection = (model: Model<any>) => {
  model
    .createCollection()
    .then(() => {
      console.log(`${model.modelName} collection created.`);
    })
    .catch(err => {
      console.log(err);
    });
};

const connectDB = async () => {
  await mongoose.connect(config.mongoURI);
  mongoose.set('autoCreate', true);
  console.log('Mongoose Connected ...');

  const models = [
    User,
    PreUser,
    Card,
    Category,
    Bookmark,
    BallotTopic,
    BallotItem,
    BallotResult,
    QuitLog,
    EmailAuth,
    BestCard
  ];

  models.forEach(model => {
    createCollection(model);
  });
};

export default connectDB;
