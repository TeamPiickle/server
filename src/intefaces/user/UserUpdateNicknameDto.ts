import { JwtPayloadInfo } from '../JwtPayloadInfo';

export interface UserUpdateNicknameDto extends JwtPayloadInfo {
  nickname: string;
}
