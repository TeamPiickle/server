import { Router } from 'express';
import { CardController } from '../controllers';

const router = Router();

router.get('/best-5', CardController.getBest5);

export default router;
