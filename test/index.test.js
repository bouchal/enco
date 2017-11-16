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


describe('ENV name config', () => {
    it('should load development config based on default NODE_NAME env name', (done) => {
        process.env.NODE_ENV = 'development';

        let config = configLoader();

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(8080);

        delete process.env.NODE_ENV;

        done();
    });

    it('should load development config based on custom environment name in env var name', (done) => {
        process.env.ENVIRONMENT_NAME = 'development';

        let config = configLoader({
            envName: 'ENVIRONMENT_NAME'
        });

        config.host.should.be.equal('127.0.0.1');
        config.port.should.be.equal(8080);

        delete process.env.ENVIRONMENT_NAME;

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

        process.env.STRING_TEST.should.be.equal('test');
        delete process.env.STRING_TEST;

        done();
    })

    it ('should be loaded to process.env with path', (done) => {
        configLoader({
            envFilePath: __dirname + '/.env'
        });

        process.env.STRING_TEST.should.be.equal('test');

        done();
    })

    it ('should loaded ENV variables to config', (done) => {
        let config = configLoader({
            dir: __dirname,
            file: 'env.config.cson'
        });

        config.string_test.should.be.equal(process.env.STRING_TEST);
        config.number_test.should.be.equal(process.env.NUMBER_TEST);
        config.bool_test_true.should.be.equal(process.env.BOOL_TEST_TRUE);
        config.bool_test_false.should.be.equal(process.env.BOOL_TEST_FALSE);
        config.empty_test.should.be.equal(process.env.EMPTY_TEST);
        should.equal(config.non_exists, null);

        done();
    })
})