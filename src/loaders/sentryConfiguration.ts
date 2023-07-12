import { Express } from 'express';
import {
  init,
  Handlers,
  Integrations,
  autoDiscoverNodePerformanceMonitoringIntegrations
} from '@sentry/node';
import config from '../config';

const initializeSentry = (app: Express) => {
  init({
    environment: config.nodeEnv,
    dsn: config.sentryDsn,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new Integrations.Express({ app }),
      ...autoDiscoverNodePerformanceMonitoringIntegrations()
    ],
    tracesSampleRate: 1.0
  });
  app.use(Handlers.requestHandler());
  app.use(Handlers.tracingHandler());
};

const attachSentryErrorHandler = (app: Express) => {
  app.use(Handlers.errorHandler());
};

export { initializeSentry, attachSentryErrorHandler };
