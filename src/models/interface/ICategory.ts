import { Types } from 'mongoose';

export default interface ICategory {
  title: string;
  cardIdList: Types.ObjectId[];
}
