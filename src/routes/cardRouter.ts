import { Router } from 'express';
import { CardController } from '../controllers';
import flexibleAuth from '../middlewares/flexibleAuth';

const router = Router();
router.get(
  '/cardByBookmarkedGender/:gender',
  flexibleAuth,
  CardController.getCardByBookmarkedGender
);
router.get(
  '/recentlyBookmarkedCard',
  flexibleAuth,
  CardController.getRecentlyBookmarkedCard
);
router.get(
  '/recentlyUpdatedCard',
  flexibleAuth,
  CardController.getRecentlyUpdatedCard
);
router.get('/best', flexibleAuth, CardController.getBestCardList);
router.get('/:cardId', flexibleAuth, CardController.getCards);

export default router;
