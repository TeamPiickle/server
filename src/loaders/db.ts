import mongoose, { Model } from 'mongoose';
import config from '../config';
import Bookmark from '../models/bookmark';
import Card from '../models/card';
import { Category } from '../models/category';
import User from '../models/user/user';
import EmailAuth from '../models/emailAuth';
import { BallotTopic } from '../models/ballotTopic';
import BallotItem from '../models/ballotItem';
import { BallotResult } from '../models/ballotResult';
import PreUser from '../models/preUser';
import QuitLog from '../models/quitLog';
import BestCard from '../models/bestCard';
import CardMedley from '../models/cardMedley';
import { BlockedCard } from '../models/blockedCard';
import Question from '../models/mind23/question';
import PrizeEntry from '../models/mind23/prizeEntry';
import Comment from '../models/mind23/comment';

const createCollection = (model: Model<any>) => {
  model.createCollection().catch(err => {
    console.log(err);
  });
};

const connectDB = async () => {
  await mongoose.connect(config.mongoURI);
  mongoose.set('autoCreate', true);

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
    BestCard,
    CardMedley,
    BlockedCard,
    CardMedley,
    Question,
    Comment,
    PrizeEntry
  ];

  models.forEach(model => {
    createCollection(model);
  });
};

export default connectDB;
