"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon = require('sinon');
const azureStorageHarLookup_js_1 = require("../src/App/azureStorageHarLookup.js");
const chai = require("chai");
let assert = chai.assert;
describe("Azure storage har lookup tests", () => {
    let testFilename = 'testfilename';
    function createMockObj() {
        var result = { entries: [] };
        result.entries["entry"] = { name: testFilename };
        var blobServiceStub = {
            getBlobToText: sinon.stub().callsArgWith(2, null, 'blobcontent', null),
            listBlobsSegmented: sinon.stub().callsArgWith(2, null, result, null)
        };
        var azureStub = {
            createBlobService: sinon.stub().returns(blobServiceStub)
        };
        return azureStub;
    }
    var subject = new azureStorageHarLookup_js_1.default(createMockObj());
    it("validates har files can be loaded from Azure storage", function (done) {
        var onDownloaded = (function (content) {
            assert.equal(content === "blobcontent", true);
            done();
        });
        subject.LoadFile("testfilename", onDownloaded);
    });
});
