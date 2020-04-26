"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./../config.js");
const log_js_1 = require("./log.js");
class HarFile {
    constructor(filename, content) {
        this.config = config_js_1.default.Instance();
        if (content.hasOwnProperty('log')) {
            this.Log = new log_js_1.default(content['log'], this);
            this.filename = filename;
        }
    }
    FindRequest(url) {
        for (var i = 0; i < this.Log.Entries.length; i++) {
            var entry = this.Log.Entries[i];
            if (url.Equals(entry.Request.url)) {
                return entry;
            }
        }
        return null;
    }
}
exports.default = HarFile;
