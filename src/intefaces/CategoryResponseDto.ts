import { CardResponseDto } from './CardResponseDto';
import { Types } from 'mongoose';

export default interface CategoryResponseDto {
  _id: Types.ObjectId;
  title: string;
  cardList: CardResponseDto[];
}
