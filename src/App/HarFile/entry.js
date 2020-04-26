"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_js_1 = require("./request.js");
const response_js_1 = require("./response.js");
class Entry {
    constructor(entry, harFile) {
        this.myHarFile = harFile;
        if (entry.hasOwnProperty('request') && entry.hasOwnProperty('response')) {
            this.Request = new request_js_1.default(entry["request"]);
            this.Response = new response_js_1.default(entry["response"]);
        }
    }
    ContainsValidResponse() {
        var contentBuffer = this.Response.contentBytes();
        if (contentBuffer) {
            return contentBuffer.length > 0;
        }
        return false;
    }
    IsGetRequest() {
        return this.Request !== null && this.Request.method === "GET";
    }
}
exports.default = Entry;
