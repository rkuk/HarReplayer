"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entry_js_1 = require("./entry.js");
class Log {
    constructor(log, harFile) {
        this.Entries = [];
        this.myHarFile = harFile;
        if (log.hasOwnProperty('entries')) {
            for (var i = 0; i < log["entries"].length; i++) {
                var entry = new entry_js_1.default(log["entries"][i], harFile);
                if (entry.IsGetRequest() && entry.ContainsValidResponse()) {
                    this.Entries.push(entry);
                }
            }
        }
    }
}
exports.default = Log;
