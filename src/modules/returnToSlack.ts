export const slackMessage = (
  method: string,
  originalUrl: string,
  error: any,
  uid?: string,
  token?: string
): string => {
  return `🚨  [ERROR] [${method}] \`${originalUrl}\`\n${
    uid ? `user_id: ${uid}` : ''
  }\n${token ? `token: ${token}` : ''}\n${JSON.stringify(error)}`;
};
