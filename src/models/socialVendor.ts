import { IllegalArgumentException } from '../intefaces/exception';

class SocialVendorToUrl {
  static vendorToUrl: Map<string, string> = new Map([
    ['naver', 'https://openapi.naver.com/v1/nid/me'],
    ['kakao', 'https://kapi.kakao.com/v2/user/me']
  ]);

  static fromVendorValue(value: string): string {
    const url = this.vendorToUrl.get(value);
    if (!url) {
      throw new IllegalArgumentException('소셜 서비스가 올바르지 않습니다.');
    }
    return url;
  }
}

export { SocialVendorToUrl };
