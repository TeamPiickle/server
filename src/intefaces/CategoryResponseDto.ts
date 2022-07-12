import { CardResponseDto } from './CardResponseDto';

export default interface CategoryResponseDto {
  title: string;
  cardList: [CardResponseDto];
}
