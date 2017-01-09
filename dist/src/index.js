"use strict";
const util = require("util");
console.log(util.format('dfdfdfdfdff'));
// import bunyan from 'bunyan';
// const packageJson = require(process.cwd() + '/package.json');
// import _ from 'lodash';
// import requireDir from 'require-dir';
// import fs from 'fs';
// import path from 'path';
//
// let defaultLogger                 = null;
// let uncaughtExceptionHandlerBound = false;
// let monitorTimeout                = null;
// let optionsFileWatcher            = null;
//
// /**
//  * Injects the active execution context ID in the log message
//  * if it exists
// */
// const bunyanEmit = bunyan.prototype._emit;
//
// bunyan.prototype._emit = function(rec, noemit) {
//   if (process.domain != null) {
//     rec.req_id = process.domain.id;
//   }
//
//   return bunyanEmit.call(this, rec, noemit);
// };
//
//
// const _bindUncaughtExceptionHandler = function() {
//   if (!uncaughtExceptionHandlerBound) {
//     uncaughtExceptionHandlerBound = true;
//
//     return process.on('uncaughtException', function(err) {
//       if (defaultLogger != null) {
//         defaultLogger.error(err, "\u2622 UncaughtException \u2622");
//       } else {
//         console.error(`\u2622 UncaughtException \u2622: ${err.message}`);
//         console.error(err.stack);
//       }
//
//       return process.exit(1);
//     });
//   }
// };
//
// /**
//  * Converts objects with key 'user'
//  * @param  {Object} user a user model instance
//  * @return {Object}            a sanitized user instance
// */
// const _userSerializer = function(user) {
//   if ((user != null) && !_.isString(user)) {
//     user = {
//       user_id   : user._id,
//       user_name : user.username
//     };
//   }
//
//   return user;
// };
//
// /**
//  * Converts objects with key 'controller'
//  * @param  {Object} controller a controller model instance
//  * @return {Object}            a sanitized controller instance
// */
// const _controllerSerializer = function(controller) {
//   if ((controller != null) && !_.isString(controller)) {
//     controller = {
//       uuid        : controller.name != null ? controller.name : controller.uuid,
//       device_name : controller.deviceName
//     };
//   }
//
//   return controller;
// };
//
// /**
//  * Converts objects with key 'req'
//  * @param  {Object} req the http request object
//  * @return {Object}     the sanitized request object
// */
// const _reqSerializer = function(req) {
//   if ((__guard__(req, x => x.connection) != null) || (__guard__(req, x1 => x1.headers) != null)) {
//     req = {
//       method       : req.method,
//       url          : req.url,
//       header       : req.headers
//     };
//
//     _.assign(req, _controllerSerializer(req.controller));
//     _.assign(req, _userSerializer(req.user));
//   }
//
//   return req;
// };
//
// /**
//  * Converts a module object to its filename
//  * @param  {Object} module a module instance
//  * @return {String}        the module's filename
// */
// const _moduleSerializer = function(module) {
//   if (__guard__(module, x => x.filename) != null) {
//     module = path.basename(module.filename);
//   }
//
//   return module;
// };
//
// /**
//  * Loads bunyan stream modules from a given directory
//  * @return {Array} an array of stream modules
// */
// const _loadStreams = function(streamsPath) {
//   if (streamsPath != null) {
//     const nodeEnv = process.env.NODE_ENV || 'development';
//     let streams = _.values(requireDir(streamsPath));
//
//     return streams = _.filter(streams, function(stream) {
//       const eligible = _.contains(stream.env, nodeEnv);
//       if (eligible && _.isFunction(stream.init)) {
//         stream.init();
//       }
//
//       return eligible;
//     });
//   }
// };
//
//
// /**
//  * Monitors the log levels file and changes corresponding
//  * streams' log level accordingly
//  * @param  {String} optionsFilePath the path to the config file
// */
// const _monitorLogLevels = function(optionsFilePath) {
//   let refreshing = false;
//
//   const refreshLevels = function() {
//     refreshing = true;
//
//     defaultLogger.debug("Reloading log levels", optionsFilePath);
//
//     clearTimeout(monitorTimeout);
//     return monitorTimeout = setTimeout(function() {
//       delete require.cache[require.resolve(optionsFilePath)];
//       const streamOptions = require(optionsFilePath);
//
//       try {
//         for (let stream of Array.from(defaultLogger.streams)) {
//           defaultLogger.levels(stream.name, streamOptions[stream.name]);
//         }
//       } catch (err) {
//         // not necessary to bubble up the error
//         defaultLogger.error(err);
//       }
//
//       return refreshing = false;
//     }
//     , 100);
//   };
//
//   if (optionsFilePath != null) {
//     refreshLevels();
//
//     __guard__(optionsFileWatcher, x => x.close());
//     return optionsFileWatcher = fs.watchFile(optionsFilePath, function(curr, prev) {
//       if (!refreshing) {
//         return refreshLevels();
//       }
//     });
//   }
// };
//
//
// /**
//  * Middleware logging express routes' accesses
//  * @param  {String} level  the min level at which logs will be emitted
// */
// const routeAccessLogMiddleware = function(level = 'trace') {
//   const expressBunyan = require('express-bunyan-logger')({
//     genReqId : false,
//     logger   : defaultLogger
//   });
//
//   return function(req, res, next) {
//     if ((bunyan.levelFromName[level] >= defaultLogger.level()) && (req.method !== 'OPTIONS')) {
//       return expressBunyan(req, res, next);
//     } else { return next(); }
//   };
// };
//
// /**
//  * Returns the default logger with its serializers and
//  * streams initialized and bound
//  * @return {Object} a bunyan logger
// */
// const getDefaultLogger = function(streamsPath) {
//   if (defaultLogger == null) {
//     defaultLogger = bunyan.createLogger({
//       name        : packageJson.name,
//       level       : 'debug',
//       serializers : {
//         req        : _reqSerializer,
//         res        : bunyan.stdSerializers.res,
//         err        : bunyan.stdSerializers.err,
//         controller : _controllerSerializer,
//         module     : _moduleSerializer
//       }
//     });
//   }
//
//   if (streamsPath != null) {
//     // Clearing the array and not replacing it with an empty one since
//     // child loggers streams is just a pointer to the parent's streams array
//     __guard__(defaultLogger.streams, x => x.length = 0);
//     for (let stream of Array.from(_loadStreams(streamsPath))) {
//       defaultLogger.addStream(stream);
//     }
//   }
//
//   return defaultLogger;
// };
//
// export default {
//   routeAccessLogMiddleware,
//   logger({streamsPath, logLevelsConfPath, handleUncaughtExceptions} = {}) {
//     if ((handleUncaughtExceptions == null) || handleUncaughtExceptions) {
//       _bindUncaughtExceptionHandler();
//     }
//
//     const logger = getDefaultLogger(streamsPath);
//     _monitorLogLevels(logLevelsConfPath);
//
//     return logger;
//   }
// };
//
// function __guard__(value, transform) {
//   return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
// }
//# sourceMappingURL=index.js.map