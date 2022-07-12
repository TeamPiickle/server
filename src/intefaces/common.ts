import { User } from './JwtPayloadInfo';

export default interface Request<B = any, Q = any, P = any, C = any> {
  file: Express.MulterS3.File;
  user: User;
  body: B;
  query: Q;
  params: P;
  cookies: C;
}

export class PiickleException extends Error {
  constructor(msg: string) {
    super();
    super.message = msg;
  }
}

export class IllegalArgumentException extends PiickleException {}
export class IllegalStateException extends PiickleException {}
export class NullDataException extends PiickleException {}
export class BadCredentialException extends PiickleException {}
export class InternalAuthenticationServiceException extends PiickleException {}
export class DuplicateException extends PiickleException {}
