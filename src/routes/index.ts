//router index file
import { Router } from 'express';
import UserRouter from './userRouter';
import CategoryRouter from './CategoryRouter';

const router = Router();

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);

export default router;
