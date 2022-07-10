import { Types } from 'mongoose';

export default interface ICard {
  content: string;
  gender: number[];
  ageGroup: number[];
  category: Types.ObjectId[];
  intimacy: number;
}
