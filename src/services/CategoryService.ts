import { Category, CategoryDocument } from '../models/category';
import Card from '../models/card';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import Types from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import Bookmark from '../models/bookmark';
import { IllegalArgumentException } from '../intefaces/exception';
import { CategoryInfoDto } from '../intefaces/CategoryInfoDto';

const shuffleCard = (arr: CategoryInfoDto[]) => {
  arr.sort(() => Math.random() - 0.5);
};

const shuffleCards = (arr: CardResponseDto[]) => {
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
  ).sort({ __v: 1 });
  if (!categories) return null;

  return categories;
};

const getCardsWithIsBookmark = async (
  userId: Types.ObjectId | undefined,
  categoryId: string
): Promise<CategoryResponseDto | null> => {
  const cards = await Category.findById(categoryId)
    .populate('cardIdList')
    .then(item => {
      if (!item) {
        throw new IllegalArgumentException('해당 id의 카테고리가 없습니다.');
      }
      return {
        _id: item._id,
        title: item.title,
        cardList: item.cardIdList
      };
    });

  if (!cards) return null;
  const cardList = await Promise.all(
    cards.cardList.map(async (item: any) => {
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
  shuffleCard(cardList);

  return {
    _id: cards._id,
    title: cards.title,
    cardList
  };
};

const getCardsBySearch = async (
  search: string[],
  userId: Types.ObjectId | undefined
): Promise<CardResponseDto[] | null> => {
  try {
    const cards = await Card.find({ filter: { $all: search } });
    shuffleCards(cards);
    if (!cards) return null;
    const cardList = await Promise.all(
      cards.map(async (item: any) => {
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
    return cardList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getCategory, getCardsBySearch, getCardsWithIsBookmark };
