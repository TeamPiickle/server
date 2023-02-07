import { Types } from 'mongoose';

export default interface ICategory {
  title: string;
  content: string;
  cardIdList: Types.ObjectId[];
  gradation: string;
  order: number;
}
