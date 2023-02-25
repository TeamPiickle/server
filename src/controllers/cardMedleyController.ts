import { Request, Response, NextFunction } from 'express';
import CardMedleyDto from '../intefaces/CardMedleyDto';
import { CardMedleyService } from '../services';
import statusCode from '../modules/statusCode';
import responseMessage from '../modules/responseMessage';
import util from '../modules/util';

const getCardMedleyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { medleyId } = req.params;
    const cardMedley: CardMedleyDto =
      await CardMedleyService.getCardsByMedleyId(medleyId);
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.READ_CARD_MEDLEY_DETAIL_SUCCESS,
          cardMedley
        )
      );
  } catch (err) {
    next(err);
  }
};

export { getCardMedleyById };
