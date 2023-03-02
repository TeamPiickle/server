import { Router } from 'express';
import { CardMedleyController } from '../controllers';
import flexibleAuth from '../middlewares/flexibleAuth';

const router: Router = Router();

router.get('/', CardMedleyController.getAllMedleyPreview);
router.get('/:medleyId', flexibleAuth, CardMedleyController.getCardMedleyById);

export default router;
