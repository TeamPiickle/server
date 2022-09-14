//router index file
import { Router } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';
import CardRouter from './cardRouter';
import TestRouter from './testRouter';

const router = Router();

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);
router.use('/ballots', BallotRouter);
router.use('/cards', CardRouter);
router.use('/test', TestRouter);

export default router;
