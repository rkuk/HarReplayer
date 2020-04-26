"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./../config.js");
const harFile_js_1 = require("./../HarFile/harFile.js");
const harResponseCacheFile_js_1 = require("./harResponseCacheFile.js");
const azureStorageHarLookup_js_1 = require("./../azureStorageHarLookup.js");
const diskHarLookup_js_1 = require("./../diskHarLookup.js");
const logger_js_1 = require("./../logger.js");
class HarResponseCache {
    constructor() {
        this.harResponseCacheFiles = [];
        this.harResponseFilenamesByIP = [];
        this.azureStorageHarLookup = azureStorageHarLookup_js_1.default.Instance();
        this.diskHarLookup = diskHarLookup_js_1.default.Instance();
        this.config = config_js_1.default.Instance();
        this.usingAzureStorage = this.config.AzureStorageAccountName.length > 0;
        setInterval(this.CleanCache, 5000, this);
    }
    CleanCache(harResponseCache) {
        for (var i = 0; i < Object.keys(harResponseCache.harResponseCacheFiles).length; i++) {
            var key = Object.keys(harResponseCache.harResponseCacheFiles)[i];
            if (harResponseCache.harResponseCacheFiles[key].Expired()) {
                delete harResponseCache.harResponseCacheFiles[key];
                harResponseCache.RemoveEntriesFromIpAddressHarFilenameMapping(key);
            }
        }
    }
    RemoveEntriesFromIpAddressHarFilenameMapping(harFilename) {
        for (var i = 0; i < Object.keys(this.harResponseFilenamesByIP).length; i++) {
            var key = Object.keys(this.harResponseFilenamesByIP)[i];
            if (this.harResponseFilenamesByIP[key] === harFilename) {
                delete this.harResponseFilenamesByIP[key];
            }
        }
    }
    MapIpAddressToHarFilename(ipAddress, harFilename) {
        this.harResponseFilenamesByIP[ipAddress] = harFilename;
    }
    GetHarFilenameFromIpAddress(ipAddress) {
        return this.harResponseFilenamesByIP[ipAddress];
    }
    LoadCacheFile(harFileName, onLoaded) {
        if (!this.harResponseCacheFiles[harFileName]) {
            var onHarFileFound = (function (harFileName) {
                if (harFileName) {
                    var onDownloaded = (function (content) {
                        if (content) {
                            var jsonObj = JSON.parse(content);
                            var harFile = new harFile_js_1.default(harFileName, jsonObj);
                            var cacheFile = new harResponseCacheFile_js_1.default(harFile);
                            this.harResponseCacheFiles[harFileName] = cacheFile;
                            onLoaded(cacheFile);
                        }
                        else {
                            onLoaded(null);
                        }
                    }).bind(this);
                    logger_js_1.default.Instance().Log('info', 'Loading har file: ' + harFileName);
                    if (this.usingAzureStorage) {
                        var content = this.azureStorageHarLookup.LoadFile(harFileName, onDownloaded);
                    }
                    else {
                        var content = this.diskHarLookup.LoadFile(harFileName, onDownloaded);
                    }
                }
                else {
                    onLoaded(null);
                }
            }).bind(this);
            if (this.usingAzureStorage) {
                onHarFileFound(harFileName);
            }
            else {
                this.diskHarLookup.FindFromRequest(harFileName, onHarFileFound);
            }
        }
        else {
            onLoaded(this.harResponseCacheFiles[harFileName]);
        }
    }
}
exports.default = HarResponseCache;
