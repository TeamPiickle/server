import { getCardsById } from '../src/services/cardMedleyService';
import connectDB from '../src/loaders/db';
import { assert } from 'chai';
import CardMedley, { CardMedleyDocument } from '../src/models/cardMedley';

describe('카드 메들리를 가져오는 서비스', () => {
  let medleyDocument: CardMedleyDocument;
  before(async () => {
    await connectDB();
    const newMedley = new CardMedley({
      title: '00주제 20선이에요',
      sticker: '모두모두 스티커',
      description: '설명이다',
      previewCards: [
        '6335b70bba6f0bd059f7d945',
        '6335b70bba6f0bd059f7d945',
        '6335b70bba6f0bd059f7d945'
      ],
      cards: ['6335b70bba6f0bd059f7d945']
    });
    await newMedley.save();
    medleyDocument = newMedley;
  });

  after(async () => {
    await CardMedley.deleteOne({
      _id: medleyDocument._id
    });
  });
  it('카드 메들리의 모든 정보가 포함돼있다.', async () => {
    const result = await getCardsById(medleyDocument._id.toString());
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
    const result = await getCardsById(medleyDocument._id.toString());
    assert(result.previewCards.length == 3);
  });
  it('카드가 비어있지 않다.', async () => {
    const result = await getCardsById(medleyDocument._id.toString());
    assert(result.cards.length != 0);
  });
});
