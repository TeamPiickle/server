import statusCode from '../modules/statusCode';

export abstract class PiickleException extends Error {
  constructor(msg: string) {
    super();
    super.message = msg;
  }

  abstract statusCode: number;
}

export class JwtNotDecodedException extends PiickleException {
  statusCode = statusCode.UNAUTHORIZED;
}

export class NullJwtException extends PiickleException {
  statusCode = statusCode.BAD_REQUEST;
}
export class IllegalArgumentException extends PiickleException {
  statusCode = statusCode.BAD_REQUEST;
}
export class IllegalStateException extends PiickleException {
  statusCode = statusCode.BAD_REQUEST;
}
export class NullDataException extends PiickleException {
  statusCode = statusCode.OK;
}
export class BadCredentialException extends PiickleException {
  statusCode = statusCode.UNAUTHORIZED;
}
export class InternalAuthenticationServiceException extends PiickleException {
  statusCode = statusCode.UNAUTHORIZED;
}
export class DuplicateException extends PiickleException {
  statusCode = statusCode.BAD_REQUEST;
}

export class EmailNotVerifiedException extends PiickleException {
  statusCode = statusCode.BAD_REQUEST;
}

export class InternalServerError extends Error {
  constructor(msg: string) {
    super();
    super.message = msg;
  }
}

export class EmptyMailCodeException extends InternalServerError {}
