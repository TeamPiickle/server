import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers';
import auth from '../middlewares/auth';

const router = Router();

router.post(
  '',
  [
    body('email').notEmpty(),
    body('name').notEmpty(),
    body('password').notEmpty(),
    body('nickname').notEmpty()
  ],
  UserController.postUser
);

router.post(
  '/login',
  auth,
  [body('email').notEmpty(), body('password').notEmpty()],
  UserController.loginUser
);

router.get('', auth, UserController.getUserProfile);

export default router;
