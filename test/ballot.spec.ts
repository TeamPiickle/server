import request from 'supertest';
import app from '../src/index';

describe('POST /ballots', () => {
  it('투표 성공', async () => {
    await request(app)
      .post('/ballots') // api 요청
      .set('Content-Type', 'application/json')
      .set(
        'x-auth-token',
        'Bearar eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJkOTZmZWI2ODJkMzk2Y2MwYzE1ZmI0In0sImlhdCI6MTY1ODQxNzEzMSwiZXhwIjoxNjg5OTUzMTMxfQ.YYcRoZzFTfRtEcMQwvhurpVrI5iPiC2uogvL1jlqoKQ'
      )
      .send({
        ballotTopicId: '62cff6135b1e11673a0a876f',
        ballotItemId: '62cff6585b1e11673a0a8776'
      })
      .expect(201) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('투표 실패', async () => {
    await request(app)
      .post('/ballots') // api 요청
      .set('Content-Type', 'application/json')
      .expect(401) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('Get /ballots/:ballotTopicId', () => {
  it('투표 현황 조회 성공', async () => {
    await request(app)
      .get('/ballots/62cff6135b1e11673a0a876f') // api 요청
      .set('Content-Type', 'application/json')
      .set(
        'x-auth-token',
        'Bearar eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJkOTZmZWI2ODJkMzk2Y2MwYzE1ZmI0In0sImlhdCI6MTY1ODQxNzEzMSwiZXhwIjoxNjg5OTUzMTMxfQ.YYcRoZzFTfRtEcMQwvhurpVrI5iPiC2uogvL1jlqoKQ'
      )
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('GET /ballots', () => {
  it('투표 목록 조회 성공', async () => {
    await request(app)
      .get('/ballots') // api 요청
      .set('Content-Type', 'application/json')
      .set(
        'x-auth-token',
        'Bearar eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJkOTZmZWI2ODJkMzk2Y2MwYzE1ZmI0In0sImlhdCI6MTY1ODQxNzEzMSwiZXhwIjoxNjg5OTUzMTMxfQ.YYcRoZzFTfRtEcMQwvhurpVrI5iPiC2uogvL1jlqoKQ'
      )
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});
