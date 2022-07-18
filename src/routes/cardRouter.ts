import { Router } from 'express';
import { CardController } from '../controllers';
import flexibleAuth from '../middlewares/flexibleAuth';

const router = Router();

router.get('/best', flexibleAuth, CardController.getBestCardList);

export default router;
