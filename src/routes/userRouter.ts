import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers';
import auth from '../middlewares/auth';
import upload from '../config/multer';

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
  [body('email').notEmpty(), body('password').notEmpty()],
  UserController.loginUser
);

router.get('', auth, UserController.getUserProfile);

router.patch(
  '/profile-image',
  auth,
  upload.single('file'),
  UserController.updateUserProfileImage
);

router.patch(
  '/nickname',
  auth,
  [body('nickname').notEmpty()],
  UserController.updateUserNickname
);

export default router;
