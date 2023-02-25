import CardMedley, { CardMedleyDocument } from '../models/cardMedley';
import { IllegalArgumentException } from '../intefaces/exception';
import { Nullable } from '../types/types';
import { Types } from 'mongoose';

interface CardMedleyDTO {
  _id: Types.ObjectId;
  title: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
  cards: Types.ObjectId[];
}
const getCardsByMedleyId = async (id: string): Promise<CardMedleyDTO> => {
  const cardMedley: Nullable<CardMedleyDocument> = await CardMedley.findById(
    id
  ).populate('cards');
  if (!cardMedley) {
    throw new IllegalArgumentException(
      '해당하는 아이디의 카드 메들리가 없습니다.'
    );
  }
  return {
    _id: cardMedley._id,
    title: cardMedley.title,
    sticker: cardMedley.sticker,
    description: cardMedley.description,
    previewCards: cardMedley.previewCards,
    cards: cardMedley.cards
  };
};

export { getCardsByMedleyId };
