"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
const harResponseCache_js_1 = require("./HarFileCache/harResponseCache.js");
const harServerUrl_js_1 = require("./harServerUrl.js");
class HarFileList {
    constructor() {
        this.harResponseCache = new harResponseCache_js_1.default();
        this.config = config_js_1.default.Instance();
    }
    FindHarFileRequest(requestUrl, harFileName, onFoundHarFileEntry) {
        var urlToFindObj = null;
        var urlRequestObj = new harServerUrl_js_1.default(requestUrl);
        var onLoaded = function (cacheFile) {
            var entry = null;
            if (cacheFile) {
                entry = cacheFile.LoadCacheFileEntry(urlRequestObj);
            }
            else {
                logger_js_1.default.Instance().Log('error', 'Failed to load har file');
            }
            onFoundHarFileEntry(entry);
        };
        this.harResponseCache.LoadCacheFile(harFileName, onLoaded);
    }
    MapIpAddressToHarFilename(ipAddress, harFilename) {
        this.harResponseCache.MapIpAddressToHarFilename(ipAddress, harFilename);
    }
    GetHarFilenameFromIpAddress(ipAddress) {
        return this.harResponseCache.GetHarFilenameFromIpAddress(ipAddress);
    }
    BootstrapHarFile(harFileName, onBootstrapped) {
        var onLoaded = function (cacheFile) {
            if (cacheFile) {
                cacheFile.Bootstrap();
            }
            onBootstrapped(cacheFile);
        };
        this.harResponseCache.LoadCacheFile(harFileName, onLoaded);
    }
}
exports.default = HarFileList;
