"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./config.js");
const queryString = require("query-string");
const urlParser = require("url");
const XRegExp = require("xregexp");
class harServerUrl {
    constructor(url) {
        this.config = config_js_1.default.Instance();
        var parsedUrl = urlParser.parse(url);
        this.SanitizeUrl(parsedUrl);
        this.OriginalUrl = parsedUrl.path;
        if (parsedUrl.query) {
            this.QueryString = parsedUrl.query;
        }
        else {
            this.QueryString = '';
        }
    }
    Equals(otherUrl) {
        if (this.Path !== otherUrl.Path) {
            return false;
        }
        return this.PropertiesMatch(this.queryParams, otherUrl.queryParams);
    }
    PropertiesMatch(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        for (var key in obj1) {
            if (obj1[key] === null || obj2[key] === null) {
                if (obj1[key] === null && obj2[key] === null) {
                    continue;
                }
                return false;
            }
            if (obj1[key].constructor === Array && obj2[key].constructor === Array) {
                if (!this.PropertiesMatch(obj1[key], obj2[key])) {
                    return false;
                }
            }
            else if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    }
    SanitizeUrl(parsedUrl) {
        var query = parsedUrl.query;
        function parseQuery(query) {
            var parsedQuery = [];
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i];
                var keyValue = param.split('=');
                var key = keyValue[0];
                var value = keyValue[1];
                if (!parsedQuery[key]) {
                    parsedQuery[key] = value;
                }
                else {
                    parsedQuery[key] += ',' + value;
                }
            }
            return parsedQuery;
        }
        try {
            this.queryParams = queryString.parse(parsedUrl.query);
        }
        catch (e) {
            this.queryParams = parseQuery(parsedUrl.query);
        }
        var queryParamsToIgnore = this.config.QueryParamsToIgnore.split(',');
        queryParamsToIgnore.push('harfileid');
        for (var toIgnoreKey in queryParamsToIgnore) {
            var toIgnoreValue = queryParamsToIgnore[toIgnoreKey];
            for (var queryParamKey in this.queryParams) {
                if (queryParamKey.toLowerCase() === toIgnoreValue.toLowerCase() && this.queryParams[queryParamKey]) {
                    delete this.queryParams[queryParamKey];
                }
            }
        }
        this.Path = this.ReplaceUrlComponents(parsedUrl.pathname);
    }
    ReplaceUrlComponents(path) {
        for (var i = 0; i < this.config.UrlReplacements.length; i++) {
            var urlReplacement = this.config.UrlReplacements[i];
            var regex = XRegExp(urlReplacement['regex'], 'g');
            path = XRegExp.replace(path, regex, urlReplacement['replacement']);
        }
        return path;
    }
}
exports.default = harServerUrl;
