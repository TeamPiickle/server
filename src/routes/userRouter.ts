import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers';

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

export default router;
