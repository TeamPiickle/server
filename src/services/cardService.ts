import Bookmark from '../models/bookmark';
import Card, { CardDocument } from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import BestCard from '../models/bestCard';
import { Nullable } from '../types/types';
import user from '../models/user';
interface CardIdAndCnt {
  _id: Types.ObjectId;
  count: number;
}

const findBookmark = async (
  cardId: Types.ObjectId,
  userId?: Types.ObjectId
) => {
  if (!userId) {
    return false;
  }
  return (await Bookmark.exists({ user: userId, card: cardId })) !== null;
};

const createCardResponse = async (
  card: CardDocument,
  userId: Types.ObjectId | undefined
): Promise<CardResponseDto> => {
  return {
    _id: card._id,
    content: card.content,
    tags: card.tags,
    category: card.category,
    filter: card.filter,
    isBookmark: await findBookmark(card._id, userId)
  };
};

function notEmpty<CardDocument>(
  value: CardDocument | null | undefined
): value is CardDocument {
  if (value === null || value === undefined) return false;
  const testDummy: CardDocument = value;
  return true;
}

const findBestCards = async (size: number, userId?: Types.ObjectId) => {
  const cardsWithBookmarkCount = <CardIdAndCnt[]>(
    await Bookmark.aggregate().sortByCount('card').limit(size)
  );
  const cards: CardDocument[] = (
    await Promise.all(
      cardsWithBookmarkCount.map(cardWithBookmarkCount =>
        Card.findById(cardWithBookmarkCount._id)
      )
    )
  ).filter(notEmpty);

  const extraCards: CardDocument[] = await Card.find({
    _id: { $nin: cards.map(c => c._id) }
  }).limit(size - cards.length);

  const totalCards: CardResponseDto[] = [];
  for (const card of [...cards, ...extraCards]) {
    totalCards.push(await createCardResponse(card, userId));
  }

  return totalCards;
};

export { findBestCards };
