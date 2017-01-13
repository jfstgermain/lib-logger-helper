import bunyanConfig = require('bunyan-config');
// import * as bunyanConfig from 'bunyan-config';
import * as bunyan from 'bunyan';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

let defaultLogger: bunyan.Logger  = null;
let uncaughtExceptionHandlerBound = false;
let config                        = null;

function bindUncaughtExceptionHandler () {
  if (!uncaughtExceptionHandlerBound) {
    uncaughtExceptionHandlerBound = true;

    return process.on('uncaughtException', (err: Error) => {
      if (defaultLogger != null) {
        defaultLogger.error(err, '\u2622 UncaughtException \u2622');
      } else {
        console.error(`\u2622 UncaughtException \u2622: ${err.message}`);
        console.error(err.stack);
      }

      return process.exit(1);
    });
  }
}

/**
 * Converts objects with key 'user'
 * @param  {Object} user a user model instance
 * @return {Object}            a sanitized user instance
 */
function userSerializer (user: any) {
  if ((user != null) && !_.isString(user)) {
    user = {
      user_id   : user._id || user.id,
      user_name : user.username,
    };
  }

  return user;
};

/**
 * Converts objects with key 'req'
 * @param  {Object} req the http request object
 * @return {Object}     the sanitized request object
 */
function reqSerializer (req: any) {
  if (_.get(req, 'connection') || _.get(req, 'headers')) {
    req = {
      headers      : req.headers,
      method       : req.method,
      url          : req.url,
    };

    _.assign(req, userSerializer(req.user));
  }

  return req;
};

/**
 * Converts a module object to its filename
 * @param  {Object} module a module instance
 * @return {String}        the module's filename
 */
function moduleSerializer (module: any) {
  if (_.get(module, 'filename')) {
    module = path.basename(module.filename);
  }

  return module;
};

function init (configsPath = null, handleUncaughtExceptions = true) {
  let configs = null;

  if (handleUncaughtExceptions) {
    bindUncaughtExceptionHandler();
  }

  if (configsPath) {
    configs = bunyanConfig(JSON.parse(fs.readFileSync(configsPath, 'utf8')));
  } else {
    configs = {
      name: 'default-logger',
      serializers: {
        err: bunyan.stdSerializers.err,
        error: bunyan.stdSerializers.err,
        module: moduleSerializer,
        req: reqSerializer,
        res: bunyan.stdSerializers.req,
        user: userSerializer,
      },
      streams: [{
        stream: process.stdout,
      }],
    };
  }

  defaultLogger = bunyan.createLogger(configs);
}

function logger () {
  if (defaultLogger == null) {
    init();
  }

  return defaultLogger;
}

export default {
  init,
  logger,
  bindUncaughtExceptionHandler,
  serializers: {
    module: moduleSerializer,
    req: reqSerializer,
    user: userSerializer,
  },
};
