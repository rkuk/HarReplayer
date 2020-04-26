"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const harServerUrl_js_1 = require("../src/App/harServerUrl.js");
const config_1 = require("../src/App/config");
let assert = chai.assert;
let configInstance = config_1.default.Instance("..\\..\\test\\dependencies\\config.json");
describe("harServerUrl validation", () => {
    it("validates url param matching", function () {
        var url1 = new harServerUrl_js_1.default('/search?q=robots');
        var url2 = new harServerUrl_js_1.default('/search?q=robots');
        assert.equal(url1.Equals(url2), true, true);
        url1 = new harServerUrl_js_1.default('/search');
        url2 = new harServerUrl_js_1.default('/search');
        assert.equal(url1.Equals(url2), true, true);
        url1 = new harServerUrl_js_1.default('/search?q=robots');
        url2 = new harServerUrl_js_1.default('/search');
        assert.equal(url1.Equals(url2), false, true);
        url1 = new harServerUrl_js_1.default('/search?q=robots');
        url2 = new harServerUrl_js_1.default('/search?q=spiders');
        assert.equal(url1.Equals(url2), false, true);
        url1 = new harServerUrl_js_1.default('/search?q=robots,transformers');
        url2 = new harServerUrl_js_1.default('/search?q=robots');
        assert.equal(url1.Equals(url2), false, true);
    });
});
