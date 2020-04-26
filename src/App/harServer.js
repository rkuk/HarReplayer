"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
const harFileList_js_1 = require("./harFileList.js");
const fs = require("fs");
const express = require("express");
const urlParser = require("url");
const queryString = require("query-string");
var https = require('https');
var http = require('http');
var compression = require('compression');
var httpServer, httpsServer = null;
var config = config_js_1.default.Instance();
var harFileList;
function start(listenPort, listenPortSSL, sslKeyLocation, sslCertLocation, injectJavascript, cacheLifetime, queryParamsToIgnore, azureStorageAccountName, azureStorageAccessKey, azureStorageContainerName, harfilepath, loggingLevel, urlReplacements) {
    setConfigFromArgs(listenPort, listenPortSSL, sslKeyLocation, sslCertLocation, injectJavascript, cacheLifetime, queryParamsToIgnore, azureStorageAccountName, azureStorageAccessKey, azureStorageContainerName, harfilepath, loggingLevel, urlReplacements);
    var app = express();
    app.use(compression());
    this.harFileList = new harFileList_js_1.default();
    module.exports.stop();
    function sendResponse(responseObj, responseBytes, harFileEntry) {
        for (var i = 0; i < harFileEntry.Response.Headers.length; i++) {
            var header = harFileEntry.Response.Headers[i];
            if (header.name.toLowerCase() !== 'content-encoding') {
                if (header.name === 'Content-Length') {
                    responseObj.setHeader(header.name, responseBytes.length);
                }
                else {
                    responseObj.setHeader(header.name, header.value);
                }
            }
        }
        responseObj.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        responseObj.setHeader('Expires', '-1');
        responseObj.setHeader('Pragma', 'no-cache');
        responseObj.statusCode = 200;
        responseObj.end(responseBytes);
    }
    function setConfigFromArgs(listenPort, listenPortSSL, sslKeyLocation, sslCertLocation, injectJavascript, cacheLifetime, queryParamsToIgnore, azureStorageAccountName, azureStorageAccessKey, azureStorageContainerName, harfilepath, loggingLevel, urlReplacements) {
        if (listenPort) {
            config.ListenPort = listenPort;
        }
        if (listenPortSSL) {
            config.ListenPortSSL = listenPortSSL;
        }
        if (sslKeyLocation) {
            config.SSLKeyLocation = sslKeyLocation;
        }
        if (sslCertLocation) {
            config.SSLCertLocation = sslCertLocation;
        }
        if (injectJavascript) {
            config.InjectJavascript = injectJavascript;
        }
        if (cacheLifetime) {
            config.CacheLifetime = cacheLifetime;
        }
        if (queryParamsToIgnore) {
            config.QueryParamsToIgnore = queryParamsToIgnore;
        }
        if (azureStorageAccountName) {
            config.AzureStorageAccountName = azureStorageAccountName;
        }
        if (azureStorageAccessKey) {
            config.AzureStorageAccessKey = azureStorageAccessKey;
        }
        if (azureStorageContainerName) {
            config.AzureStorageContainerName = azureStorageContainerName;
        }
        if (harfilepath) {
            config.HarFilePath = harfilepath;
        }
        if (loggingLevel) {
            config.LoggingLevel = loggingLevel;
        }
        if (urlReplacements) {
            config.UrlReplacements = urlReplacements;
        }
    }
    const requestHandler = (request, response) => {
        if (request.path === '/pinghealth') {
            response.end();
        }
        else {
            var harFileName = getHarFileNameFromHeaders(request);
            if (!harFileName) {
                var originIPAddress = request.ip;
                if (originIPAddress) {
                    harFileName = getHarFileNameFromUrlParams(request.url);
                    if (harFileName) {
                        this.harFileList.MapIpAddressToHarFilename(originIPAddress, harFileName);
                    }
                    else {
                        harFileName = this.harFileList.GetHarFilenameFromIpAddress(originIPAddress);
                    }
                }
            }
            if (harFileName) {
                if (request.path === '/bootstrap') {
                    logger_js_1.default.Instance().Log('info', 'Bootstrap for har file: ' + harFileName);
                    var onBootstrapped = function (cacheFile) {
                        if (cacheFile) {
                            response.end();
                            logger_js_1.default.Instance().Log('info', 'bootstrap complete');
                        }
                        else {
                            logger_js_1.default.Instance().Log('error', 'bootstrap failed to load har file');
                            sendErrorResponse(response);
                        }
                    };
                    this.harFileList.BootstrapHarFile(harFileName, onBootstrapped);
                }
                else {
                    var onFoundHarFileEntry = function (entry) {
                        if (entry) {
                            logger_js_1.default.Instance().Log("info", request.url);
                            sendResponse(response, entry.Response.contentBytes(), entry);
                        }
                        else {
                            logger_js_1.default.Instance().Log('warn', 'Couldn\'t find har file entry for request url: ' + request.url);
                            sendErrorResponse(response);
                        }
                    };
                    this.harFileList.FindHarFileRequest(request.url, harFileName, onFoundHarFileEntry);
                }
            }
            else {
                logger_js_1.default.Instance().Log('error', 'Unable to get har file name from header or ip address');
                sendErrorResponse(response);
            }
        }
    };
    function sendErrorResponse(response) {
        response.statusCode = 404;
        response.end();
    }
    function getHarFileNameFromUrlParams(url) {
        const queryParamKey = "harfileid";
        var parsedUrl = urlParser.parse(url);
        var queryParams = queryString.parse(parsedUrl.query);
        if (Array.isArray(queryParams[queryParamKey])) {
            return queryParams[queryParamKey][0];
        }
        else {
            return queryParams[queryParamKey];
        }
    }
    function getHarFileNameFromHeaders(request) {
        for (var header in request.headers) {
            if (header.toLowerCase() === 'x-harfileid') {
                return request.headers[header];
            }
        }
        return null;
    }
    function postHandler(request, response) {
        response.statusCode = 404;
        response.end();
    }
    app.get('*', requestHandler);
    app.post('*', postHandler);
    function appCallback(err, listenPort, protocol) {
        if (err) {
            return logger_js_1.default.Instance().Log('error', 'Can\'t listen on port' + listenPort);
        }
        logger_js_1.default.Instance().Log('info', protocol + ' server is listening on ' + listenPort);
    }
    httpServer = http.createServer(app).listen(config.ListenPort, (err) => appCallback(err, config.ListenPort, "HTTP"));
    if (fs.existsSync(config.SSLKeyLocation) && fs.existsSync(config.SSLCertLocation)) {
        var httpsOptions = {
            key: fs.readFileSync(config.SSLKeyLocation),
            cert: fs.readFileSync(config.SSLCertLocation)
        };
        httpsServer = https.createServer(httpsOptions, app).listen(config.ListenPortSSL, (err) => appCallback(err, config.ListenPortSSL, "HTTPS"));
    }
    else {
        logger_js_1.default.Instance().Log('info', 'Couldn\'t find certificate files - SSL not available.');
    }
    return app;
}
exports.start = start;
function stop() {
    config.Save();
    function stopServer(server, protocol) {
        if (server != null) {
            server.close();
            server = null;
            logger_js_1.default.Instance().Log('info', protocol + ' server connection closed');
        }
    }
    stopServer(httpServer, 'HTTP');
    stopServer(httpsServer, 'HTTPS');
}
exports.stop = stop;
