import { Types } from 'mongoose';

type User = {
  id: Types.ObjectId;
};

declare namespace Express {
  export interface Request {
    user: User;
  }
}
