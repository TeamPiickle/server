import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../../controllers';
import auth from '../../middlewares/auth';
import upload from '../../config/multer';
import userCardRouter from './userCardRouter';

const router = Router();

router.use('/cards', userCardRouter);

router.get('/existing', UserController.readEmailIsExisting);

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

router.get('', auth, UserController.getUserProfile);
router.get('/bookmarks', auth, UserController.getBookmarks);

router.put(
  '/bookmarks',
  auth,
  [body('cardId').notEmpty()],
  UserController.createdeleteBookmark
);

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

router.put('/me', auth, UserController.deleteUser);

export default router;
