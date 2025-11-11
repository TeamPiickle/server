import KakaoResponse, {
  kakaoToPiickleUser
} from '../src/services/dto/KakaoResponse';
import { expect } from 'chai';

describe('kakaoToPiickleUser', () => {
  it('should return IUser', () => {
    const kakaoUser: KakaoResponse = {
      id: '1234',
      kakao_account: {
        profile_nickname_needs_agreement: true,
        profile_image_needs_agreement: true,
        profile: {
          // nickname: 'nickname',
          thumbnail_image_url: 'kakao',
          profile_image_url: 'kakao',
          is_default_image: true
        },
        has_email: true,
        email_needs_agreement: true,
        is_email_valid: true,
        is_email_verified: true,
        email: 'kakao',
        has_age_range: true,
        age_range_needs_agreement: true,
        age_range: '20~29',
        has_birthday: true,
        birthday_needs_agreement: true,
        birthday: '1103',
        birthday_type: 'SOLAR',
        has_gender: true,
        gender_needs_agreement: true,
        gender: 'female'
      }
    };
    const convertedUser = kakaoToPiickleUser(kakaoUser);
    expect(convertedUser.nickname).equals('kakao 1234');
  });
});
