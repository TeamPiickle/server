import { Router } from 'express';
import { CategoryController } from '../controllers';
import optionalUserResolver from '../middlewares/optionalUserResolver';

const router: Router = Router();

router.get('/', CategoryController.getCategory);
router.get('/cards', optionalUserResolver, CategoryController.getCardsBySearch);
router.get('/:categoryId', optionalUserResolver, CategoryController.getCards);

export default router;
