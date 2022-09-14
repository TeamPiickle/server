import { Router } from 'express';
import User from '../models/user';
import util from '../modules/util';
import { TypedRequest } from '../types/TypedRequest';
import config from '../config';
import statusCode from '../modules/statusCode';

const router = Router();

router.delete(
  '/user',
  async (req: TypedRequest<{ email: string; key: string }>, res, next) => {
    const { email, key } = req.body;
    if (key !== config.clientKey) {
      return res
        .status(statusCode.FORBIDDEN)
        .send(util.fail(statusCode.FORBIDDEN, '권한이 없습니다.'));
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send(util.fail(400, '없는 이메일'));
      }
      await user.delete();
      res
        .status(200)
        .send(util.success(200, '유저 삭제 성공', { deletedUserEmail: email }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
