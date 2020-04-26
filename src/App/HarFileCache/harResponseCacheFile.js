"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("./../config.js");
var StringBuilder = require('string-builder');
class HarResponseCacheFile {
    constructor(harFile) {
        this.harResponseCacheEntries = [];
        this.harFile = harFile;
        this.config = config_js_1.default.Instance();
        this.injectedJavascript = false;
    }
    UpdateLastAccessTime() {
        var now = new Date();
        this.lastAccessTime = now.getTime();
    }
    Expired() {
        var now = new Date();
        return (now.getTime() - (this.config.CacheLifetime * 1000)) > this.lastAccessTime;
    }
    LoadCacheFileEntry(url) {
        this.UpdateLastAccessTime();
        var cacheKey = url.Path + '?' + url.QueryString;
        if (!this.harResponseCacheEntries[cacheKey]) {
            var entry = this.LoadEntry(url);
            if (entry) {
                if (!this.injectedJavascript) {
                    if (this.InjectJavascript(entry)) {
                        this.injectedJavascript = true;
                    }
                }
                this.harResponseCacheEntries[cacheKey] = entry;
            }
        }
        return this.harResponseCacheEntries[cacheKey];
    }
    Bootstrap() {
        this.harResponseCacheEntries = [];
        for (var idxEntry in this.harFile.Log.Entries) {
            var entry = this.harFile.Log.Entries[idxEntry];
            var cacheKey = entry.Request.url.Path + '?' + entry.Request.url.QueryString;
            this.harResponseCacheEntries[cacheKey] = entry;
        }
    }
    LoadEntry(url) {
        return this.harFile.FindRequest(url);
    }
    InjectJavascript(entry) {
        if (this.config.InjectJavascript.length > 0) {
            if (entry.Response.content_mimeType.indexOf('html') > 0) {
                var sb = new StringBuilder();
                var idxStartHtml = entry.Response.content_text.indexOf('<head');
                if (idxStartHtml >= 0) {
                    var idxJsInsertionPoint = entry.Response.content_text.indexOf('>', idxStartHtml);
                    if (idxJsInsertionPoint >= 0) {
                        sb.append(entry.Response.content_text.substring(0, idxJsInsertionPoint + 1));
                        sb.append('<script type="text/javascript">');
                        sb.append('//<![CDATA[\r\n');
                        sb.append(this.config.InjectJavascript);
                        sb.append('\r\n//]]>');
                        sb.append('</script>');
                        sb.append(entry.Response.content_text.substring(idxJsInsertionPoint + 1, entry.Response.content_text.length));
                        entry.Response.setContentText(sb.toString());
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.default = HarResponseCacheFile;
