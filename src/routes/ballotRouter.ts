import { Router } from 'express';
import { body } from 'express-validator';
import ballotController from '../controllers/ballotController';
import auth from '../middlewares/auth';

const router = Router();

router.post(
  '',
  auth,
  [body('ballotTopicId').notEmpty(), body('ballotItemId').notEmpty()],
  ballotController.postBallotResult
);

export default router;
