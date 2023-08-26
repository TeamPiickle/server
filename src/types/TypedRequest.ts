import { Request } from 'express';

export type TypedRequest<ReqB = any, ReqQ = any, P = any> = Request<
  P,
  any,
  ReqB,
  ReqQ
>;
