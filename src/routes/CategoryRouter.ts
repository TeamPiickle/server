import { Router } from 'express';
import { CategoryController } from '../controllers';
import flexibleAuth from '../middlewares/flexibleAuth';

const router: Router = Router();

router.get('/', CategoryController.getCategory);
router.get('/cards', flexibleAuth, CategoryController.getCardsBySearch);
router.get('/:categoryId', flexibleAuth, CategoryController.getCards);

export default router;
