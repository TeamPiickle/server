export const slackMessage = (
  method: string,
  originalUrl: string,
  error: any,
  uid?: string
): string => {
  return `🤪    [ERROR] [${method}] ${originalUrl} ${
    uid ? `user_id: ${uid}` : 'req.user 없음'
  } ${JSON.stringify(error)}`;
};
