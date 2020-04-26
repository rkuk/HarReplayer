"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
var azure = require('azure-storage');
class DiskHarLookup {
    constructor() {
        this.harFilesFolder = config_js_1.default.Instance().HarFilePath;
    }
    static Instance() {
        if (DiskHarLookup._instance === null) {
            DiskHarLookup._instance = new DiskHarLookup();
        }
        return DiskHarLookup._instance;
    }
    LoadFile(filename, onDownloaded) {
        var harFilePath = this.harFilesFolder + '\\' + filename;
        fs.readFile(harFilePath, function read(err, data) {
            if (!err) {
                onDownloaded(data);
            }
            else {
                logger_js_1.default.Instance().Log('error', 'Error reading har file from disk: ' + err.message);
                onDownloaded(null);
            }
        });
    }
    FindFromRequest(harFileName, onHarFileFound) {
        onHarFileFound(harFileName);
    }
}
DiskHarLookup._instance = null;
exports.default = DiskHarLookup;
