import CardMedley, { CardMedleyDocument } from '../models/cardMedley';
import { IllegalArgumentException } from '../intefaces/exception';
import { Nullable } from '../types/types';
import CardMedleyDto from '../intefaces/CardMedleyDto';
import CardMedleyPreviewDto from '../intefaces/CardMedleyPreviewDto';
import Bookmark from '../models/bookmark';
import { CardResponseDto } from '../intefaces/CardResponseDto';
import { Types } from 'mongoose';

const getCardsById = async (
  id: string,
  userId: Nullable<string>
): Promise<CardMedleyDto> => {
  const cardMedley: Nullable<CardMedleyDocument> = await CardMedley.findById(
    id
  ).populate('cards');
  if (!cardMedley) {
    throw new IllegalArgumentException(
      '해당하는 아이디의 카드 메들리가 없습니다.'
    );
  }
  const cardDtos: CardResponseDto[] = await Promise.all(
    cardMedley.cards.map(async (card: any) => {
      return {
        _id: card._id as Types.ObjectId,
        content: card.content as string,
        tags: card.tags as string[],
        category: card.category as Types.ObjectId[],
        filter: card.filter as string[],
        isBookmark: userId
          ? !!(await Bookmark.exists({
              user: userId,
              card: card._id
            }))
          : false
      };
    })
  );

  return {
    _id: cardMedley._id,
    title: cardMedley.title,
    sticker: cardMedley.sticker,
    description: cardMedley.description,
    previewCards: cardMedley.previewCards,
    cards: cardDtos
  };
};

const getPreviewById = async (): Promise<CardMedleyPreviewDto[]> => {
  const cardMedleys: CardMedleyDocument[] = await CardMedley.find().populate(
    'previewCards',
    'content'
  );
  return cardMedleys.map(cardMedley => {
    return {
      _id: cardMedley._id,
      title: cardMedley.title,
      sticker: cardMedley.sticker,
      description: cardMedley.description,
      previewCards: cardMedley.previewCards
    };
  });
};

export { getCardsById, getPreviewById };
