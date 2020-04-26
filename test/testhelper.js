"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harServer = require("../src/App/harServer.js");
function startServer(configInstance) {
    return harServer.start(configInstance.ListenPort, configInstance.ListenPortSSL, configInstance.SSLKeyLocation, configInstance.SSLCertLocation, configInstance.InjectJavascript, configInstance.CacheLifetime, configInstance.QueryParamsToIgnore, configInstance.AzureStorageAccountName, configInstance.AzureStorageAccessKey, configInstance.AzureStorageContainerName, configInstance.HarFilePath, configInstance.LoggingLevel, configInstance.UrlReplacements);
}
exports.startServer = startServer;
function stopServer() {
    harServer.stop();
}
exports.stopServer = stopServer;
