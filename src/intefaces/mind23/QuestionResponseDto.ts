import { Types } from 'mongoose';
import { CardResponseDto } from '../CardResponseDto';

export interface QuestionResponseDto {
  totalCount: Number;
  cards: CardResponseDto[];
}
