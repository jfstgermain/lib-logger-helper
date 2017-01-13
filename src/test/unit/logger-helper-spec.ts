
import loggerHelper from '../../lib/index';
import * as path from 'path';
import * as bunyan from 'bunyan';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

// Convenience stream used to capture logged objects
class CapturingStream {
  private recs;

  constructor(recs) {
    this.recs = recs;
  }

  public write(rec) {
    this.recs.push(rec);
  }
}

describe('The logger helper module', function () {
  let logger: any = null;

  describe('#init()', function () {

    describe('using default params', function () {
      before(function () {
        loggerHelper.init();
        logger = loggerHelper.logger();
      });

      it('should use the default bunyan-config\'s output stream (stdout)', function () {
        expect(logger.streams).to.have.lengthOf(1);
        // expect(logger.streams[0]).to.equal(process.stdout);
      });

      it('should have the default serializers registered', function () {
        expect(logger.serializers).to.have.all.keys(['err', 'error', 'res', 'req', 'user', 'module']);
      });
    });

    describe('when passing a value to `handleUncaughtExceptions`', function () {
      let spy;
      let sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
        spy = sandbox.spy(loggerHelper, 'bindUncaughtExceptionHandler');
      });

      afterEach(function () {
        sandbox.restore();
      });

      it('should not bind the `UncaughtException` handler if `false`', function () {
        loggerHelper.init(null, false);
        expect(spy).to.not.have.been.called;
      });

      it('should bind the `UncaughtException` handler if `true`', function () {
        loggerHelper.init(null, true);
        expect(spy).to.have.been.called;
      });
    });
  });

  describe.skip('#bindUncaughtExceptionHandler()', function () {
    // it()
  });

  describe('serializers', function () {
    let loggedEntries = [];

    beforeEach(function () {
      loggedEntries = [];

      loggerHelper.init();
      logger = loggerHelper.logger();
      logger.addStream({
        stream: new CapturingStream(loggedEntries),
        type: 'raw',
      });
    });

    describe('#userSerializer()', function () {
      it('should return the input value if a string', function () {
        logger.warn({user: 'a user'});
        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0]).to.have.property('user', 'a user');
      });

      it('should return the input value if a `null`', function () {
        logger.warn({user: null});
        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0]).to.have.property('user', null);
      });

      it('should return a serialized version of a user object', function () {
        logger.warn({user: {
          age: 42,
          id: 123456,
          username: 'xstgeje',
        }});

        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0].user).to.exist;
        // compare values inside object not the object refenrence
        expect(loggedEntries[0].user).to.deep.equal({
          user_id: 123456,
          user_name: 'xstgeje',
        });
      });
    });

    describe('#reqSerializer()', function () {
      it('should return the input value if the object doesn\'t contain a `connection` or `headers` field', function () {
        const loggedObject = {
          field1: 'value1',
          field2: 'value2',
        };

        logger.warn({
          req: loggedObject,
        });

        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0].req).to.exist;
        expect(loggedEntries[0].req).to.deep.equal(loggedObject);

      });

      it('should return a serialized version of the `req` object', function () {
        const loggedObject = {
          headers: [
            'Accept-Language: en-us,en;q=0.5',
            'Accept-Encoding: gzip,deflate',
            'Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7',
          ],
          method: 'GET',
          some_other_field: 'some other field value',
          url: '/ville-de-montreal/logger-helper',
        };

        logger.warn({
          req: loggedObject,
        });

        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0].req).to.exist;
        expect(loggedEntries[0].req.some_other_field).to.not.exist;
        expect(loggedEntries[0].req.headers).to.equal(loggedObject.headers);
        expect(loggedEntries[0].req.method).to.equal(loggedObject.method);
        expect(loggedEntries[0].req.url).to.equal(loggedObject.url);
      });
    });

    describe('#moduleSerializer()', function () {
      it('should return the input value if the object doesn\'t contain a `filename` field', function () {
        const loggedObject = {
          field1: 'value1',
          field2: 'value2',
        };

        logger.warn({ module: loggedObject });

        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0].module).to.exist;
        expect(loggedEntries[0].module).to.deep.equal(loggedObject);
      });

      it('should return a serialized version of the `module` object', function () {
        logger.warn({
          module,
        });

        expect(loggedEntries).to.have.length(1);
        expect(loggedEntries[0].module).to.exist;
        expect(loggedEntries[0].module).to.deep.equal(path.basename(module.filename));

      });
    });
  });
});
