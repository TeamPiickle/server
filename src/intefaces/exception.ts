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

export class InternalServerError extends Error {
  constructor(msg: string) {
    super();
    super.message = msg;
  }
}

export class EmptyMailCodeException extends InternalServerError {}
