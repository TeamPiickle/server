import { Router } from 'express';
import { CardMedleyController } from '../controllers';

const router: Router = Router();

router.get('/', CardMedleyController.getAllMedleyPreview);
router.get('/:medleyId', CardMedleyController.getCardMedleyById);

export default router;
