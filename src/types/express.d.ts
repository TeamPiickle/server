import 'express-session';
import { Types } from 'mongoose';
type User = {
  id: Types.ObjectId;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
      guestId?: string;
    }
  }
}

declare module 'express-session' {
  interface Session {
    isGuest: boolean;
  }
}
