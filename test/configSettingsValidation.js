"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/App/config");
const harResponseCache_js_1 = require("../src/App/HarFileCache/harResponseCache.js");
const harServerUrl_js_1 = require("../src/App/harServerUrl.js");
const testhelper = require("./testhelper.js");
const chai = require("chai");
const request = require('supertest');
let assert = chai.assert;
let configInstance = config_1.default.Instance("..\\..\\test\\dependencies\\config.json");
describe("Config settings validation", () => {
    it("validates 'InjectJavascript' setting", function (done) {
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/search?q=robots')
            .set('x-harfileid', 'harfile')
            .end(function (err, res) {
            testhelper.stopServer();
            assert.equal(res.status === 200, true);
            assert.equal(res.text.indexOf(configInstance.InjectJavascript) >= 0, true);
            done();
        });
    });
    it("validates 'CacheLifetime' setting", function (done) {
        config_1.default.Instance().CacheLifetime = 0;
        var onLoaded = (function (cacheFile) {
            var file = cache.harResponseCacheFiles['harfile'];
            var url = new harServerUrl_js_1.default('/search?q=robots');
            var entry = file.LoadCacheFileEntry(url);
            setTimeout(function () {
                cache.CleanCache(cache);
                assert.equal(Object.keys(cache.harResponseCacheFiles).length, 0, true);
                done();
            }, 10);
        });
        var cache = new harResponseCache_js_1.default();
        cache.LoadCacheFile('harfile', onLoaded);
    });
    it("validates 'QueryParamsToIgnore' setting", function (done) {
        configInstance.QueryParamsToIgnore = "ignoredParam";
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/search?q=robots&unknownparam=1')
            .set('x-harfileid', 'harfile')
            .end(function (err, res) {
            assert.equal(res.status === 404, true);
            request(app)
                .get('/search?q=robots&ignoredParam=1')
                .set('x-harfileid', 'harfile')
                .end(function (err, res) {
                testhelper.stopServer();
                assert.equal(res.status === 200, true);
                done();
            });
        });
    });
    it("validates 'UrlReplacements' setting", function (done) {
        configInstance.UrlReplacements = [];
        configInstance.UrlReplacements.push({ regex: 'pathtoreplace', replacement: 'search' });
        var app = testhelper.startServer(configInstance);
        request(app)
            .get('/unknownpath?q=robots&unknownparam=1')
            .set('x-harfileid', 'harfile')
            .end(function (err, res) {
            assert.equal(res.status === 404, true);
            request(app)
                .get('/pathtoreplace?q=robots&ignoredParam=1')
                .set('x-harfileid', 'harfile')
                .end(function (err, res) {
                testhelper.stopServer();
                assert.equal(res.status === 200, true);
                done();
            });
        });
    });
});
