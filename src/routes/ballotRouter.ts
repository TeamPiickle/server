import { Router } from 'express';
import { body } from 'express-validator';
import { BallotController } from '../controllers';
import auth from '../middlewares/auth';
import flexibleAuth from '../middlewares/flexibleAuth';

const router = Router();

router.post(
  '',
  auth,
  [body('ballotTopicId').notEmpty(), body('ballotItemId').notEmpty()],
  BallotController.postBallotResult
);

router.get('/:ballotTopicId', flexibleAuth, BallotController.getBallotStatus);
router.get('', BallotController.getMainBallotList);

export default router;
