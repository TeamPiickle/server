import Bookmark from '../models/bookmark';
import Card from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
interface CardIdAndCnt {
  _id: Types.ObjectId;
  count: number;
}

const findBestCards = async (size: number) => {
  const cardIdAndCnt = <CardIdAndCnt[]>await Bookmark.aggregate([
    { $match: { createdAt: { $gte: util.getLastMonth() } } }
  ])
    .sortByCount('card')
    .limit(size);

  const cards = <CardResponseDto[]>await Promise.all(
    cardIdAndCnt.map(async c => {
      return Card.findById(c._id, '_id category content');
    })
  );

  let extraCard: CardResponseDto[] = [];
  if (cards.length < size) {
    extraCard = await Card.find({ _id: { $nin: cards.map(c => c._id) } }).limit(
      size - cards.length
    );
  }
  return [...cards, ...extraCard];
};
export { findBestCards };
