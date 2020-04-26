// Copyright (c) Microsoft Corporation. All rights reserved.// Licensed under the MIT license.
import * as express from "express";
import config from "../src/App/config";
import * as harServer from "../src/App/harServer.js";
import HarResponseCache from "../src/App/HarFileCache/harResponseCache.js"
import HarResponseCacheFile from "../src/App/HarFileCache/harResponseCacheFile.js"
import harServerUrl from "../src/App/harServerUrl.js"
import Entry from "../src/App/HarFile/entry.js";
import * as testhelper from "./testhelper.js";
import * as chai from "chai";

const request = require('supertest');
let assert = chai.assert;
let configInstance = config.Instance("..\\..\\test\\dependencies\\config.json");

describe("Config settings validation", () => {
    
    it("validates 'InjectJavascript' setting", function(done) {
        var app = testhelper.startServer(configInstance);
        request(app)
        .get('/search?q=robots')
        .set('x-harfileid', 'harfile')
        .end(function(err, res) {

            testhelper.stopServer();

            assert.equal(res.status === 200, true);
            assert.equal(res.text.indexOf(configInstance.InjectJavascript) >= 0, true);

            done();
        });
    });

    it("validates 'CacheLifetime' setting", function(done) {
        config.Instance().CacheLifetime = 0; // expire immediately
        var onLoaded = (function(cacheFile: HarResponseCacheFile) {
            var file: HarResponseCacheFile = cache.harResponseCacheFiles['harfile'];
            var url: harServerUrl = new harServerUrl('/search?q=robots');
            var entry: Entry = file.LoadCacheFileEntry(url); // update last access time to allow entry to expire

            setTimeout(function() { // check cache entries are wiped, 10ms delay after last access
                cache.CleanCache(cache);
                assert.equal(Object.keys(cache.harResponseCacheFiles).length, 0, true);

                done();
            }, 10);
        });

        var cache: HarResponseCache = new HarResponseCache();
        cache.LoadCacheFile('harfile', onLoaded);
    });

    it("validates 'QueryParamsToIgnore' setting", function (done) {
        configInstance.QueryParamsToIgnore = "ignoredParam";
        var app = testhelper.startServer(configInstance);
        request(app)
        .get('/search?q=robots&unknownparam=1')
        .set('x-harfileid', 'harfile')
        .end(function(err, res) {

            assert.equal(res.status === 404, true);

            request(app)
            .get('/search?q=robots&ignoredParam=1')
            .set('x-harfileid', 'harfile')
            .end(function(err, res) {
                testhelper.stopServer();

                assert.equal(res.status === 200, true);
                done();
            });
        });
    });

    it("validates 'UrlReplacements' setting", function (done) {
        configInstance.UrlReplacements = [];
        configInstance.UrlReplacements.push(<any> {regex: 'pathtoreplace', replacement: 'search'});
        var app = testhelper.startServer(configInstance);
        request(app)
        .get('/unknownpath?q=robots&unknownparam=1')
        .set('x-harfileid', 'harfile')
        .end(function(err, res) {

            assert.equal(res.status === 404, true);

            request(app)
            .get('/pathtoreplace?q=robots&ignoredParam=1')
            .set('x-harfileid', 'harfile')
            .end(function(err, res) {
                testhelper.stopServer();

                assert.equal(res.status === 200, true);
                done();
            });
        });
    });

});
