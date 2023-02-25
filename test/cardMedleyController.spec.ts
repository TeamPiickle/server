import request from 'supertest';
import serverApp from '../src';
import CardMedley, { CardMedleyDocument } from '../src/models/cardMedley';
import { expect } from 'chai';
describe('getCardMedleyById', () => {
  let medleyDocument: CardMedleyDocument;
  before(async () => {
    const newMedley = new CardMedley({
      title: '00주제 20선이에요',
      sticker: '모두모두 스티커',
      description: '설명이다',
      previewCards: [],
      cards: []
    });
    await newMedley.save();
    medleyDocument = newMedley;
  });

  after(async () => {
    await CardMedley.deleteOne({
      _id: medleyDocument._id
    });
  });

  it('성공', async () => {
    const response = await request(serverApp)
      .get(`/medley/${medleyDocument._id}`)
      // .get('/medley/63fa114b9d67f7a87f13ec9d')
      .set('Content-Type', 'application/json')
      .expect(200);
    const medley = response.body.data;
    expect(medley.title).to.be.equal('00주제 20선이에요');
    expect(medley.sticker).to.be.equal('모두모두 스티커');
    expect(medley.description).to.be.equal('설명이다');
  });
});
