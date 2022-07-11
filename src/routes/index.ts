//router index file
import { Router } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';

const router = Router();

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);
router.use('/ballots', BallotRouter);

export default router;
