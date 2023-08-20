export default interface SocialLoginDto {
  vendor: string;
  accessToken?: string;
  code?: string;
  state?: string;
}
