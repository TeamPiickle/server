import mongoose from 'mongoose';
import config from '../config';

const connectDB = async () => {
  await mongoose.connect(config.mongoURI);
  mongoose.set('autoCreate', true);
  console.log('Mongoose Connected ...');
};

export default connectDB;
