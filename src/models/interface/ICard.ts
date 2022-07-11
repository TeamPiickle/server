import { Types } from 'mongoose';

export default interface ICard {
  content: string;
  gender: number[];
  ageGroup: number[];
  tags: string[];
  category: Types.ObjectId[];
  intimacy: number;
}
