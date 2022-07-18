import { Types } from 'mongoose';

export default interface ICategory {
  title: string;
  content: string;
  imgurl: string;
  cardIdList: Types.ObjectId[];
}
