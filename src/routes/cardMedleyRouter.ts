import { Router } from 'express';
import { CardMedleyController } from '../controllers';
import optionalUserResolver from '../middlewares/optionalUserResolver';

const router: Router = Router();

router.get('/', CardMedleyController.getAllMedleyPreview);
router.get(
  '/:medleyId',
  optionalUserResolver,
  CardMedleyController.getCardMedleyById
);

export default router;
