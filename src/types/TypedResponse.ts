import { Response } from 'express';

export type TypedResponse<ResB = any> = Response<ResB, any>;
