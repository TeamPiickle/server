import { Router } from 'express';
import { Mind23Controller } from '../controllers';
import optionalUserResolver from '../middlewares/optionalUserResolver';

const router: Router = Router();

router.get('/questions', Mind23Controller.getQuestionList);
router.post(
  '/comments/:questionId',
  optionalUserResolver,
  Mind23Controller.createComment
);
router.get(
  '/comments/:questionId',
  optionalUserResolver,
  Mind23Controller.getCommentList
);
router.post(
  '/prize-entry',
  optionalUserResolver,
  Mind23Controller.createPrizeEntry
);

export default router;
