export default interface Request<B = any, Q = any, P = any, C = any> {
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

export class NullDataException extends PiickleException {}
export class BadCredentialException extends PiickleException {}
export class InternalAuthenticationServiceException extends PiickleException {}
