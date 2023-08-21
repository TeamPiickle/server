import { Router } from 'express';
import { Mind23Controller } from '../controllers';
import flexibleAuth from '../middlewares/flexibleAuth';

const router: Router = Router();

router.get('/questions', Mind23Controller.getQuestionList);
router.post(
  '/comments/:questionId',
  flexibleAuth,
  Mind23Controller.createComment
);
router.get(
  '/comments/:questionId',
  flexibleAuth,
  Mind23Controller.getCommentList
);
router.post('/prize-entry', flexibleAuth, Mind23Controller.createPrizeEntry);

export default router;
