"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class JsonFileLoader {
    constructor(filepath) {
        this.filepath = '';
        this.filepath = filepath;
        this.initialize();
        this.Load();
    }
    initialize() {
    }
    Load() {
        if (!fs.existsSync(this.filepath)) {
            this.Save();
        }
        else {
            var content = fs.readFileSync(this.filepath, 'utf8');
            var json = JSON.parse(content);
            this.deserialize(json);
        }
    }
    deserialize(json) {
    }
    Save() {
        var jsonConfig = this.ToString();
        fs.writeFileSync(this.filepath, jsonConfig);
    }
    ToString() {
        function omitKeys(obj) {
            var dup = {};
            for (var key in obj) {
                if (key !== 'filepath') {
                    dup[key] = obj[key];
                }
            }
            return dup;
        }
        return JSON.stringify(omitKeys(this), null, '\t');
    }
}
exports.JsonFileLoader = JsonFileLoader;
