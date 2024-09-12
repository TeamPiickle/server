import IUser from '../../models/interface/IUser';
import User, { UserDocument } from '../../models/user/user';
import { SocialVendor } from '../../models/socialVendor';
import config from '../../config';
import { Gender } from '../../models/user/gender';
import { AgeGroup } from '../../models/user/ageGroup';

export default interface KakaoResponse {
  id: string;
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email?: string;
    has_age_range: boolean;
    age_range_needs_agreement: boolean;
    age_range: string; //"20~29"
    has_birthday: boolean;
    birthday_needs_agreement: boolean;
    birthday: string; //"1103"
    birthday_type: string; //"SOLAR",
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender: string; // "female"
  };
}

const toPiickleGender = (gender: string): Gender => {
  if (gender == 'female') {
    return Gender.FEMALE;
  }
  if (gender == 'male') {
    return Gender.MALE;
  }
  return Gender.ETC;
};

const toPiickleAgeGroup = (ageGroup: string): AgeGroup => {
  switch (ageGroup) {
    case '1~9':
    case '10~14':
      return AgeGroup.CHILDREN;
    case '15~19':
      return AgeGroup.ADOLESCENT;
    case '20~29':
      return AgeGroup.TWENTIES;
    case '30~39':
      return AgeGroup.THIRTIES;
    case '40~49':
      return AgeGroup.FORTIES;
    case '50~59':
      return AgeGroup.FIFTIES;
    case '60~69':
    case '70~79':
    case '80~89':
      return AgeGroup.OVER_SIXTIES;
    default:
      return AgeGroup.UNDEFINED;
  }
};

const kakaoToPiickleUser = (kakaoUser: KakaoResponse): IUser => {
  const nickname =
    kakaoUser.kakao_account?.profile?.nickname ?? `kakao ${kakaoUser.id}`;
  const profileImageUrl =
    kakaoUser.kakao_account.profile.profile_image_url ||
    config.defaultProfileImgUrl;

  return {
    socialId: kakaoUser.id,
    socialVendor: SocialVendor.KAKAO,
    email: kakaoUser.kakao_account.email,
    nickname,
    gender: toPiickleGender(kakaoUser.kakao_account.gender),
    ageGroup: toPiickleAgeGroup(kakaoUser.kakao_account.age_range),
    profileImageUrl,
    cardIdList: []
  };
};

export { kakaoToPiickleUser };
