import { Types } from 'mongoose';
import { Mind23CardResponseDto } from '../mind23/Mind23CardResponseDto';

export interface QuestionResponseDto {
  totalCount: Number;
  cards: Mind23CardResponseDto[];
}
