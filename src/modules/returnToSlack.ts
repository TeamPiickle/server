import { Request } from 'express';
import { IncomingWebhookSendArguments } from '@slack/webhook/dist/IncomingWebhook';

export const generateBlock = (
  req: Request,
  err: any
): IncomingWebhookSendArguments => {
  const method = req.method.toUpperCase();
  const originalUrl = req.originalUrl;
  const token = req.header('x-auth-token')?.split(' ')[1];
  const error = err as {
    statusCode: number;
    message: string;
    stack: any;
  };
  return {
    attachments: [
      {
        color: '#FF0000',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `[${method}] \`${originalUrl}\`\n- *statusCode*: ${error.statusCode}\n- *message*: ${error.message}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `
              *Error 상세*\`\`\`${error.stack}\`\`\``
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `
              *Request 상세*\`\`\`${JSON.stringify(
                {
                  host: req.header('Host'),
                  userAgent: req.header('User-Agent'),
                  user: req.user,
                  jwt: token,
                  body: req.body
                },
                null,
                2
              )}\`\`\``
            }
          }
        ]
      }
    ]
  };
};
