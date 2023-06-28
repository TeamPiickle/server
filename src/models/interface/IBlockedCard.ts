import { Types } from 'mongoose';

export default interface IBlockedCard {
  user: Types.ObjectId;
  card: Types.ObjectId;
}
