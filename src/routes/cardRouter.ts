import { Router } from 'express';
import { CardController } from '../controllers';

const router = Router();

router.get('/best', CardController.getBestCardList);

export default router;
