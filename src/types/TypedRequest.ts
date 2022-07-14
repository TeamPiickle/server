import { Request } from 'express';

export type TypedRequest<ReqB = any, ReqQ = any> = Request<
  any,
  any,
  ReqB,
  ReqQ
>;
