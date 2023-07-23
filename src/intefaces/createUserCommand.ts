import { AgeGroup, AgeGroupKey } from '../models/user/ageGroup';
import { Gender, GenderKey } from '../models/user/gender';

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

export { CreateUserCommand, CreateUserReq };
