import { IllegalArgumentException } from '../intefaces/exception';
import KakaoResponse, {
  kakaoToPiickleUser
} from '../services/dto/KakaoResponse';
import NaverResponse, {
  naverToPiickleUser
} from '../services/dto/NaverResponse';
import { SocialLoginResponse } from '../services/dto/socialLoginResponse';
import IUser from './interface/IUser';

enum SocialVendor {
  NAVER = 'naver',
  KAKAO = 'kakao'
}

class SocialVendorExtension {
  private static nameToVendor: Map<string, SocialVendor> = new Map([
    ['naver', SocialVendor.NAVER],
    ['kakao', SocialVendor.KAKAO]
  ]);

  static vendorToUrl: Map<SocialVendor, string> = new Map([
    [SocialVendor.NAVER, 'https://openapi.naver.com/v1/nid/me'],
    [SocialVendor.KAKAO, 'https://kapi.kakao.com/v2/user/me']
  ]);

  static getVendorByValue(value: string): SocialVendor {
    const socialVendor = this.nameToVendor.get(value);
    if (!socialVendor) {
      throw new IllegalArgumentException('해당 이름의 소셜 서비스가 없습니다.');
    }
    return socialVendor;
  }

  static getUrlByVendor(value: string): string {
    const socialVendor = SocialVendorExtension.nameToVendor.get(value);
    if (!socialVendor) {
      throw new IllegalArgumentException('소셜 서비스가 올바르지 않습니다.');
    }
    const url = SocialVendorExtension.vendorToUrl.get(socialVendor)!;
    return url;
  }

  static socialUserConverter = new Map<
    SocialVendor,
    (response: SocialLoginResponse) => IUser
  >([
    [
      SocialVendor.NAVER,
      (response: SocialLoginResponse) => {
        const data = response.data as unknown as NaverResponse;
        return naverToPiickleUser(data);
      }
    ],
    [
      SocialVendor.KAKAO,
      (response: SocialLoginResponse) => {
        const data: KakaoResponse = response.data as unknown as KakaoResponse;
        return kakaoToPiickleUser(data);
      }
    ]
  ]);
}

export { SocialVendor, SocialVendorExtension };
