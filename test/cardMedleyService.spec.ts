import { getCardsByMedleyId } from '../src/services/cardMedleyService';
import connectDB from '../src/loaders/db';
import { assert } from 'chai';

describe('카드 메들리를 가져오는 서비스', () => {
  before(async () => {
    await connectDB();
  });
  it('출력', async () => {
    const result = await getCardsByMedleyId('63fa114b9d67f7a87f13ec9d');
    console.log(result);
  });
  it('카드 메들리의 모든 정보가 포함돼있다.', async () => {
    const result = await getCardsByMedleyId('63fa114b9d67f7a87f13ec9d');
    assert.containsAllKeys(result, [
      '_id',
      'title',
      'sticker',
      'description',
      'previewCards',
      'cards'
    ]);
  });
  it('미리보기 카드가 3장 존재한다.', async () => {
    const result = await getCardsByMedleyId('63fa114b9d67f7a87f13ec9d');
    assert(result.previewCards.length == 3);
  });
  it('카드가 비어있지 않다.', async () => {
    const result = await getCardsByMedleyId('63fa114b9d67f7a87f13ec9d');
    assert(result.cards.length != 0);
  });
});
