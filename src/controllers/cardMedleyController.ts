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
    const cardMedley: CardMedleyDto = await CardMedleyService.getCardsById(
      medleyId
    );
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

const getAllMedleyPreview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const medleyPreviews = await CardMedleyService.getPreviewById();
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.READ_CARD_MEDLEY_PREVIEWS_SUCCESS,
          medleyPreviews
        )
      );
  } catch (err) {
    next(err);
  }
};

export { getCardMedleyById, getAllMedleyPreview };
