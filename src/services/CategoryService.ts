import { Category, CategoryDocument } from '../models/category';
import Card from '../models/card';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import Types from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import Bookmark from '../models/bookmark';
import { IllegalArgumentException } from '../intefaces/exception';

const CARD_SIZE_PER_REQUEST = 30;

const getCategory = async (): Promise<Array<object> | null> => {
  const categories: CategoryDocument[] = await Category.find(
    {},
    {
      title: 1,
      content: 2,
      imgurl: 3
    }
  ).sort({ __v: 1 });
  if (!categories) return null;

  return categories;
};

const getRandomUniqueNumbersInRange = (to: number, size: number): number[] => {
  const result: number[] = [];
  while (result.length < size) {
    const randomNumberInRange = Math.floor(Math.random() * to);
    if (!result.includes(randomNumberInRange)) {
      result.push(randomNumberInRange);
    }
  }
  return result;
};

const getCardsWithIsBookmark = async (
  categoryId: string,
  userId?: Types.ObjectId
): Promise<CategoryResponseDto | null> => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new IllegalArgumentException('해당 id의 카테고리가 없습니다.');
  }
  const allCards = await Card.find({ category: categoryId });

  const randomCards = getRandomUniqueNumbersInRange(
    allCards.length,
    CARD_SIZE_PER_REQUEST
  ).map(idx => allCards[idx]);

  const cardList = await Promise.all(
    randomCards.map(async (item: any) => {
      const isBookmark =
        (await Bookmark.find({ user: userId, card: item._id }).count()) > 0
          ? true
          : false;
      return {
        _id: item._id,
        content: item.content,
        tags: item.tags,
        category: item.Category,
        filter: item.filter,
        isBookmark: isBookmark
      };
    })
  );

  return {
    _id: category._id,
    title: category.title,
    cardList
  };
};

const getCardsBySearch = async (
  search: string[],
  userId?: Types.ObjectId
): Promise<CardResponseDto[]> => {
  try {
    const allCards = await Card.find({ filter: { $all: search } });

    const cardDocuments = getRandomUniqueNumbersInRange(
      allCards.length,
      CARD_SIZE_PER_REQUEST
    ).map(idx => allCards[idx]);

    const cardIds = cardDocuments.map(e => e._id);
    const bookmarks = await Bookmark.find({
      user: userId,
      card: { $in: cardIds }
    }).then(res => {
      return res.map(e => e.card.toString());
    });
    const cardList = cardDocuments.map((card: any) => {
      let isBookmark = false;
      if (userId) {
        isBookmark = bookmarks.indexOf(card._id.toString()) != -1;
      }
      return {
        _id: card._id,
        content: card.content,
        tags: card.tags,
        category: card.Category,
        filter: card.filter,
        isBookmark: isBookmark
      };
    });
    return cardList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getCategory, getCardsBySearch, getCardsWithIsBookmark };
