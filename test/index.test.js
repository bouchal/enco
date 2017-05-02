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