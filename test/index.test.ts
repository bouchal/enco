import configLoader from '../src/';
import testFactory from './testsFactory';
import * as assert from 'assert';
const should = require('should');

const types = [
    'cson',
    'json',
    'yml'
];

describe('Common functions', function () {
    it('should load localhost config without any configuration', (done) => {
        let config = configLoader();

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(3000);

        done();
    });

    it('should load development config', (done) => {
        let config = configLoader({
            environment: 'development'
        });

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(8080);

        done();
    });

    it ('should be loaded to process.env without path', function (done) {
        configLoader();

        assert.strictEqual(process.env.STRING_TEST, 'test');
        delete process.env.STRING_TEST;

        done();
    });

    it ('should be loaded to process.env with path', function (done) {
        configLoader({
            envFilePath: __dirname + '/.env'
        });

        assert.strictEqual(process.env.STRING_TEST, 'test');

        done();
    });
});

types.forEach(function (type) {
    testFactory(type);
});
