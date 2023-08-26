import { Router } from 'express';
import { CardController } from '../controllers';
import optionalUserResolver from '../middlewares/optionalUserResolver';

const router = Router();
router.get(
  '/cardByBookmarkedGender/:gender',
  optionalUserResolver,
  CardController.getCardByBookmarkedGender
);
router.get(
  '/recentlyBookmarkedCard',
  optionalUserResolver,
  CardController.getRecentlyBookmarkedCard
);
router.get(
  '/recentlyUpdatedCard',
  optionalUserResolver,
  CardController.getRecentlyUpdatedCard
);
router.get('/best', optionalUserResolver, CardController.getBestCardList);
router.get('/:cardId', optionalUserResolver, CardController.getCards);

export default router;
