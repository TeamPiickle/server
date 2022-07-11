import mongoose from 'mongoose';
import Category from '../models/category';
import config from '../config';
import { NullDataException } from '../intefaces/common';

const getCategory = async (): Promise<Array<object> | null> => {
  const categories = await Category.find({}, { title: 1 });
  if (!categories) return null;

  return categories;
};

export default {
  getCategory
};
