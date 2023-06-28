import Bookmark, { BookmarkDocument } from '../models/bookmark';
import Card, { CardDocument } from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
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

const findBestCardsLimit = async (size: number) => {
  const cardsWithBookmarkCount = <CardIdAndCnt[]>await Bookmark.aggregate()
    .group({ _id: '$card', count: { $sum: 1 } })
    .sort('-count _id')
    .limit(size);
  return (
    await Promise.all(
      cardsWithBookmarkCount.map(cardWithBookmarkCount =>
        Card.findById(cardWithBookmarkCount._id)
      )
    )
  ).filter(util.isNotEmpty);
};

const findExtraCardsExceptFor = async (cards: CardDocument[], size: number) => {
  const extraCards: CardDocument[] = await Card.find({
    _id: { $nin: cards.map(c => c._id) }
  })
    .sort('_id')
    .limit(size - cards.length);
  return extraCards;
};

const findBestCards = async (size: number, userId?: Types.ObjectId) => {
  const cards = await findBestCardsLimit(size);
  const extraCards =
    cards.length < size ? await findExtraCardsExceptFor(cards, size) : [];

  const totalCards: CardResponseDto[] = [];
  for (const card of [...cards, ...extraCards]) {
    totalCards.push(await createCardResponse(card, userId));
  }

  return totalCards;
};

const findCards = async (cardId: Types.ObjectId, size: number) => {
  const cards: CardDocument[] = await Card.find({
    _id: cardId
  });
  const extraCards =
    cards.length < size ? await findExtraCardsExceptFor(cards, size) : [];
  const totalCards: CardResponseDto[] = [];
  for (const card of [...cards, ...extraCards]) {
    totalCards.push({
      _id: card._id,
      content: card.content,
      tags: card.tags,
      category: card.category,
      filter: card.filter,
      isBookmark: false
    });
  }
  return totalCards;
};

const findRecentlyUpdatedCard = async () => {
  const cards: CardDocument[] = await Card.aggregate()
    .sort({ createdAt: -1 })
    .limit(20);
  const totalCards: CardResponseDto[] = [];
  for (const card of cards) {
    totalCards.push({
      _id: card._id,
      content: card.content,
      tags: card.tags,
      category: card.category,
      filter: card.filter,
      isBookmark: false
    });
  }
  return {
    recentlyDate: cards[0].createdAt,
    cardResponseDtos: totalCards
  };
};

const findRecentlyBookmarkedCard = async () => {
  const bookmarks: BookmarkDocument[] = await Bookmark.aggregate()
    .sort({ createdAt: -1 })
    .limit(20);
  const cards: CardDocument[] = (
    await Promise.all(bookmarks.map(bookmark => Card.findById(bookmark.card)))
  ).filter(util.isNotEmpty);
  const totalCards: CardResponseDto[] = [];
  for (const card of cards) {
    totalCards.push({
      _id: card._id,
      content: card.content,
      tags: card.tags,
      category: card.category,
      filter: card.filter,
      isBookmark: false
    });
  }
  return {
    recentlyDate: bookmarks[0].createdAt,
    cardResponseDtos: totalCards
  };
};

const findCardByBookmarkedGender = async (gender: string) => {
  const bookmarks = await Bookmark.aggregate()
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'userInfo'
    })
    .match({ 'userInfo.gender': gender })
    .group({ _id: '$card', count: { $sum: 1 } })
    .sort('-count _id');
  const cards: CardDocument[] = (
    await Promise.all(bookmarks.map(bookmark => Card.findById(bookmark._id)))
  ).filter(util.isNotEmpty);
  const totalCards: CardResponseDto[] = [];
  for (const card of cards) {
    totalCards.push({
      _id: card._id,
      content: card.content,
      tags: card.tags,
      category: card.category,
      filter: card.filter,
      isBookmark: false
    });
  }
  return totalCards;
};

export {
  findBestCards,
  findCards,
  findRecentlyBookmarkedCard,
  findCardByBookmarkedGender,
  findRecentlyUpdatedCard
};
