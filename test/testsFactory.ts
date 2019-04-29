import configLoader from '../src/';

const should = require('should');

export default function (type: string): void {
    describe(type.toUpperCase(), function () {
        it('should load localhost config by default', function (done) {
            let config = configLoader({
                dir: __dirname + "/configs/" + type,
                type: type
            });

            config.host.should.be.equal('127.0.0.1');
            config.port.should.be.equal(3000);

            done();
        });

        it('should load development config from file', function (done) {
            let config = configLoader({
                environment: 'development',
                dir: __dirname + "/configs/" + type,
                type: type
            });

            config.host.should.be.equal('127.0.0.1');
            config.port.should.be.equal(8080);

            done();
        });

        it('should load development config from folder structure', function (done) {
            let config = configLoader({
                dir: __dirname + "/configs/" + type + "/config",
                isFolderStructure: true,
                type: type
            });

            config.host.should.be.equal('127.0.0.1');
            config.port.should.be.equal(8088);

            done();
        });

        it('should load development config based on default NODE_NAME env name', function (done) {
            process.env.NODE_ENV = 'development';

            let config = configLoader({
                dir: __dirname + "/configs/" + type,
                type: type
            });

            config.host.should.be.equal('127.0.0.1');
            config.port.should.be.equal(8080);

            delete process.env.NODE_ENV;

            done();
        });

        it('should load development config based on custom env name', function (done) {
            process.env.ENVIRONMENT_NAME = 'development';

            let config = configLoader({
                dir: __dirname + "/configs/" + type,
                envName: 'ENVIRONMENT_NAME',
                type: type
            });

            config.host.should.be.equal('127.0.0.1');
            config.port.should.be.equal(8080);

            delete process.env.ENVIRONMENT_NAME;

            done();
        });

        it('should load .env variables to config file', function (done) {
            let config = configLoader({
                dir: __dirname + "/configs/" + type,
                file: 'env.config.' + type,
                type: type
            });

            config.string_test.should.be.equal(process.env.STRING_TEST);
            config.number_test.should.be.equal(process.env.NUMBER_TEST);
            config.bool_test_true.should.be.equal(process.env.BOOL_TEST_TRUE);
            config.bool_test_false.should.be.equal(process.env.BOOL_TEST_FALSE);
            config.empty_test.should.be.equal(process.env.EMPTY_TEST);
            should.equal(config.non_exists, null);
            should.equal(config.with_default, 'DefaultValue');

            done();
        });

        it('should append injected variables to config and read them in it', function (done) {
            const injectConfig = {
                host: '127.0.0.1',
                server: {
                    port: 80
                },
                databases: {
                    mysql: {
                        host: 'some'
                    }
                },
                escaped: "E!%R)v'^Xyy\\GG4y>l7,-+3\"18W"
            };

            let config = configLoader({
                dir: __dirname + "/configs/" + type,
                environment: 'production',
                file: 'injected.config.' + type,
                inject: injectConfig,
                type: type
            });

            config.host.should.be.equal(injectConfig.host);
            config.port.should.be.equal(injectConfig.server.port);
            config.mysql.should.be.equal(injectConfig.databases.mysql.host);
            config.escaped.should.be.equal(injectConfig.escaped);

            done();
        });
    });
};