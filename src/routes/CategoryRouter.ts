import { Router } from 'express';
import { CategoryController } from '../controllers';

const router: Router = Router();

router.get('/', CategoryController.getCategory);
router.get('/:categoryId', CategoryController.getCards);
router.get('/cards/:cardId', CategoryController.getCardsBySearch);

export default router;
