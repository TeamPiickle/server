import mongoose from 'mongoose';
import Category from '../models/category';
import Card from '../models/card';
import config from '../config';
import { NullDataException } from '../intefaces/common';
import { CardResponseDto } from '../intefaces/CardResponseDto';

const getCategory = async (): Promise<Array<object> | null> => {
  const categories = await Category.find({}, { title: 1 });
  if (!categories) return null;

  return categories;
};

const getCards = async (
  categoryId: string
): Promise<Array<CategoryResponseDto[]> | null> => {
  const cards = await Category.findById(categoryId);
  if (!cards) return null;

  return cards;
};

export default {
  getCategory,
  getCards
};
