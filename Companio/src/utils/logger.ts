// src/utils/logger.ts

import * as Sentry from '@sentry/react-native';

Sentry.init({dsn: 'YOUR_SENTRY_DSN'});

export const logError = (error: any) => {
  Sentry.captureException(error);
};
