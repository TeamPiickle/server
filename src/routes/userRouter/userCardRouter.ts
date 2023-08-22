import { Router } from 'express';
import { UserController } from '../../controllers';
import userResolver from '../../middlewares/userResolver';

const router = Router();

router.post('/blacklist', userResolver, UserController.blockCard);
router.delete('/blacklist/:cardId', userResolver, UserController.cancelToBlock);
export default router;
