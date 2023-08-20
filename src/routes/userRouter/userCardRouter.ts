import { Router } from 'express';
import { UserController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/blacklist', auth, UserController.blockCard);
router.delete('/blacklist/:cardId', auth, UserController.cancelToBlock);
export default router;
