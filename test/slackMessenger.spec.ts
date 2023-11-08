import * as slackMessenger from '../src/modules/SlackMessenger';
import jest from 'jest';
describe('slackMessenger', () => {
  it('should return status code and message', async () => {
    const req = {
      method: 'GET',
      originalUrl: 'http://originalUrl',
      user: {
        name: 'piickle',
        message: '가짜지롱'
      },
      header: jest.fn()
    };

    await slackMessenger.send();
  });
});
