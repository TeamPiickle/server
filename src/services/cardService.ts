import Bookmark from '../models/bookmark';
import Card from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
interface CardIdAndCnt {
  _id: Types.ObjectId;
  count: number;
}

const findBestCards = async (
  userId: Types.ObjectId | undefined,
  size: number
) => {
  const cardIdAndCnt = <CardIdAndCnt[]>await Bookmark.aggregate([
    { $match: { createdAt: { $gte: util.getLastMonth() } } }
  ])
    .sortByCount('card')
    .limit(size);
  console.log(userId);
  const cards = <CardResponseDto[]>await Promise.all(
    cardIdAndCnt.map(async c => {
      return Card.findById(c._id);
    })
  );
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
export { findBestCards };
