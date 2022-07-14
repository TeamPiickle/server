import { Types } from 'mongoose';

export default interface ICard {
  content: string;
  tags: string[];
  category: Types.ObjectId[];
  filter: string[];
}
