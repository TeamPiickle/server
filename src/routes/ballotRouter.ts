import { Router } from 'express';
import { body } from 'express-validator';
import { BallotController } from '../controllers';

const router = Router();

router.post(
  '',
  [body('ballotTopicId').notEmpty(), body('ballotItemId').notEmpty()],
  BallotController.postBallotResult
);

router.get('/:ballotTopicId', BallotController.getBallotStatus);

router.get('', BallotController.getMainBallotList);

export default router;
