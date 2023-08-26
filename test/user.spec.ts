import User from '../src/models/user/user';
import { before, after } from 'mocha';
import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { IllegalStateException } from '../src/intefaces/exception';
import LoginResponseDto from '../src/intefaces/user/LoginResponseDto';

dotenv.config({ path: `.env.test` });
const mongoTestUri = process.env.MONGODB_URI;

if (!mongoTestUri) {
  throw new IllegalStateException('cannot read test database uri');
}

let jwtToken = 'Bearar ';
before(async () => {
  try {
    await mongoose.connect(mongoTestUri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

describe('POST /users 유저 생성 API', () => {
  it('유저 생성 성공', async () => {
    await request(app)
      .post('/users') // api 요청
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: 'test@gmail.com',
        password: 'test',
        nickname: 'test'
      })
      .expect(201) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 생성 실패', async () => {
    await request(app)
      .post('/users') // api 요청
      .set('Content-Type', 'application/json')
      .expect(400) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

type LoginResponse = { body: { data: LoginResponseDto } };
describe('POST /users/login 유저 로그인 API', () => {
  it('유저 로그인 성공', async () => {
    await request(app)
      .post('/users/login') // api 요청
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@gmail.com',
        password: 'test'
      })
      .expect((res: LoginResponse) => {
        jwtToken = `Bearer ${res.body.data.accessToken}`;
      })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 로그인 실패', async () => {
    await request(app)
      .post('/users/login') // api 요청
      .set('Content-Type', 'application/json')
      .expect(400) // 예측 상태 코드
      .expect('Content-Type', /json/);
  });
});

describe('GET /users 유저 프로필 조회 API', () => {
  it('유저 프로필 조회 성공', async () => {
    await request(app)
      .get('/users') // api 요청
      .set('Content-Type', 'application/json')
      .set('x-auth-token', jwtToken)
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 프로필 조회 실패', async () => {
    await request(app)
      .get('/users') // api 요청
      .set('Content-Type', 'application/json')
      .expect(401) // 예측 상태 코드
      .expect('Content-Type', /json/);
  });
});

describe('PATCH /users/nickname 유저 닉네임 변경 API', () => {
  it('유저 닉네임 변경 성공', async () => {
    await request(app)
      .patch('/users/nickname') // api 요청
      .set('Content-Type', 'application/json')
      .set('x-auth-token', jwtToken)
      .send({
        nickname: 'testNickname'
      })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 닉네임 변경 실패', async () => {
    await request(app)
      .patch('/users/nickname') // api 요청
      .set('Content-Type', 'application/json')
      .expect(401) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('PATCH /users/profile-image 유저 프로필 이미지 변경 API', () => {
  it('유저 프로필 이미지 변경 성공', async () => {
    await request(app)
      .patch('/users/profile-image') // api 요청
      .set('Content-Type', 'multipart/form-data')
      .set('x-auth-token', jwtToken)
      .attach('file', 'test/스크린샷 2022-07-04 오후 8.30.19.png')
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/);
  });
  it('유저 프로필 이미지 변경 실패', async () => {
    await request(app)
      .patch('/users/profile-image') // api 요청
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'test/스크린샷 2022-07-04 오후 8.30.19.png')
      .expect(401) // 예측 상태 코드
      .expect('Content-Type', /json/);
  });
});

describe('GET /users/bookmarks 유저 북마크 조회 API', () => {
  it('유저 북마크 조회 성공', async () => {
    await request(app)
      .get('/users/bookmarks') // api 요청
      .set('Content-Type', 'application/json')
      .set('x-auth-token', jwtToken)
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 북마크 조회 실패', async () => {
    await request(app)
      .get('/users/bookmarks') // api 요청
      .set('Content-Type', 'application/json')
      .expect(401) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

describe('PUT /users/bookmarks 유저 북마크 생성 API', () => {
  it('유저 북마크 생성 성공', async () => {
    await request(app)
      .put('/users/bookmarks') // api 요청
      .set('Content-Type', 'application/json')
      .set('x-auth-token', jwtToken)
      .send({
        cardId: '62ce8ecc5b1e11673a0a875c'
      })
      .expect(201) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
  it('유저 북마크 생성 실패', async () => {
    await request(app)
      .put('/users/bookmarks') // api 요청
      .set('Content-Type', 'application/json')
      .set('x-auth-token', jwtToken)
      .expect(400) // 예측 상태 코드
      .expect('Content-Type', /json/); // 예측 content-type
  });
});

after(async () => {
  const user = await User.findOneAndDelete({
    email: 'test@gmail.com'
  });
  console.log('Piickle server Test Success');
});

export default jwtToken;
