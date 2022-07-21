import User from '../src/models/user';
import { UserService } from '../src/services';
import CreateUserCommand from '../src/intefaces/createUserCommand';
import { UserLoginDto } from '../src/intefaces/user/UserLoginDto';
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index';

// describe('UserService Tests', () => {
//   // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
//   afterEach(async () => {
//     await User.collection.drop();
//   });
//   it('사용자 등록 테스트', async () => {
//     // given
//     const createUser: CreateUserCommand = {
//       name: 'test',
//       email: 'test@gmail.com',
//       password: 'test',
//       nickname: 'test'
//     };

//     // when
//     const createdUser = await UserService.createUser(createUser);

//     // then
//     const user = await User.findOne({
//       nickname: createUser.nickname
//     });
//     expect(user!.nickname).to.equal(createUser.nickname);
//   });

//   it('사용자 로그인 테스트', async () => {
//     // given
//     const createUser: CreateUserCommand = {
//       name: 'test',
//       email: 'test@gmail.com',
//       password: 'test',
//       nickname: 'test'
//     };

//     await UserService.createUser(createUser);

//     const userLoginDto: UserLoginDto = {
//       email: 'test@gmail.com',
//       password: 'test'
//     };
//     // when
//     const result = await UserService.loginUser(userLoginDto);

//     // then
//     const user = await User.findById(result._id);
//     expect(user!._id).to.deep.equal(result!._id);
//   });
// });

describe('POST /users', () => {
  it('콘텐츠 조회 토글 체크 성공', done => {
    request(app)
      .post('/users') // api 요청
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: 'test@gmail.com',
        password: 'test',
        nickname: 'test'
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('회원가입 성공'); // response body 예측값 검증
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});
