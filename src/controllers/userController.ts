import { Response } from 'express';
import Request from '../intefaces/common';
import CreateUserCommand from '../intefaces/createUserCommand';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 *  @route /users
 *  @desc 회원가입 api
 *  @access Public
 */
const postUser = async (req: Request<CreateUserCommand>, res: Response) => {
  try {
    const { name, email, password, nickname } = req.body;
    if (!name || !email || !password || !nickname) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
      return;
    }
    const createUserCommand: CreateUserCommand = {
      name,
      email,
      password,
      nickname
    };
    await UserService.createUser(createUserCommand);
    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.USER_CREATED));
  } catch (err) {
    console.log(err);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default { postUser };
