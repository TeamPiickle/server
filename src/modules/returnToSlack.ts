import { Request } from 'express';
import { UserId } from '../types/types';
export const generateSlackMessage = (req: Request, error: any): string => {
  const method = req.method.toUpperCase();
  const originalUrl = req.originalUrl;
  const uid = <UserId>req.user?.id;
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
