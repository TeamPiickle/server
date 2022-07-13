import Category from '../models/category';
import Card from '../models/card';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import { CardResponseDto } from '../intefaces/CardResponseDto';
const getCategory = async (): Promise<Array<object> | null> => {
  const categories = await Category.find({}, { title: 1, content: 2 });
  if (!categories) return null;

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
): Promise<CardResponseDto[]> => {
  // const regex = (pattern: string) => new RegExp(`.*${pattern}.*`);

  try {
    //const filterRegex = search.map(e => regex(e)); // regex array

    const cards = await Card.find({ filter: { $all: search } });

    return cards;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getCategory,
  getCards,
  getCardsBySearch
};
