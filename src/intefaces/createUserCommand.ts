import {AgeGroup, AgeGroupKey} from '../models/user/ageGroup';

interface CreateUserCommand {
  email: string;
  password: string;
  nickname: string;
  ageGroup: AgeGroup;
  gender: string;
  profileImgUrl: string;
}

interface CreateUserReq {
  email: string;
  password: string;
  nickname: string;
  ageGroup: AgeGroupKey;
  gender: string;
}

export { CreateUserCommand, CreateUserReq };
