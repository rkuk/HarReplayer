"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
var azure = require('azure-storage');
class AzureStorageHarLookup {
    constructor(azureOverride = undefined) {
        this.HarFiles = [];
        this.azureStorageAccountName = config_js_1.default.Instance().AzureStorageAccountName;
        this.azureStorageAccessKey = config_js_1.default.Instance().AzureStorageAccessKey;
        this.azureStorageContainerName = config_js_1.default.Instance().AzureStorageContainerName;
        this.initialize(azureOverride);
    }
    static Instance() {
        if (AzureStorageHarLookup._instance === null) {
            AzureStorageHarLookup._instance = new AzureStorageHarLookup();
        }
        return AzureStorageHarLookup._instance;
    }
    initialize(azureOverride) {
        if (this.azureStorageAccountName.length > 0) {
            this.blobService = azure.createBlobService(this.azureStorageAccountName, this.azureStorageAccessKey);
        }
        else if (azureOverride) {
            this.blobService = azureOverride.createBlobService();
        }
    }
    LoadFile(filename, onDownloaded) {
        this.blobService.getBlobToText(this.azureStorageContainerName, filename, (function (err, blobContent, blob) {
            if (!err) {
                onDownloaded(blobContent);
            }
            else {
                logger_js_1.default.Instance().Log('error', 'Error downloading har file from Azure storage: ' + err.message);
                onDownloaded(null);
            }
        }).bind(this));
    }
}
AzureStorageHarLookup._instance = null;
exports.default = AzureStorageHarLookup;
