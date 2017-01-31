See bunyan https://github.com/trentm/node-bunyan for more details on
how to use the logger.

import loggerHelper from 'lib-logger-helper';

let logger;

// If a config file is provided, it's only necessary to provide the path,
// as described below, once.  Subsequent calls to loggerHelper.logger() in
// the application will return the already initialized logger
if (process.env.NODE_ENV === 'production') {
  logger = loggerHelper.logger(`${process.cwd()}/config/logger-production.json`);
} else {
  logger = loggerHelper.logger();
}
