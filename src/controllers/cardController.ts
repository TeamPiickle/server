import { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CardService } from '../services';
import { Types } from 'mongoose';
import { findBestCards } from '../services/cardService';

const BEST_PIICKLE_SIZE = 30;
/**
 *  @route /cards/best
 *  @desc 베스트 피클 30개를 가져옵니다.
 *  @access Public
 */
const getBestCardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: Types.ObjectId | undefined = req.user?.id;
    const cards = await CardService.findBestCards(BEST_PIICKLE_SIZE, userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_BEST_CARDS_SUCCESS, cards)
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /cards/:cardId
 *  @desc 아이디에 해당하는 카드 한 장을 조회합니다.
 *  @access Public
 */
const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = new Types.ObjectId(req.params.cardId);
    const card = await CardService.findCards(cardId, BEST_PIICKLE_SIZE);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_CARD_SUCCESS, card));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /cards/recentlyBookmarkedCard
 *  @desc 최근 북마크 된 카드를 조회합니다.
 *  @access Public
 */
const getRecentlyBookmarkedCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('정신차려');
    const card = await CardService.findRecentlyBookmarkedCard();
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.READ_RECENTLY_BOOKMARKED_CARD_SUCCESS,
          card
        )
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /cards/recentlyUpdatedCard
 *  @desc 최근 업데이트 된 카드를 조회합니다.
 *  @access Public
 */
const getRecentlyUpdatedCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await CardService.findRecentlyUpdatedCard();
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.READ_RECENTLY_UPDATE_CARD_SUCCESS,
          card
        )
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /cards/cardByBookmarkedGender/:gender
 *  @desc 아이디에 해당하는 카드 한 장을 조회합니다.
 *  @access Public
 */
const getCardByBookmarkedGender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gender = req.params.gender;
    const card = await CardService.findCardByBookmarkedGender(gender);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_GENDER_BEST_CARD_SUCCESS, card)
      );
  } catch (err) {
    next(err);
  }
};

export {
  getBestCardList,
  getCards,
  getRecentlyBookmarkedCard,
  getRecentlyUpdatedCard,
  getCardByBookmarkedGender
};
