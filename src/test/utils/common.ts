process.env.NODE_ENV = 'test';

import 'mocha';
import * as fs from 'fs';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as Promise from 'bluebird';

global['chai'] = chai;
global['expect'] = global['chai'].expect;
global['Promise'] = Promise;
