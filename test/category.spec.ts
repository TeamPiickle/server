import request from 'supertest';
import app from '../src/index';

describe('GET /categories', () => {
  it('카테고리 조회 성공', async () => {
    await request(app)
      .get('/categories') // api 요청
      .set('Content-Type', 'application/json')
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('GET /categories/:categoryId', () => {
  it('카테고리별 대화 주제 리스트 조회 성공', async () => {
    await request(app)
      .get('/categories/62d96d39ddd728825c522ce3') // api 요청
      .set('Content-Type', 'application/json')
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('GET /categories/cards?search=', () => {
  it('카테고리별 대화 주제 리스트 성공', async () => {
    await request(app)
      .get('/categories/cards?search=') // api 요청
      .set('Content-Type', 'application/json')
      .query({
        search: ''
      })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});
