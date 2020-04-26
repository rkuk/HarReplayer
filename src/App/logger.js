"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./config.js");
const datetime = require("node-datetime");
const winston = require("winston");
class Logger {
    constructor() {
        this.config = config_js_1.default.Instance();
        winston.level = this.config.LoggingLevel;
    }
    static Instance() {
        if (Logger._instance === null) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }
    Log(level, message) {
        var dt = datetime.create();
        var formattedDT = dt.format('Y-m-d H:M:S.N');
        var logEntry = formattedDT + ': ' + message;
        winston.log(level, logEntry);
    }
}
Logger._instance = null;
exports.default = Logger;
