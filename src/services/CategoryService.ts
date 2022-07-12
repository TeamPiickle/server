import Category from '../models/category';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';

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

export default {
  getCategory,
  getCards
};
