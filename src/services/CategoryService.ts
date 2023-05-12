import { Category, CategoryDocument } from '../models/category';
import Card, { CardDocument } from '../models/card';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import Bookmark from '../models/bookmark';
import { IllegalArgumentException } from '../intefaces/exception';
import util from '../modules/util';

const CARD_SIZE_PER_REQUEST = 30;

const getCategory = async (): Promise<Array<object> | null> => {
  const categories: CategoryDocument[] = await Category.find(
    {},
    {
      title: 1,
      content: 2,
      unicode: 3,
      gradation: 4
    }
  ).sort({ order: 1 });
  if (!categories) return null;

  return categories;
};

const getRandomUniqueNumbersInRange = (to: number, size: number): number[] => {
  const result: number[] = [];
  const resultSize = Math.min(to, size);
  while (result.length < resultSize) {
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
        (await Bookmark.find({ user: userId, card: item._id }).count()) > 0;
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

const FILTER_R_RATED = '19금';

const makeQueryOption = (search: string[]) => {
  if (search.includes(FILTER_R_RATED)) {
    search.splice(search.indexOf(FILTER_R_RATED), 1);
    return {
      $or: [{ filter: { $all: search } }, { filter: FILTER_R_RATED }]
    };
  }
  return { filter: { $all: search } };
};

const getRandomizedPrimaryCards = async () => {
  const primaryCards = await Card.find({ filter: FILTER_R_RATED });
  const randomizedPrimaryCards = getRandomUniqueNumbersInRange(
    primaryCards.length,
    4
  ).map(idx => primaryCards[idx]);
  return randomizedPrimaryCards;
};

async function getFilteredCardsWithSize(
  search: string[],
  primaryCardsSize: number
) {
  const allCards = await Card.find({ filter: { $all: search } });
  const sizedCards = getRandomUniqueNumbersInRange(
    allCards.length,
    CARD_SIZE_PER_REQUEST - primaryCardsSize
  ).map(idx => allCards[idx]);
  return sizedCards;
}

const getCard = async (filterKeywords: string[]): Promise<CardDocument[]> => {
  const primaryCards = [];

  if (filterKeywords.includes(FILTER_R_RATED)) {
    const randomizedPrimaryCards = await getRandomizedPrimaryCards();

    primaryCards.push(...randomizedPrimaryCards);
    filterKeywords.splice(filterKeywords.indexOf(FILTER_R_RATED), 1);
  }

  const sizedCards = await getFilteredCardsWithSize(
    filterKeywords,
    primaryCards.length
  );
  return util.shuffle([...primaryCards, ...sizedCards]);
};

const getFilteredCards = async (
  filterKeywords: string[],
  userId?: Types.ObjectId
): Promise<CardResponseDto[]> => {
  try {
    const cardDocuments = await getCard(filterKeywords);

    const cardIds = cardDocuments.map(e => e._id);
    const bookmarks = await Bookmark.find({
      user: userId,
      card: { $in: cardIds }
    }).then(res => {
      return res.map(e => e.card.toString());
    });
    return cardDocuments.map((card: any) => {
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
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getCategory, getFilteredCards, getCardsWithIsBookmark };
