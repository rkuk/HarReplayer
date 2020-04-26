"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/App/config");
const testhelper = require("./testhelper.js");
const chai = require("chai");
const request = require('supertest');
let assert = chai.assert;
let configInstance = config_1.default.Instance("..\\..\\test\\dependencies\\config.json");
describe("Har Server tests - bootstrapping", () => {
    it("validates that we can load har file by bootstrapping, specifying har file in header", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/bootstrap')
            .set('x-harfileid', 'harfile')
            .end(function (err, res) {
            testhelper.stopServer();
            assert.equal(res.status === 200, true);
            done();
        });
    });
    it("validates that we can load har file by bootstrapping, specifying har file in url", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/bootstrap?harfileid=harfile')
            .end(function (err, res) {
            testhelper.stopServer();
            assert.equal(res.status === 200, true);
            done();
        });
    });
});
describe("Har Server tests - server running", () => {
    it("validates that server ping works properly", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/pinghealth')
            .end(function (err, res) {
            testhelper.stopServer();
            assert.equal(res.status === 200, true);
            done();
        });
    });
});
describe("Har Server tests - load har file: ajax calls", () => {
    it("validates that we can load har file and perform ajax calls on that file, passing har file in header", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/search?q=robots')
            .set('x-harfileid', 'harfile')
            .end(function (err, res) {
            assert.equal(res.status === 200, true);
            request(app)
                .get('/sa/simg/SharedSpriteDesktop_0317.png')
                .set('x-harfileid', 'harfile')
                .end(function (err, res) {
                testhelper.stopServer();
                assert.equal(res.status === 200, true);
                done();
            });
        });
    });
    it("validates that we can load har file and perform ajax calls on that file, passing har file in root request url param", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/search?q=robots&harfileid=harfile')
            .end(function (err, res) {
            assert.equal(res.status === 200, true);
            request(app)
                .get('/sa/simg/SharedSpriteDesktop_0317.png')
                .end(function (err, res) {
                testhelper.stopServer();
                assert.equal(res.status === 200, true);
                done();
            });
        });
    });
});
