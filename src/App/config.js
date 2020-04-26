"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base = require("./jsonFileLoader.js");
var path = require('path');
class Config extends base.JsonFileLoader {
    constructor(configFileOverride = undefined) {
        var configFilePath = '';
        if (configFileOverride) {
            configFilePath = path.join(__dirname, configFileOverride);
        }
        else {
            configFilePath = path.join(__dirname, '..', '..', 'config', 'config.json');
        }
        super(configFilePath);
    }
    static Instance(configFileOverride = undefined) {
        if (Config._instance === null || configFileOverride) {
            Config._instance = new Config(configFileOverride);
        }
        return Config._instance;
    }
    initialize() {
        this.ListenPort = 8080;
        this.ListenPortSSL = 4433;
        this.SSLKeyLocation = '';
        this.SSLCertLocation = '';
        this.CacheLifetime = 60;
        this.InjectJavascript = '_w.Math.random = function() {return 0;}; var d = new Date(2012, 2, 2); _w.Date = function() { return d; };';
        this.QueryParamsToIgnore = 'clientip,superforkersessionguid,bag';
        this.UrlReplacements = [];
        this.AzureStorageAccessKey = '';
        this.AzureStorageAccountName = '';
        this.AzureStorageContainerName = '';
        this.LoggingLevel = 'error';
        this.HarFilePath = '';
    }
    Load() {
        super.Load();
        Config._instance = this;
    }
    deserialize(json) {
        if (json.hasOwnProperty('ListenPort')) {
            this.ListenPort = json['ListenPort'];
        }
        if (json.hasOwnProperty('ListenPortSSL')) {
            this.ListenPortSSL = json['ListenPortSSL'];
        }
        if (json.hasOwnProperty('SSLKeyLocation')) {
            this.SSLKeyLocation = json['SSLKeyLocation'];
        }
        if (json.hasOwnProperty('SSLCertLocation')) {
            this.SSLCertLocation = json['SSLCertLocation'];
        }
        if (json.hasOwnProperty('CacheLifetime')) {
            this.CacheLifetime = json['CacheLifetime'];
        }
        if (json.hasOwnProperty('InjectJavascript')) {
            this.InjectJavascript = json['InjectJavascript'];
        }
        if (json.hasOwnProperty('QueryParamsToIgnore')) {
            this.QueryParamsToIgnore = json['QueryParamsToIgnore'];
        }
        if (json.hasOwnProperty('AzureStorageAccountName')) {
            this.AzureStorageAccountName = json['AzureStorageAccountName'];
        }
        if (json.hasOwnProperty('AzureStorageAccessKey')) {
            this.AzureStorageAccessKey = json['AzureStorageAccessKey'];
        }
        if (json.hasOwnProperty('AzureStorageContainerName')) {
            this.AzureStorageContainerName = json['AzureStorageContainerName'];
        }
        if (json.hasOwnProperty('LoggingLevel')) {
            this.LoggingLevel = json['LoggingLevel'];
        }
        if (json.hasOwnProperty('HarFilePath')) {
            this.HarFilePath = json['HarFilePath'];
        }
        if (json.hasOwnProperty('UrlReplacements')) {
            this.populateFromJson(json['UrlReplacements']);
        }
    }
    populateFromJson(jsonArray) {
        for (var i = 0; i < Object.keys(jsonArray).length; i++) {
            var jsonObj = jsonArray[i];
            if (jsonObj.hasOwnProperty('regex') && jsonObj.hasOwnProperty('replacement')) {
                this.UrlReplacements.push({ regex: jsonObj['regex'], replacement: jsonObj['replacement'] });
            }
        }
    }
}
Config._instance = null;
exports.default = Config;
