import mongoose from 'mongoose';
import Category from '../models/category';
import config from '../config';

const getCategory = async (): Promise<Array<object> | null> => {
  try {
    const categories = await Category.find({}, { title: 1 });
    if (!categories) return null;

    return categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getCategory
};
