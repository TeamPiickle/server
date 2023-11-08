import { Request } from 'express';
import axios from 'axios';
import config from '../config';

const alertError = (req: Request, error: any): string => {
  const method = req.method.toUpperCase();
  const originalUrl = req.originalUrl;
  const token = req.header('x-auth-token')?.split(' ')[1];

  const reqInfo = {
    host: req.header('Host'),
    userAgent: req.header('User-Agent'),
    user: req.user,
    jwt: token,
    body: req.body
  };

  return `🚨  [${method}] \`${originalUrl}\`\n - *statusCode*: ${
    error.statusCode
  }\n - *message*: ${error.message} \`\`\`${JSON.stringify(
    reqInfo,
    null,
    2
  )}\`\`\``;
};

export const send = async (
  req: Request,
  causeError: any,
  color?: string
): Promise<void> => {
  try {
    const message: string = alertError(req, causeError);
    await axios.post(config.slackWebHookUrl, { text: message, color });
  } catch (error: any) {
    console.log(error);
  }
};
