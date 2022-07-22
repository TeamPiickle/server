import request from 'supertest';
import app from '../src/index';

describe('GET /cards/best', () => {
  it('이번 달의 베스트 피클 30개 조회 성공', async () => {
    await request(app)
      .get('/cards/best') // api 요청
      .set('Content-Type', 'application/json')
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});
