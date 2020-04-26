"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harFile_js_1 = require("../src/App/HarFile/harFile.js");
const config_1 = require("../src/App/config");
const diskHarLookup_js_1 = require("../src/App/diskHarLookup.js");
const chai = require("chai");
let assert = chai.assert;
describe("Disk har lookup tests", () => {
    it("validates har files can be loaded from disk", function (done) {
        let configInstance = config_1.default.Instance("..\\..\\test\\dependencies\\config.json");
        let disklookup = diskHarLookup_js_1.default.Instance();
        var onHarFileFound = (function () {
            var onDownloaded = (function (content) {
                assert.equal(content !== null, true);
                var jsonObj = JSON.parse(content);
                var harFile = new harFile_js_1.default("harfilename", jsonObj);
                assert.equal(harFile.filename === "harfilename", true);
                assert.equal(harFile.Log.Entries.length === 66, true);
                done();
            });
            var content = disklookup.LoadFile("harfile", onDownloaded);
        });
        disklookup.FindFromRequest("harfile", onHarFileFound);
    });
});
