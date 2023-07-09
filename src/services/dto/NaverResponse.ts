import IUser from '../../models/interface/IUser';
import { SocialVendor } from '../../models/socialVendor';
import config from '../../config';
import { AgeGroup } from '../../models/user/ageGroup';
import { Gender } from '../../models/user/gender';

export default interface NaverResponse {
  message: string;
  response: {
    email: string;
    /**
     * nickname
     * (별명이 설정되어 있지 않으면 id*** 형태로 리턴됩니다.)
     */
    nickname: string;
    profile_image?: string;
    age?: string;
    /**
     * gender
     * - F: 여성
     * - M: 남성
     * - U: 확인불가
     */
    gender?: string;
    id: string;
    name?: string;
    birthday?: string;
    birthyear?: string;
    mobile?: string;
  };
}

const toPiickleGender = (naverGender?: string): Gender => {
  switch (naverGender) {
    case 'F':
      return Gender.FEMALE;
    case 'M':
      return Gender.MALE;
    default:
      return Gender.ETC;
  }
};

const toPiickleAgeGroup = (age?: string): AgeGroup => {
  switch (age) {
    case '0-9':
    case '10-19':
      return AgeGroup.ADOLESCENT;
    case '20-29':
      return AgeGroup.TWENTIES;
    case '30-39':
      return AgeGroup.THIRTIES;
    case '40-49':
      return AgeGroup.FORTIES;
    case '50-59':
      return AgeGroup.FIFTIES;
    case '60-':
      return AgeGroup.OVER_SIXTIES;
    default:
      return AgeGroup.UNDEFINED;
  }
};

const naverToPiickleUser = (naverUser: NaverResponse): IUser => {
  const nickname =
    naverUser.response.nickname || `naver ${naverUser.response.id}`;
  const profileImageUrl =
    naverUser.response.profile_image || config.defaultProfileImgUrl;
  return {
    socialId: naverUser.response.id,
    socialVendor: SocialVendor.NAVER,
    email: naverUser.response.email,
    nickname,
    ageGroup: toPiickleAgeGroup(naverUser.response.age),
    gender: toPiickleGender(naverUser.response.gender),
    profileImageUrl,
    cardIdList: []
  };
};

export { naverToPiickleUser };
