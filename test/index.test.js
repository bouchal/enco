require('babel-register');

import configLoader from '../src/';
import should from 'should';

describe('Single CSON file config', () => {
    it('should load production config without any configuration', (done) => {
        let config = configLoader();

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(80);

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
});

describe('Single JSON file config', () => {
    it('should load development config', (done) => {
        let config = configLoader({
            environment: 'development',
            type: 'json'
        });

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(8080);

        done();
    });
});



describe('Multiple file CSON config', () => {
    it ('should return load localhost config from folder structure', (done) => {
        let config = configLoader({
            environment: 'localhost',
            isFolderStructure: true,
            dir: 'config'
        });

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(8088);

        done();
    })
});

describe('.env file', () => {
    it ('should be loaded to process.env without path', (done) => {
        configLoader();

        process.env.TEST_ENV_VARIABLE.should.be.equal('test');
        delete process.env.TEST_ENV_VARIABLE;

        done();
    })

    it ('should be loaded to process.env with path', (done) => {
        configLoader({
            envFilePath: __dirname + '/.env'
        });

        process.env.TEST_ENV_VARIABLE.should.be.equal('test');

        done();
    })

    it ('should loaded ENV variables to config', (done) => {
        let config = configLoader({
            dir: __dirname,
            file: 'env.config.cson'
        });

        config.test.should.be.equal('test');
        config.null_test.should.be.equal('')

        done();
    })
})