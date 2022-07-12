import mongoose from 'mongoose';
import Category from '../models/category';
import Card from '../models/card';
import config from '../config';
import { NullDataException } from '../intefaces/common';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';

const getCategory = async (): Promise<Array<object> | null> => {
  const categories = await Category.find({}, { title: 1 });
  if (!categories) return null;

  return categories;
};

const getCards = async (
  categoryId: string
): Promise<CategoryResponseDto[] | null> => {
  const cards = await Category.findById(categoryId).populate('cardIdList');
  if (!cards) return null;

  return cards;
};

export default {
  getCategory,
  getCards
};
