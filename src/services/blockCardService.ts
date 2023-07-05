import { Types, MongooseError } from 'mongoose';
import User from '../models/user/user';
import { IllegalArgumentException } from '../intefaces/exception';
import Card from '../models/card';
import { BlockedCard } from '../models/blockedCard';

const validateUserId = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new IllegalArgumentException(
      `userId: ${userId.toString()} 해당 아이디의 유저를 찾을 수 없습니다.`
    );
  }
};

const validateCardId = async (cardId: Types.ObjectId) => {
  const card = await Card.findById(cardId);
  if (!card) {
    throw new IllegalArgumentException(
      `cardId: ${cardId.toString()} 해당 아이디의 카드를 찾을 수 없습니다.`
    );
  }
};

const handleErrorCausedByDuplicatedKey = (error: any) => {
  const mongooseError = error as { code: number };
  if (mongooseError.code == 11000) {
    throw new IllegalArgumentException('이미 블랙리스트에 있는 카드입니다.');
  }
}

const blockCard = async (userId: Types.ObjectId, cardId: Types.ObjectId) => {
  await validateUserId(userId);
  await validateCardId(cardId);
  const newBlockedCard = new BlockedCard({
    user: userId,
    card: cardId
  });
  try {
    await newBlockedCard.save();
  } catch (e) {
    handleErrorCausedByDuplicatedKey(e);
    throw e;
  }
};

const cancelToBlockCard = async (
  userId: Types.ObjectId,
  cardId: Types.ObjectId
) => {
  await validateUserId(userId);
  await validateCardId(cardId);
  const deleted = await BlockedCard.findOneAndDelete({
    user: userId,
    card: cardId
  });
  if (!deleted) {
    throw new IllegalArgumentException('블랙리스트에 없는 카드입니다.');
  }
};

export { blockCard, cancelToBlockCard };
