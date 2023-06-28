import axios from 'axios';
import config from '../config';

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}
const getToken = async (code: string, state: string): Promise<string> => {
  const response = await axios.get<NaverTokenResponse>(
    'https://nid.naver.com/oauth2.0/token?' +
      'grant_type=authorization_code' +
      `&client_id=${config.naverClientId}` +
      `&client_secret=${config.naverClientSecret}` +
      `&code=${code}` +
      `&state=${state}`,
    {}
  );
  return response.data.access_token;
};

export { getToken };
