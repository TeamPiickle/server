//router index file
import { Router } from 'express';
import UserRouter from './userRouter';

const router = Router();

router.use('/users', UserRouter);

export default router;
