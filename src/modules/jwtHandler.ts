import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config';
import { JwtPayloadInfo } from '../intefaces/JwtPayloadInfo';

const getToken = (userId: Types.ObjectId): string => {
  const payload: JwtPayloadInfo = {
    user: {
      id: userId
    }
  };

  const accessToken: string = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '2h'
  });

  return accessToken;
};

export default getToken;
