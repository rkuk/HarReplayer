"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harServerUrl_js_1 = require("./../harServerUrl.js");
class Request {
    constructor(request) {
        if (request.hasOwnProperty('url') && request.hasOwnProperty('method')) {
            this.url = new harServerUrl_js_1.default(request['url']);
            this.method = request['method'];
        }
    }
}
exports.default = Request;
