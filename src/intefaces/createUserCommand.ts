import config from '../config';
import { AgeGroup, AgeGroupKey } from '../models/user/ageGroup';
import { Gender, GenderKey } from '../models/user/gender';
import { TypedRequest } from '../types/TypedRequest';

interface CreateUserCommand {
  email: string;
  password: string;
  nickname: string;
  ageGroup: AgeGroup;
  gender: Gender;
  profileImgUrl: string;
}

interface CreateUserReq {
  email: string;
  password: string;
  nickname: string;
  ageGroup?: AgeGroupKey;
  gender?: GenderKey;
}

const toCommand = (req: TypedRequest<CreateUserReq>) => {
  const createUserCommand: CreateUserCommand = {
    email: req.body.email,
    password: req.body.password,
    nickname: req.body.nickname,
    ageGroup: req.body.ageGroup
      ? AgeGroup[req.body.ageGroup]
      : AgeGroup.UNDEFINED,
    gender: req.body.gender ? Gender[req.body.gender] : Gender.ETC,
    profileImgUrl: `${config.imageServerUrl}/${
      (req?.file as Express.MulterS3.File)?.key
    }`
  };
  return createUserCommand;
};

export { CreateUserCommand, CreateUserReq, toCommand };
