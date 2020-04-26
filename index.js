"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harServer = require("./src/App/harServer.js");
var listenPort = null;
var listenPortSSL = null;
var sslKeyLocation = null;
var sslCertLocation = null;
var cacheLifetime = null;
var injectJavascript = null;
var queryParamsToIgnore = null;
var azureStorageAccountName = null;
var azureStorageAccessKey = null;
var azureStorageContainerName = null;
var harfilepath = null;
var loggingLevel = null;
for (var arg in process.argv) {
    var index = parseInt(arg);
    if (process.argv.length > index + 1) {
        if (process.argv[arg].toLowerCase() == '--listenport') {
            listenPort = parseInt(process.argv[index + 1]);
        }
        else if (process.argv[arg].toLowerCase() == '--listenportssl') {
            listenPortSSL = parseInt(process.argv[index + 1]);
        }
        else if (process.argv[arg].toLowerCase() == '--sslkeylocation') {
            sslKeyLocation = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--sslcertlocation') {
            sslCertLocation = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--injectjavascript') {
            injectJavascript = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--cachelifetime') {
            cacheLifetime = parseInt(process.argv[index + 1]);
        }
        else if (process.argv[arg].toLowerCase() == '--queryparamstoignore') {
            queryParamsToIgnore = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--azurestorageaccountname') {
            azureStorageAccountName = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--azurestorageaccesskey') {
            azureStorageAccessKey = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--azurestoragecontainername') {
            azureStorageContainerName = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--harfilepath') {
            harfilepath = process.argv[index + 1];
        }
        else if (process.argv[arg].toLowerCase() == '--logginglevel') {
            loggingLevel = process.argv[index + 1];
        }
    }
}
harServer.start(listenPort, listenPortSSL, sslKeyLocation, sslCertLocation, injectJavascript, cacheLifetime, queryParamsToIgnore, azureStorageAccountName, azureStorageAccessKey, azureStorageContainerName, harfilepath, loggingLevel, null);
