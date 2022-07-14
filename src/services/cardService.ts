import Bookmark from '../models/bookmark';
import Card from '../models/card';

const findBestCards = async (size: number) => {
  const beforeAMonth = new Date();
  beforeAMonth.setMonth(beforeAMonth.getMonth() - 1);

  const cardIdAndCnt = await Bookmark.aggregate([
    { $match: { createdAt: { $gte: beforeAMonth } } }
  ])
    .sortByCount('card')
    .limit(size);
  const cards = await Promise.all(
    cardIdAndCnt.map(async c => {
      return Card.findById(c._id);
    })
  );
  return cards;
};
export { findBestCards };
