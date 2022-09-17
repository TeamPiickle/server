import { Request } from 'express';
export const slackMessage = (
  req: Request,
  error: any,
  uid?: string,
  token?: string
): string => {
  const method = req.method.toUpperCase();
  const originalUrl = req.originalUrl;
  return `🚨  [ERROR] [${method}] \`${originalUrl}\`\n
      Express-Host: ${req.header('Host') || 'Unknown'}\n
      User-Agent: ${req.header('User-Agent') || 'Unknown'}\n
  ${uid ? `      user_id: ${uid}\n` : ''}${
    token ? `      token: ${token}\n` : ''
  }      ${JSON.stringify(error)}`;
};
