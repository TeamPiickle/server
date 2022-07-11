import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.post('', UserController.postUser);

export default router;
