"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const header_js_1 = require("./header.js");
class Response {
    constructor(response) {
        this.Headers = [];
        this.contentBuffer = null;
        if (response.hasOwnProperty('content')) {
            var content = response['content'];
            if (content.hasOwnProperty('mimeType') && content.hasOwnProperty('size') && content.hasOwnProperty('text')) {
                this.content_mimeType = content['mimeType'];
                this.content_size = content['size'];
                this.content_text = content['text'];
                this.content_encoding = content['encoding'];
            }
        }
        if (response.hasOwnProperty('headers')) {
            for (var i = 0; i < response["headers"].length; i++) {
                var header = new header_js_1.default(response["headers"][i]);
                this.Headers.push(header);
            }
        }
    }
    setContentText(contentText) {
        this.content_text = contentText;
        this.contentBuffer = null;
    }
    contentBytes() {
        if (this.contentBuffer) {
            return this.contentBuffer;
        }
        else {
            if (this.content_text && this.content_text.length > 0) {
                this.contentBuffer = new Buffer(this.content_text, this.content_encoding);
            }
            return this.contentBuffer;
        }
    }
}
exports.default = Response;
