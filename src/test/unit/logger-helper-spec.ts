
import loggerHelper from '../../index';
import * as bunyan from 'bunyan';

const expect = chai.expect;

describe('The logger helper module', () => {
  let logger: any = null;

  before(function () {
    logger = loggerHelper.logger();
    loggerHelper.init();

  });

  describe('#init', function () {
    it('should use the default bunyan-config\'s output stream (stdout)', function () {
      expect(logger.streams).to.have.lengthOf(1);
      // expect(logger.streams[0]).to.equal(process.stdout);
    });

    it('should have the default serializers registered', function () {
      expect(logger.serializers).to.have.all.keys(['err', 'error', 'res', 'req', 'user', 'module']);
    });
  });
});
