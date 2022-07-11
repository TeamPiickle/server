import { Router } from 'express';
import { CategoryController } from '../controllers';

const router: Router = Router();

router.get('/', CategoryController.getCategory);

export default router;
