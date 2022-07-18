import { Category, CategoryDocument } from '../models/category';
import Card from '../models/card';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import { CardResponseDto } from '../intefaces/CardResponseDto';

const shuffleCategories = (arr: CategoryDocument[]) => {
  arr.sort(() => Math.random() - 0.5);
};

const getCategory = async (): Promise<Array<object> | null> => {
  const categories: CategoryDocument[] = await Category.find(
    {},
    {
      title: 1,
      content: 2,
      imgurl: 3
    }
  );
  if (!categories) return null;
  shuffleCategories(categories);

  return categories;
};

const getCards = async (
  categoryId: string
): Promise<CategoryResponseDto | null> => {
  const cards: CategoryResponseDto | null = await Category.findById(
    categoryId
  ).populate('cardIdList');
  if (!cards) return null;

  return cards;
};

const getCardsBySearch = async (
  search: string[]
): Promise<CardResponseDto[] | null> => {
  try {
    const cards = await Card.find({ filter: { $all: search } });
    return cards;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getCategory, getCards, getCardsBySearch };
