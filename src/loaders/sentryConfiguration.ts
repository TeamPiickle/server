import { Express } from 'express';
import * as Sentry from '@sentry/node';
import config from '../config';

const initializeSentry = (app: Express) => {
  Sentry.init({
    environment: config.nodeEnv,
    dsn: 'https://c6a940a8f6fc411396328fdfc3ba2576@o4505496940380160.ingest.sentry.io/4505496954404864',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
    ],
    tracesSampleRate: 1.0
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

const attachSentryErrorHandler = (app: Express) => {
  app.use(Sentry.Handlers.errorHandler());
};

export { initializeSentry, attachSentryErrorHandler };
