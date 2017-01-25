"use strict";
process.env.NODE_ENV = 'test';
require("mocha");
const chai = require("chai");
const Promise = require("bluebird");
global['chai'] = chai;
global['expect'] = global['chai'].expect;
global['Promise'] = Promise;
//# sourceMappingURL=common.js.map