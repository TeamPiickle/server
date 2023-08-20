//router index file
import { Router } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';
import BallotRouter from './ballotRouter';
import CardRouter from './cardRouter';
import TestRouter from './testRouter';
import Mind23Router from './mind23Router';
import CardMedleyRouter from './cardMedleyRouter';
import flexibleAuth from '../middlewares/flexibleAuth';
import guestHandler from '../middlewares/guestHandler';

const router = Router();

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);
router.use('/ballots', flexibleAuth, guestHandler, BallotRouter);
router.use('/cards', CardRouter);
router.use('/test', TestRouter);
router.use('/medley', CardMedleyRouter);
router.use('/mind23/api', Mind23Router);
export default router;
