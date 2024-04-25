import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../../controllers';
import userResolver from '../../middlewares/userResolver';
import upload from '../../config/multer';
import userCardRouter from './userCardRouter';

const router = Router();

router.use('/cards', userCardRouter);

router.get('/existing', UserController.readEmailIsExisting);

router.post(
  '/email-verification',
  [body('email').notEmpty()],
  UserController.sendEmailVerification
);

router.get('/email-check', UserController.verifyEmail);

router.get('/email-check/test', UserController.verifyEmailTest);

router.get('/nickname/is-exist', UserController.nicknameDuplicationCheck);

router.post(
  '',
  upload.single('imgFile'),
  [body('email').notEmpty(), body('password').notEmpty()],
  UserController.postUser
);

router.post('/social', UserController.socialLogin);

router.post(
  '/login',
  [body('email').notEmpty(), body('password').notEmpty()],
  UserController.postUserLogin
);

router.get('', userResolver, UserController.getUserProfile);
router.get('/bookmarks', userResolver, UserController.getBookmarks);

router.put(
  '/bookmarks',
  userResolver,
  [body('cardId').notEmpty()],
  UserController.createdeleteBookmark
);

router.patch(
  '/profile-image',
  userResolver,
  upload.single('file'),
  UserController.updateUserProfileImage
);

router.patch(
  '/nickname',
  userResolver,
  [body('nickname').notEmpty()],
  UserController.updateUserNickname
);

router.put('/me', userResolver, UserController.deleteUser);

export default router;
