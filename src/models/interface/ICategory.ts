import { Types } from 'mongoose';

export default interface ICategory {
  title: string;
  imgurl: string;
  cardIdList: Types.ObjectId[];
}
