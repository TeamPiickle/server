import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers';
import auth from '../middlewares/auth';
import upload from '../config/multer';

const router = Router();

router.post(
  '/email-verification',
  [body('email').notEmpty()],
  UserController.sendEmailVerification
);

router.get('/email-check', UserController.verifyEmail);

router.get('/nickname/is-exist', UserController.nicknameDuplicationCheck);
router.post('/naverLogin', UserController.naverLogin);
router.post(
  '',
  upload.single('imgFile'),
  [body('email').notEmpty(), body('password').notEmpty()],
  UserController.postUser
);

router.patch(
  '',
  auth,
  upload.single('imgFile'),
  [body('nickname').notEmpty(), body('birthday').notEmpty()],
  UserController.patchUser
);

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
