import Bookmark from '../models/bookmark';
import Card, { CardDocument } from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import BestCard from '../models/bestCard';
import { Nullable } from '../types/types';
interface CardIdAndCnt {
  _id: Types.ObjectId;
  count: number;
}

const findBestDummy = async (userId?: Types.ObjectId) => {
  const bestCards = await BestCard.find();
  const cardResList: Nullable<CardResponseDto>[] = await Promise.all(
    bestCards.map(async bestCard => {
      const c = await Card.findById(bestCard.card);
      if (!c) return null;
      const isBookmarked = userId
        ? await Bookmark.exists({ user: userId, card: c._id })
        : false;
      return {
        _id: c._id,
        content: c.content,
        tags: c.tags,
        category: c.category,
        filter: c.filter,
        isBookmark: !!isBookmarked
      };
    })
  );
  return cardResList.filter(value => value !== null);
};

const findBestCards = async (size: number, userId?: Types.ObjectId) => {
  const cardIdAndCnt = <CardIdAndCnt[]>await Bookmark.aggregate([
    { $match: { createdAt: { $gte: util.getLastMonth() } } }
  ])
    .sortByCount('card')
    .limit(size);
  let cards: CardDocument[] = [];
  let cardList: CardResponseDto[] = [];
  if (cardIdAndCnt.length > 0) {
    cards = <CardDocument[]>await Promise.all(
      cardIdAndCnt.map(async c => {
        return Card.findById(c._id);
      })
    );
    cardList = await Promise.all(
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
  }

  let extraCard: CardResponseDto[] = [];
  if (cards.length < size) {
    extraCard = await Card.find({ _id: { $nin: cards.map(c => c._id) } }).limit(
      size - cards.length
    );
  }

  const extraCardList = await Promise.all(
    extraCard.map(async (item: any) => {
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
  return [...cardList, ...extraCardList];
};
export { findBestCards, findBestDummy };
